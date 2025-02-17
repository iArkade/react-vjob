import React from "react";
import {
  Box,
  Card,
  SelectChangeEvent,
  Typography,
} from "@mui/material";
import {
  useGetEmpresa,
} from "@/api/empresas/empresa-request";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { EmpresaSelect } from "@/components/company/company-select";
import { setSelectedEmpresa } from "@/state/slices/empresaSlice";


export function Empresa(): React.JSX.Element {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [selectedCompany, setSelectedCompany] = React.useState<string>("");
  const { data: companies, refetch } = useGetEmpresa();



  const handleSelectChange = (event: SelectChangeEvent<string>) => {
    const selectedCodigo = event.target.value;
    setSelectedCompany(selectedCodigo);

    const selectedEmpresa = companies?.find(
      (company) => company.codigo === selectedCodigo
    );

    if (selectedEmpresa) {

      dispatch(setSelectedEmpresa(selectedEmpresa));
      localStorage.setItem("selectedEmpresa", JSON.stringify(selectedEmpresa));
      
      navigate("/dashboard");
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
      </Card>
    </Box>
  );
}

export default Empresa;
