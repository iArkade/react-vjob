import React from "react";
import {
  Box,
  Button,
  Card,
  Dialog,
  DialogContent,
  DialogTitle,
  FormControl,
  IconButton,
  MenuItem,
  Select,
  SelectChangeEvent,
  Snackbar,
  TextField,
  Typography,
} from "@mui/material";
import {
  useCreateEmpresa,
  useGetEmpresa,
} from "@/api/empresas/empresa-request";
import { EmpresaRequestType } from "@/api/empresas/empresa-types";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setSelectedEmpresa } from "@/state/slices/empresaSlice";
import { X as XIcon } from "@phosphor-icons/react/dist/ssr/X";
import { Controller, useForm } from "react-hook-form";

export function Page(): React.JSX.Element {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [open, setOpen] = React.useState(false);
  const [preview, setPreview] = React.useState<string | null>(null);
  const [errorState, setErrorState] = React.useState(false);
  const [selectedCompany, setSelectedCompany] = React.useState<string>("");
  const [successState, setSuccessState] = React.useState(false);
  const { data: companies, refetch } = useGetEmpresa();
  const createEmpresaMutation = useCreateEmpresa();

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
    setValue,
    watch,
  } = useForm({
    defaultValues: {
      codigo: "",
      ruc: "",
      nombre: "",
      correo: "",
      telefono: "",
      direccion: "",
      logo: null as File | null,
    },
  });

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    reset();
    setPreview(null);
  };

  const onSubmit = async (data: EmpresaRequestType) => {
    try {
      if (data.logo && data.logo.size > 5 * 1024 * 1024) {
        alert("El archivo debe ser menor a 5 MB");
        return;
      }

      //*Como voy a subir un archivo necesito mandar los datos en formato de FormData

      // Construir FormData
      const formData = new FormData();
      formData.append("codigo", data.codigo);
      formData.append("ruc", data.ruc);
      formData.append("nombre", data.nombre);
      formData.append("correo", data.correo);
      formData.append("telefono", data.telefono);
      formData.append("direccion", data.direccion);
      if (data.logo) {
        formData.append("logo", data.logo); // Adjunta el archivo si existe
      }

      // Realizar la mutación
      await createEmpresaMutation.mutateAsync(formData);

      // Refrescar datos y cerrar el formulario
      refetch();
      handleClose();
      //   setSuccessState(true);
    } catch (error) {
      //   setErrorState(true);
      console.error("Error al crear la empresa:", error);
    }
  };

  const handleSelectChange = (event: SelectChangeEvent<string>) => {
    const selectedCodigo = event.target.value;
    setSelectedCompany(selectedCodigo);

    const selectedEmpresa = companies?.find(
      (company) => company.codigo === selectedCodigo
    );
    if (selectedEmpresa) {
      dispatch(setSelectedEmpresa(selectedEmpresa));
      navigate("/dashboard", { state: { empresa: selectedEmpresa } });
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    if (file) {
      setPreview(URL.createObjectURL(file));
    }
    setValue("logo", file, { shouldValidate: true });
  };

  const rucValue = watch("ruc");

  return (
    <Box
      sx={{
        p: 4,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <Typography variant="h5" sx={{ mb: 2 }}>
        Empresas
      </Typography>
      <Card
        sx={{
          p: 2,
          minWidth: 400,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <FormControl fullWidth sx={{ flex: 1, mr: 2 }}>
          <Select
            value={selectedCompany}
            onChange={handleSelectChange}
            displayEmpty
            size="small"
          >
            <MenuItem value="">
              <em>Selecciona una empresa</em>
            </MenuItem>
            {companies?.map((company) => (
              <MenuItem key={company.codigo} value={company.codigo}>
                {company.nombre}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <Button variant="contained" color="primary" onClick={handleOpen}>
          Crear Empresa
        </Button>
      </Card>

      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography variant="h6">Crear Empresa</Typography>
            <IconButton onClick={handleClose}>
              <XIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <TextField
                label="Codigo"
                {...register("codigo")}
                fullWidth
                size="small"
                error={!!errors.codigo}
                helperText={errors.codigo?.message}
              />
              <TextField
                label="RUC"
                {...register("ruc", {
                  validate: {
                    isNotEmpty: (value) =>
                      value.trim() !== "" ||
                      "El RUC es obligatorio y solo puede contener números!",
                    isExactLength: (value) =>
                      value.length === 13 ||
                      "El RUC debe tener exactamente 13 dígitos",
                  },
                })}
                value={rucValue} // Mantener sincronización con React Hook Form
                onChange={(e) => {
                  const value = e.target.value
                    .replace(/[^0-9]/g, "")
                    .slice(0, 13); // Solo números y máximo 13 caracteres
                  setValue("ruc", value, { shouldValidate: true }); // Actualizar con validación
                }}
                fullWidth
                size="small"
                error={!!errors.ruc}
                helperText={errors.ruc?.message}
              />
              <TextField
                label="Nombre"
                {...register("nombre", {
                  required: "El nombre es obligatorio.",
                })}
                fullWidth
                size="small"
                error={!!errors.nombre}
                helperText={errors.nombre?.message}
              />
              <TextField
                label="Correo"
                {...register("correo", {
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: "El correo no tiene un formato válido",
                  },
                })}
                fullWidth
                size="small"
                error={!!errors.correo}
                helperText={errors.correo?.message}
              />
              <TextField
                label="Telefono"
                {...register("telefono", {
                  pattern: {
                    value: /^[0-9]+$/,
                    message: "El teléfono solo puede contener números ",
                  },
                })}
                fullWidth
                size="small"
                error={!!errors.telefono}
                helperText={errors.telefono?.message}
              />
              <TextField
                label="Direccion"
                {...register("direccion")}
                fullWidth
                size="small"
              />
              <Controller
                name="logo"
                control={control}
                render={({ field }) => (
                  <div>
                    <label htmlFor="logo-upload">Logo</label>
                    <br />
                    <input
                      type="file"
                      accept="image/*"
                      id="logo-upload"
                      onChange={handleFileChange} // Usar la función manejadora
                    />
                    {preview && (
                      <img
                        src={preview}
                        alt="Vista previa del logo"
                        style={{ maxWidth: "100%", marginTop: "10px" }}
                      />
                    )}
                  </div>
                )}
              />
              <Box display="flex" justifyContent="flex-end" mt={2}>
                <Button variant="contained" color="primary" type="submit">
                  Guardar
                </Button>
              </Box>
            </Box>
          </form>
        </DialogContent>
      </Dialog>
      <Snackbar
        open={errorState}
        onClose={() => setErrorState(false)}
        message="Error al crear la empresa"
        autoHideDuration={4000}
      />
      <Snackbar
        open={successState}
        onClose={() => setSuccessState(false)}
        message="Empresa creada con éxito"
        autoHideDuration={4000}
      />
    </Box>
  );
}

export default Page;
