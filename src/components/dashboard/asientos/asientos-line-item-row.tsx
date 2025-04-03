import React from "react";
import { Controller, useFormContext } from "react-hook-form";
import {
  OutlinedInput,
  TableCell,
  TableRow,
  IconButton,
  Select,
  FormHelperText,
  CircularProgress,
  Typography,
} from "@mui/material";
import { Trash as TrashIcon } from "@phosphor-icons/react/dist/ssr/Trash";
import { Option } from "@/components/core/option";
import { AsientoItem, DatCentro } from "@/api/asientos/asientos-types";
import { useGetCentroCosto } from "@/api/centro_costo/centro-costo-request";
import { normalizeNumericValue } from "@/utils/normalize-numbers";
import { useSelector } from "react-redux";
import { RootState } from "@/state/store";

interface LineItemRowProps {
  item: any;
  index: number;
  onRemove: (id: number) => void;
  handleOpenModal: (index: number) => void;
  handleCentroChange: (centro: string) => void;
}

const LineItemRow: React.FC<LineItemRowProps> = ({
  item,
  index,
  onRemove,
  handleOpenModal,
  handleCentroChange,
}) => {
  const {
    control,
    setValue,
    getValues,
    register,
    formState: { errors },
    clearErrors,
  } = useFormContext<{ lineItems: AsientoItem[] }>();

  React.useEffect(() => {
    if (item?.id !== undefined) {
      setValue(`lineItems.${index}.id`, item.id);
    }
  }, [item?.id, index, setValue]);

  const { selectedEmpresa } = useSelector((state: RootState) => state.empresaSlice);

  const {
    data: centros = [],
    isLoading: isLoadingCentros,
    isError: isErrorCentros,
  } = useGetCentroCosto(selectedEmpresa.id);

  const handleDebeChange = (value: string) => {
    const normalizedValue = normalizeNumericValue(value);
    const updatedItems = [...getValues("lineItems")];
    updatedItems[index].debe = normalizedValue;
    setValue("lineItems", updatedItems);

    if (normalizedValue !== "0") setValue(`lineItems.${index}.haber`, "0");
  };

  const handleHaberChange = (value: string) => {
    const normalizedValue = normalizeNumericValue(value);
    const updatedItems = [...getValues("lineItems")];
    updatedItems[index].haber = normalizedValue;
    setValue("lineItems", updatedItems);

    if (normalizedValue !== "0") setValue(`lineItems.${index}.debe`, "0");
  };

  const lineItemErrors = errors.lineItems?.[index];

  return (
    <TableRow key={item.index}>
      <TableCell>
        <IconButton
          onClick={() => onRemove(index)}
          sx={{ alignSelf: "flex-end" }}
        >
          <TrashIcon />
        </IconButton>
      </TableCell>
      {item?.id !== undefined && (
        <TableCell style={{ display: "none" }}> {/* Ocultar celda */}
          <input type="hidden" {...register(`lineItems.${index}.id`)} />
        </TableCell>
      )}
      <TableCell>
        <Controller
          control={control}
          name={`lineItems.${index}.codigo_centro`}
          render={({ field }) => (
            <>
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
                error={!!lineItemErrors?.codigo_centro}
              >
                {isErrorCentros && (
                  <Option value="">
                    <em>Error cargando centros</em>
                  </Option>
                )}

                {isLoadingCentros ? (
                  <Option value="">
                    <CircularProgress size={20} />
                    <Typography sx={{ ml: 1 }}>Cargando centros...</Typography>
                  </Option>
                ) : (
                  centros?.map((centro: DatCentro) => (
                    <Option key={centro.id} value={centro.codigo}>
                      {centro.nombre}
                    </Option>
                  ))
                )}
              </Select>
              {lineItemErrors?.codigo_centro && (
                <FormHelperText error>
                  {lineItemErrors.codigo_centro.message}
                </FormHelperText>
              )}
            </>
          )}
        />
      </TableCell>
      <TableCell>
        <Controller
          control={control}
          name={`lineItems.${index}.cta`}
          render={({ field }) => (
            <>
              <OutlinedInput
                {...field}
                fullWidth
                autoComplete="new-cta"
                error={!!lineItemErrors?.cta}
                onClick={() => {
                  handleOpenModal(index);
                  if (lineItemErrors?.cta) {
                    clearErrors(`lineItems.${index}.cta`);
                  }
                }}
                readOnly
              />
              {lineItemErrors?.cta && (
                <FormHelperText error>
                  {lineItemErrors.cta.message}
                </FormHelperText>
              )}
            </>
          )}
        />
      </TableCell>
      <TableCell>
        <Controller
          control={control}
          name={`lineItems.${index}.cta_nombre`}
          render={({ field }) => (
            <>
              <OutlinedInput
                {...field}
                fullWidth
                sx={{
                  backgroundColor: "#f5f5f5",
                  color: "#777777", // Texto gris
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#bdbdbd", // Borde gris
                  },
                }}
                readOnly
              />
            </>
          )}
        />
      </TableCell>
      <TableCell>
        <Controller
          control={control}
          name={`lineItems.${index}.debe`}
          defaultValue={item?.debe || 0}
          render={({ field }) => (
            <>
              <OutlinedInput
                {...field}
                inputProps={{ min: 0, step: 1, inputMode: 'decimal' }}
                error={!!lineItemErrors?.debe}
                onChange={(e) => {
                  const value = e.target.value;
                  if (field.value === 0 || field.value === '0') {
                    handleDebeChange(value.replace(/^0+/, ''));
                  } else {
                    handleDebeChange(value);
                  }
                }}
                value={field.value === 0 ? '' : field.value}
                fullWidth
              />
              {lineItemErrors?.debe && (
                <FormHelperText error>
                  {lineItemErrors.debe.message}
                </FormHelperText>
              )}
            </>
          )}
        />
      </TableCell>
      <TableCell>
        <Controller
          control={control}
          name={`lineItems.${index}.haber`}
          defaultValue={item?.haber || 0}
          render={({ field }) => (
            <>
              <OutlinedInput
                {...field}
                inputProps={{ min: 0, step: 1, inputMode: 'decimal' }}
                error={!!lineItemErrors?.haber}
                onChange={(e) => {
                  const value = e.target.value;
                  if (field.value === 0 || field.value === '0') {
                    handleHaberChange(value.replace(/^0+/, ''));
                  } else {
                    handleHaberChange(value);
                  }
                }}
                value={field.value === 0 ? '' : field.value}
                fullWidth
              />
              {lineItemErrors?.haber && (
                <FormHelperText error>
                  {lineItemErrors.haber.message}
                </FormHelperText>
              )}
            </>
          )}
        />
      </TableCell>
      <TableCell>
        <Controller
          control={control}
          name={`lineItems.${index}.nota`}
          render={({ field }) => (
            <>
              <OutlinedInput
                {...field}
                fullWidth
                error={!!lineItemErrors?.nota}
              />
              {lineItemErrors?.nota && (
                <FormHelperText error>
                  {lineItemErrors.nota.message}
                </FormHelperText>
              )}
            </>
          )}
        />
      </TableCell>
    </TableRow>
  );
};

export default LineItemRow;
