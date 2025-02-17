import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Divider from "@mui/material/Divider";
import FormControl from "@mui/material/FormControl";
import FormHelperText from "@mui/material/FormHelperText";

import InputLabel from "@mui/material/InputLabel";
import OutlinedInput from "@mui/material/OutlinedInput";
import Select from "@mui/material/Select";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid2";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { PlusCircle as PlusCircleIcon } from "@phosphor-icons/react/dist/ssr/PlusCircle";
import { Controller, FormProvider, useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { z as zod } from "zod";

import { paths } from "@/paths";

import { logger } from "@/lib/default-logger";
import { Option } from "@/components/core/option";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import {
  CardActions,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableContainer,
  Paper,
  Box,
} from "@mui/material";
import {
  useCreateAsiento,
  useUpdateAsiento,
} from "@/api/asientos/asientos-request";
import { DatCentro } from "@/api/asientos/asientos-types";
import { AccountSelectionModal } from "./account-selection";
import LineItemRow from "./asientos-line-item-row";
import { TransaccionContableResponseType } from "@/api/transaccion_contable/transaccion-contable-types";
import { useGetTransaccionContable } from "@/api/transaccion_contable/transaccion-contable-request";
import { useGetCentroCosto } from "@/api/centro_costo/centro-costo-request";
import { dayjs } from "@/lib/dayjs";
import { setFeedback } from "@/state/slices/feedBackSlice";
import { useDispatch, useSelector } from "react-redux";

import "dayjs/locale/es";
import { useQueryClient } from "react-query";
import { RootState } from "@/state/store";

dayjs.locale("es");

const getCurrentDate = (): string => {
  const today = new Date();
  return today?.toISOString()?.split("T")?.[0]; // Devuelve 'YYYY-MM-DD'
};

const asientoItemSchema = zod.object({
  id: zod.number().optional(),
  codigo_centro: zod.string().min(1, "Código centro es requerido"),
  cta: zod.string().min(1, "Cuenta es requerida"),
  cta_nombre: zod.string().min(1, "Nombre de la cuenta es requerido"),
  debe: zod.union([zod.string(), zod.number()]),
  haber: zod.union([zod.string(), zod.number()]),
  nota: zod.string().optional(),
});

const asientoSchema = zod.object({
  fecha_emision: zod.string().min(1, "Fecha de emisión es requerida"),
  nro_asiento: zod.string().min(1, "Número de asiento es requerido"),
  comentario: zod.string().default(""),
  codigo_transaccion: zod.string().min(1, "Código de transacción es requerido"),
  estado: zod.string().min(1, "Estado es requerido"),
  nro_referencia: zod.string().min(1, "Número de referencia es requerido"),
  codigo_centro: zod.string().min(1, "Código centro es requerido"),
  total_debe: zod.number().min(0, "Total debe es requerido"),
  total_haber: zod.number().min(0, "Total haber es requerido"),
  total: zod.number().optional(),
  lineItems: zod.array(asientoItemSchema).min(1, "Debe haber al menos un ítem"),
});

type Values = zod.infer<typeof asientoSchema>;

const defaultValues: Values = {
  nro_asiento: "",
  codigo_transaccion: "",
  fecha_emision: getCurrentDate(),
  comentario: "",
  nro_referencia: "",
  codigo_centro: "",
  estado: "Activo",
  total_debe: 0,
  total_haber: 0,
  total: 0,
  lineItems: [
    {
      codigo_centro: "",
      cta: "",
      cta_nombre: "",
      debe: "0",
      haber: "0",
      nota: "",
    },
  ],
};

type AsientosFormProps = {
  asiento?: Values;
};

export function AsientosForm({
  asiento,
}: AsientosFormProps): React.JSX.Element {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const handleCancel = () => {
    navigate(paths.dashboard.asientos.index);
  };

  const methods = useForm<Values>({
    defaultValues: asiento
      ? {
          ...defaultValues,
          ...asiento,
          lineItems:
            asiento.lineItems && asiento.lineItems.length > 0
              ? asiento.lineItems
              : defaultValues.lineItems,
        }
      : defaultValues,
    resolver: zodResolver(asientoSchema),
  });

  React.useEffect(() => {
    if (asiento) {
      methods.reset({
        ...defaultValues,
        ...asiento,
        lineItems:
          asiento.lineItems && asiento.lineItems.length > 0
            ? asiento.lineItems
            : defaultValues.lineItems,
      });
    }
  }, [asiento, methods]);

  const {
    control,
    handleSubmit,
    formState: { errors },
    clearErrors,
    getValues,
    setValue,
    watch,
  } = methods;

  //console.log(errors);
  const { selectedEmpresa } = useSelector((state: RootState) => state.empresaSlice);

  const {
    data: centros = [],
    isLoading: isLoadingCentros,
    isError: isErrorCentros,
  } = useGetCentroCosto(selectedEmpresa.id); 

  

  const {
    data: transacciones = [],
    isLoading: isLoadingTransacciones,
    isError: isErrorTransacciones,
  } = useGetTransaccionContable(selectedEmpresa.id); 

  const dispatch = useDispatch();

  const onUpdateSuccess = React.useCallback(() => {
    dispatch(
      setFeedback({
        message: "Asiento actualizado exitosamente",
        severity: "success",
        isError: false,
      })
    );
  }, [dispatch]);

  const onUpdateError = React.useCallback(
    (error: any) => {
      logger.error("Error al actualizar el asiento:", error);
      dispatch(
        setFeedback({
          message: "Algo salió mal al actualizar el asiento",
          severity: "error",
          isError: true,
        })
      );
    },
    [dispatch]
  );

  const { mutate: createAsiento } = useCreateAsiento();
  const { mutate: updateAsiento } = useUpdateAsiento(
    onUpdateSuccess,
    onUpdateError
  );

  const validateTotals = (totalDebe: number, totalHaber: number) => {
    const totalCombined = Math.abs(totalDebe - totalHaber);

    if (totalCombined !== 0) {
      dispatch(
        setFeedback({
          message:
            "El saldo debe estar balanceado. La diferencia entre Debe y Haber debe ser cero.",
          severity: "error",
          isError: false,
        })
      );
      return false;
    }

    if (totalDebe === 0 && totalHaber === 0) {
      dispatch(
        setFeedback({
          message: "No se puede enviar un asiento sin valores en Debe o Haber.",
          severity: "error",
          isError: false,
        })
      );
      return false;
    }
    return true;
  };

  const onSubmit = React.useCallback(
    async (data: Values): Promise<void> => {
      try {
        //console.log("Datos enviados:",data)
        const totalDebe = parseFloat((getValues("total_debe") || 0).toFixed(2));
        const totalHaber = parseFloat(
          (getValues("total_haber") || 0).toFixed(2)
        );

        if (!validateTotals(totalDebe, totalHaber)) return;

        const { total, lineItems, ...asientoData } = data;
        const dataToSend = {
          ...asientoData,
          empresa_id: selectedEmpresa.id,
          total_debe: parseFloat(asientoData.total_debe.toFixed(2)),
          total_haber: parseFloat(asientoData.total_haber.toFixed(2)),
          lineItems: lineItems.map((item) => {
            return {
              ...item,
              debe: parseFloat(item?.debe?.toString() || "0"),
              haber: parseFloat(item?.haber?.toString() || "0"),
            };
          }),
        };
        //id del use Params arriba
        if (id) {
          updateAsiento({
            id: Number(id),
            data: dataToSend,
            empresa_id: selectedEmpresa.id
          });

          queryClient.invalidateQueries(["asiento", id]);
        } else {
          createAsiento(dataToSend);
          dispatch(
            setFeedback({
              message: "Asiento creado exitosamente",
              severity: "success",
              isError: false,
            })
          );
        }

        navigate(paths.dashboard.asientos.index);
      } catch (err) {
        console.log(err);
        logger.error(err);
        dispatch(
          setFeedback({
            message: "Algo salió mal!",
            severity: "error",
            isError: true,
          })
        );
      }
    },
    [id, navigate, createAsiento, updateAsiento, getValues, validateTotals]
  );

  const handleCentroChange = React.useCallback(
    (selectedCentro: string) => {
      const lineItems = getValues("lineItems") || [];

      if (lineItems.length === 0) {
        setValue("lineItems", [
          {
            codigo_centro: selectedCentro,
            cta: "",
            cta_nombre: "",
            debe: "0",
            haber: "0",
            nota: "",
          },
        ]);
      } else {
        setValue(`lineItems.0.codigo_centro`, selectedCentro);
        clearErrors(`lineItems.0.codigo_centro`);
      }
    },
    [getValues, setValue, clearErrors]
  );

  const handleAddLineItem = React.useCallback(() => {
    const lineItems = getValues("lineItems") || [];
    const currentCentro = getValues("codigo_centro") || "";

    setValue("lineItems", [
      ...lineItems,
      {
        codigo_centro: currentCentro,
        cta: "",
        cta_nombre: "",
        debe: "0",
        haber: "0",
        nota: "",
      },
    ]);
  }, [getValues, setValue]);

  const handleRemoveLineItem = React.useCallback(
    (index: number) => {
      const lineItems = getValues("lineItems") || [];
      const newLineItems = lineItems.filter((_, i) => i !== index);
      setValue(
        "lineItems",
        newLineItems.map((item) => ({
          ...item,
          debe: item.debe,
          haber: item.haber,
        }))
      );
    },
    [getValues, setValue]
  );

  let lineItems = watch("lineItems") || [];

  React.useEffect(() => {
    if (!lineItems) return;

    const totalDebe: number = lineItems.reduce(
      (acc, item) => acc + (Number(item?.debe) || 0),
      0
    );

    const totalHaber: number = lineItems.reduce(
      (acc, item) => acc + Number(item?.haber) || 0,
      0
    );
    const totalCombined = parseFloat((totalDebe - totalHaber).toFixed(2));

    setValue("total_debe", totalDebe);
    setValue("total_haber", totalHaber);
    setValue("total", totalCombined);
  }, [lineItems, setValue]);

  const handleTransaccionChange = React.useCallback(
    (selectedTransaccion: string) => {
      const selectedTransaccionData = transacciones.find(
        (transaccion: TransaccionContableResponseType) =>
          transaccion.codigo_transaccion === selectedTransaccion
      );
      //console.log(selectedTransaccionData);
      if (selectedTransaccionData) {
        const currentYear = new Date().getFullYear();
        const nroAsiento = `${currentYear}-${selectedTransaccionData.codigo_transaccion}-${selectedTransaccionData.secuencial}`;
        setValue("nro_asiento", nroAsiento);
      } else {
        console.error("Transacción seleccionada no encontrada");
      }
    },
    [transacciones, setValue]
  );

  const [openModal, setOpenModal] = React.useState(false);
  const [selectedIndex, setSelectedIndex] = React.useState<number | null>(null);

  const handleOpenModal = (index: number) => {
    setSelectedIndex(index);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const handleSelectAccount = (code: string, name: string) => {
    if (selectedIndex !== null) {
      setValue(`lineItems.${selectedIndex}.cta`, code);
      setValue(`lineItems.${selectedIndex}.cta_nombre`, name);
    }
    handleCloseModal();
  };


  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Card>
          <CardContent>
            <Stack spacing={4}>
              <Stack spacing={3}>
                <Grid container spacing={3}>
                  <Grid size={{ md: 6, xs: 12 }}>
                    <Controller
                      control={control}
                      name="codigo_transaccion"
                      render={({ field }) => (
                        <FormControl fullWidth>
                          <InputLabel>Transacción</InputLabel>
                          <Select
                            {...field}
                            label="Transaccion"
                            disabled={
                              isLoadingTransacciones || isErrorTransacciones
                            }
                            value={
                              transacciones.some(
                                (t) => t.codigo_transaccion === field.value
                              )
                                ? field.value
                                : ""
                            }
                            onChange={(e) => {
                              field.onChange(e);
                              handleTransaccionChange(e.target.value);
                            }}
                          >
                            {isErrorTransacciones && (
                              <Option value="">
                                <em>Error cargando transacciones</em>
                              </Option>
                            )}
                            {isLoadingTransacciones ? (
                              <Option value="">
                                <em>Cargando transacciones...</em>
                              </Option>
                            ) : (
                              transacciones?.map(
                                (
                                  transaccion: TransaccionContableResponseType
                                ) => (
                                  <Option
                                    key={transaccion.id}
                                    value={transaccion.codigo_transaccion}
                                  >
                                    {transaccion.nombre}
                                  </Option>
                                )
                              )
                            )}
                          </Select>
                          {errors.codigo_transaccion && (
                            <FormHelperText error>
                              {errors.codigo_transaccion.message}
                            </FormHelperText>
                          )}
                        </FormControl>
                      )}
                    />
                  </Grid>
                  <Grid size={{ md: 6, xs: 12 }}>
                    <Controller
                      control={control}
                      name="estado"
                      render={({ field }) => (
                        <FormControl fullWidth>
                          <InputLabel>Estado:</InputLabel>
                          <OutlinedInput {...field} />
                        </FormControl>
                      )}
                    />
                  </Grid>
                  <Grid size={{ md: 6, xs: 12 }}>
                    <Controller
                      control={control}
                      name="nro_asiento"
                      render={({ field }) => (
                        <FormControl fullWidth>
                          <InputLabel>Número:</InputLabel>
                          <OutlinedInput
                            {...field}
                            readOnly
                            sx={{
                              backgroundColor: "#f5f5f5",
                              color: "#777777", // Texto gris
                              "& .MuiOutlinedInput-notchedOutline": {
                                borderColor: "#bdbdbd", // Borde gris
                              },
                            }}
                          />
                        </FormControl>
                      )}
                    />
                  </Grid>
                  <Grid size={{ md: 6, xs: 12 }}>
                    <LocalizationProvider
                      dateAdapter={AdapterDayjs}
                      adapterLocale="es"
                    >
                      <Controller
                        control={control}
                        name="fecha_emision"
                        render={({ field }) => (
                          <DatePicker
                            {...field}
                            label="Fecha Tr"
                            format="YYYY-MM-DD"
                            value={
                              field.value
                                ? dayjs(field.value, "YYYY-MM-DD")
                                : null
                            }
                            onChange={(date) => {
                              field.onChange(
                                date ? date.format("YYYY-MM-DD") : ""
                              );
                            }}
                            slotProps={{
                              textField: {
                                error: Boolean(errors.fecha_emision),
                                fullWidth: true,
                                helperText: errors.fecha_emision?.message,
                              },
                            }}
                          />
                        )}
                      />
                    </LocalizationProvider>
                  </Grid>
                  <Grid size={{ md: 6, xs: 12 }}>
                    <Controller
                      control={control}
                      name="comentario"
                      render={({ field }) => (
                        <FormControl
                          error={Boolean(errors.comentario)}
                          fullWidth
                        >
                          <InputLabel>Comentario</InputLabel>
                          <OutlinedInput
                            {...field}
                            placeholder="e.g Esto es una Prueba"
                          />
                          {errors.comentario && (
                            <FormHelperText error>
                              {errors.comentario.message}
                            </FormHelperText>
                          )}
                        </FormControl>
                      )}
                    />
                  </Grid>
                  <Grid size={{ md: 6, xs: 12 }}>
                    <Controller
                      control={control}
                      name="nro_referencia"
                      render={({ field }) => (
                        <FormControl fullWidth>
                          <InputLabel>Nro. Ref</InputLabel>
                          <OutlinedInput {...field} />
                          {errors.nro_referencia && (
                            <FormHelperText error>
                              {errors.nro_referencia.message}
                            </FormHelperText>
                          )}
                        </FormControl>
                      )}
                    />
                  </Grid>
                  <Grid size={{ md: 6, xs: 12 }}>
                    <Controller
                      control={control}
                      name="codigo_centro"
                      render={({ field }) => (
                        <FormControl fullWidth>
                          <InputLabel>Centro</InputLabel>
                          <Select
                            {...field}
                            label="Centro"
                            disabled={isLoadingCentros || isErrorCentros}
                            value={
                              centros.some((c) => c.codigo === field.value)
                                ? field.value
                                : ""
                            }
                            onChange={(e) => {
                              field.onChange(e);
                              handleCentroChange(e.target.value);
                            }}
                          >
                            {isErrorCentros && (
                              <Option value="">
                                <em>Error cargando centros</em>
                              </Option>
                            )}

                            {isLoadingCentros ? (
                              <Option value="">
                                <em>Cargando centros...</em>
                              </Option>
                            ) : (
                              centros?.map((centro: DatCentro) => (
                                <Option key={centro.id} value={centro.codigo}>
                                  {centro.nombre}
                                </Option>
                              ))
                            )}
                          </Select>
                          {errors.codigo_centro && (
                            <FormHelperText error>
                              {errors.codigo_centro.message}
                            </FormHelperText>
                          )}
                        </FormControl>
                      )}
                    />
                  </Grid>
                </Grid>
              </Stack>

              <Divider sx={{ borderBottomWidth: 2, borderColor: "darkgray" }} />

              <Stack spacing={3}>
                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                  mb={0}
                >
                  <Typography variant="h6">Items</Typography>
                  <Button
                    color="secondary"
                    onClick={handleAddLineItem}
                    startIcon={<PlusCircleIcon />}
                    variant="outlined"
                  >
                    Agregar Item
                  </Button>
                </Box>
                <Stack spacing={2}>
                  <TableContainer component={Paper}>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell></TableCell>
                          <TableCell>Centro</TableCell>
                          <TableCell>Cta.</TableCell>
                          <TableCell>Cta. Nombre</TableCell>
                          <TableCell>Debe</TableCell>
                          <TableCell>Haber</TableCell>
                          <TableCell>Nota</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {lineItems.map((item, index) => (
                          <LineItemRow
                            key={index}
                            item={item}
                            index={index}
                            onRemove={handleRemoveLineItem}
                            handleOpenModal={handleOpenModal}
                            handleCentroChange={handleCentroChange}
                          />
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                  <AccountSelectionModal
                    open={openModal}
                    onClose={handleCloseModal}
                    onSelect={handleSelectAccount}
                  />
                </Stack>
              </Stack>

              <Stack spacing={3}>
                <Grid
                  container
                  spacing={2}
                  alignItems="center"
                  justifyContent="flex-end"
                  sx={{ marginTop: "5px" }}
                >
                  <Grid size={{ xs: 12, md: 2 }}>
                    <Typography variant="body1" sx={{ fontWeight: "bold" }}>
                      Totales:
                    </Typography>
                  </Grid>

                  <Grid size={{ xs: 12, md: 3 }}>
                    <Controller
                      control={control}
                      name="total_debe"
                      render={({ field }) => (
                        <FormControl fullWidth>
                          <OutlinedInput
                            {...field}
                            sx={{
                              backgroundColor: "#FFFACD", // Color amarillo claro
                              fontWeight: "bold",
                              textAlign: "right",
                            }}
                            value={field.value || "0.00"}
                            readOnly
                          />
                        </FormControl>
                      )}
                    />
                  </Grid>

                  <Grid size={{ xs: 12, md: 3 }}>
                    <Controller
                      control={control}
                      name="total_haber"
                      render={({ field }) => (
                        <FormControl fullWidth>
                          <OutlinedInput
                            {...field}
                            sx={{
                              backgroundColor: "#FFFACD", // Color amarillo claro
                              fontWeight: "bold",
                              textAlign: "right",
                            }}
                            value={field.value || "0.00"}
                            readOnly
                          />
                        </FormControl>
                      )}
                    />
                  </Grid>

                  <Grid size={{ xs: 12, md: 3 }}>
                    <Controller
                      control={control}
                      name="total"
                      render={({ field }) => (
                        <FormControl fullWidth>
                          <OutlinedInput
                            {...field}
                            readOnly
                            sx={{
                              fontWeight: "bold",
                              textAlign: "right",
                            }}
                            value={field.value || "0.00"}
                          />
                        </FormControl>
                      )}
                    />
                  </Grid>
                </Grid>
              </Stack>
            </Stack>
          </CardContent>
          <CardActions sx={{ justifyContent: "flex-end" }}>
            <Button color="secondary" onClick={handleCancel}>
              Cancel
            </Button>
            <Button type="submit" variant="contained">
              {asiento ? "Actualizar Asiento" : "Crear Asiento"}
            </Button>
          </CardActions>
        </Card>
      </form>
    </FormProvider>
  );
}
