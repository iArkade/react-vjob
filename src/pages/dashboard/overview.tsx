import * as React from "react";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { EmpresaResponseType } from "@/api/empresas/empresa-types";
import { RootState } from "@/state/store";
import { useSelector } from "react-redux";

export function OverviewPage(): React.JSX.Element {
  // const [empresa, setEmpresa] = React.useState<EmpresaResponseType | null>(null);

  // React.useEffect(() => {
  //   const storedEmpresa = localStorage.getItem("selectedEmpresa");
  //   if (storedEmpresa) {
  //     setEmpresa(JSON.parse(storedEmpresa));
  //   }
  // }, []);

  const { selectedEmpresa } = useSelector((state: RootState) => state.empresaSlice);

  
  //* Para poner el logo en la pantalla prncipal, tengo que buscar el componente logo.tsx
  return (
    <React.Fragment>
      <Box
      sx={{
        maxWidth: 'var(--Content-maxWidth)',
        m: 'var(--Content-margin)',
        p: 'var(--Content-padding)',
        width: 'var(--Content-width)',
      }}
      >
        <Stack spacing={4}>
          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={3}
            sx={{ alignItems: "flex-start" }}
          >
            <Box sx={{ flex: "1 1 auto" }}>
              <Typography variant="h4">Dashboard</Typography>
            </Box>
            {selectedEmpresa ? (
              <div>
                <p>
                  <strong>Código:</strong> {selectedEmpresa.codigo}
                </p>
                <p>
                  <strong>Nombre:</strong> {selectedEmpresa.nombre}
                </p>
                <p>
                  <strong>RUC:</strong> {selectedEmpresa.ruc}
                </p>
                <img
                  src={selectedEmpresa.logo}
                  alt={`Logo de ${selectedEmpresa.nombre}`}
                  style={{ maxWidth: "200px", height: "auto" }} // Estilo opcional
                />
              </div>
            ) : (
              <p>No se seleccionó ninguna empresa.</p>
            )}
          </Stack>
        </Stack>
      </Box>
    </React.Fragment>
  );
}


//esto toca agregar
// <div>
// <Link
//   color="text.primary"
//   component={RouterLink}
//   href={paths.dashboard.customers.list}
//   sx={{ alignItems: 'center', display: 'inline-flex', gap: 1 }}
//   variant="subtitle2"
// >
//   <ArrowLeftIcon fontSize="var(--icon-fontSize-md)" />
//   Customers
// </Link>
// </div>