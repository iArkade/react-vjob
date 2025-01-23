import React from "react";
import {
  Box,
  Button,
  Card,
  SelectChangeEvent,
  Typography,
} from "@mui/material";
import {
  useCreateEmpresa,
  useGetEmpresa,
} from "@/api/empresas/empresa-request";
import { EmpresaRequestType } from "@/api/empresas/empresa-types";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setFeedback } from '@/state/slices/feedBackSlice';
import { useForm } from "react-hook-form";
import { EmpresaSelect } from "@/components/company/company-select";
import { CreateEmpresaDialog } from "@/components/company/company-modal";


export function Empresa(): React.JSX.Element {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [open, setOpen] = React.useState(false);
  const [preview, setPreview] = React.useState<string | null>(null);
  const [selectedCompany, setSelectedCompany] = React.useState<string>("");
  const { data: companies, refetch } = useGetEmpresa();
  const createEmpresaMutation = useCreateEmpresa();

  const form = useForm<EmpresaRequestType>({
    defaultValues: {
      codigo: "",
      ruc: "",
      nombre: "",
      correo: "",
      telefono: "",
      direccion: "",
      logo: null,
    },
  });

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    form.reset();
    setPreview(null);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    if (file) {
      setPreview(URL.createObjectURL(file));
    }

    const MAX_FILE_SIZE = 5 * 1024 * 1024;

    if(file && file.size > MAX_FILE_SIZE) {
      dispatch(setFeedback({
        message: "El archivo debe ser menor a 5 MB",
        severity: "warning",
        isError: true,
      }))
      return;
    }
    
    form.setValue("logo", file, { shouldValidate: true });
  };
  const handleSelectChange = (event: SelectChangeEvent<string>) => {
    const selectedCodigo = event.target.value;
    setSelectedCompany(selectedCodigo);

    const selectedEmpresa = companies?.find(
      (company) => company.codigo === selectedCodigo
    );

    if (selectedEmpresa) {
      //dispatch(setSelectedEmpresa(selectedEmpresa));
      //navigate("/dashboard", { state: { empresa: selectedEmpresa } });
      localStorage.setItem("empresa", JSON.stringify(selectedEmpresa));
      navigate("/dashboard");
    }
  };

  const onSubmit = async (data: EmpresaRequestType) => {
    try {
      if (data.logo && data.logo.size > 5 * 1024 * 1024) {
        dispatch(setFeedback({
          message: "El archivo debe ser menor a 5 MB",
          severity: "warning",
          isError: true,
        }))
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
      const newEmpresa  = await createEmpresaMutation.mutateAsync(formData);
      // Refrescar datos y cerrar el formulario
      refetch();
      handleClose();

      //Feedback exitoso
      dispatch(
        setFeedback({
          message: "Empresa Creada Exitosamente",
          severity: "success",
          isError: false,
        })
      );
      //redirigir al dashboard con datos de la empresa creada
      navigate("/dashboard", { state: { empresa: newEmpresa } });

    } catch (error) {
      dispatch(
        setFeedback({
          message: `Error al crear la empresa`,
          severity: "error",
          isError: true,
        })
      );
      console.error("Error al crear la empresa:", error);
    }
  };

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
        <EmpresaSelect
          selectedCompany={selectedCompany}
          companies={companies}
          onSelectChange={handleSelectChange}
        />
        <Button variant="contained" color="primary" onClick={handleOpen}>
          Crear Empresa
        </Button>
      </Card>

      <CreateEmpresaDialog
        open={open}
        onClose={handleClose}
        form={form}
        preview={preview}
        onFileChange={handleFileChange}
        onSubmit={onSubmit}
      />
    </Box>
  );
}

export default Empresa;
