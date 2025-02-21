import React from "react";
import { Box, Card, Typography } from "@mui/material";
import { useGetEmpresa } from "@/api/empresas/empresa-request";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { EmpresaSelect } from "@/components/company/company-select";
import { setSelectedEmpresa } from "@/state/slices/empresaSlice";
import { RootState } from "@/state/store";
import { SelectChangeEvent } from "@mui/material";
import { EmpresaConRolType } from "@/api/empresas/empresa-types";

export function Empresa(): React.JSX.Element {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [selectedCompany, setSelectedCompany] = React.useState<string>("");
    const { data: companies, refetch } = useGetEmpresa();
    const { user } = useSelector((state: RootState) => state.authSlice);

    const handleSelectChange = (event: SelectChangeEvent<string>) => {
        const selectedCodigo = event.target.value;
        setSelectedCompany(selectedCodigo);

        if (!companies) {
            console.error("Companies no está definido.");
            return;
        }

        // Buscar la empresa seleccionada por su código
        const selectedEmpresa = companies.find(
            (company) => company.codigo === selectedCodigo
        );

        if (!selectedEmpresa) {
            console.error("No se encontró la empresa seleccionada.");
            return;
        }

        if (!user || !user.empresas) {
            console.error("User o user.empresas no están definidos.");
            return;
        }

        // Buscar el rol del usuario en la empresa seleccionada
        const userEmpresa = user.empresas.find(
            (ue) => ue.id === selectedEmpresa.id
        );       

        if (userEmpresa) {
            const { role } = userEmpresa; // Acceder al campo "role"

            // Crear el objeto empresa con el rol del usuario
            const empresaConRol = {
                ...selectedEmpresa,
                companyRole: role, // Incluir el rol del usuario
            } as EmpresaConRolType;

            // Guardar la empresa seleccionada en el estado y en localStorage
            dispatch(setSelectedEmpresa(empresaConRol));
            localStorage.setItem("selectedEmpresa", JSON.stringify(empresaConRol));

            // Redirigir al dashboard de la empresa seleccionada
            navigate(`/empresa/${selectedEmpresa.id}/dashboard`);
        }
    };

    React.useEffect(() => {
        // Si el usuario tiene solo una empresa, redirigir automáticamente
        if (user?.empresas?.length === 1) {
            const empresa = companies?.find(
                (company) => company.id === user.empresas[0].id
            );

            if (empresa) {
                const { role } = user.empresas[0]; // Acceder al campo "role"

                // Crear el objeto empresa con el rol del usuario
                const empresaCompleta: EmpresaConRolType = {
                    ...empresa,
                    companyRole: role, // Incluir el rol del usuario
                };

                // Guardar la empresa seleccionada en el estado y en localStorage
                dispatch(setSelectedEmpresa(empresaCompleta));
                localStorage.setItem("selectedEmpresa", JSON.stringify(empresaCompleta));

                // Redirigir al dashboard de la empresa
                navigate(`/empresa/${empresa.id}/dashboard`);
            }
        }
    }, [user, navigate, dispatch, companies]);

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
                Seleccione una empresa
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
                    companies={companies || []}
                    onSelectChange={handleSelectChange}
                />
            </Card>
        </Box>
    );
}

export default Empresa;