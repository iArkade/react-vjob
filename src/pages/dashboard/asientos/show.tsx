// Page.tsx
import * as React from "react";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import { AsientosForm } from "../../../components/dashboard/asientos/asientos-form";
import { useAsiento } from "@/api/asientos/asientos-request";
import { useLocation, useParams } from "react-router-dom";

import { useSelector } from "react-redux";
import { RootState } from "@/state/store";

export function AsientosShow(): React.JSX.Element {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const asientoId = id ? parseInt(id, 10) : undefined;
  const { selectedEmpresa } = useSelector((state: RootState) => state.empresaSlice);
  const {
    data: asiento,
    isLoading,
    isError,
    refetch,
  } = useAsiento(asientoId as number, selectedEmpresa.id); 

  React.useEffect(() => {
    refetch().then((result) => console.log("Refetched Data:"));
    //result.data puedo mandar en el console
  }, [location.pathname, refetch]);

  return (
    <React.Fragment>
      <Box
        sx={{
          maxWidth: "var(--Content-maxWidth)",
          m: "var(--Content-margin)",
          p: "var(--Content-padding)",
          width: "var(--Content-width)",
        }}
      >
        <Stack spacing={4}>
          <Stack spacing={3}>
            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={3}
              sx={{ alignItems: "flex-start" }}
            >
              <Box sx={{ flex: "1 1 auto" }}>
                <Typography variant="h4">Asiento Diario Contable</Typography>
              </Box>

            </Stack>
          </Stack>
          {!isLoading ? (
            !isError && asiento && <AsientosForm asiento={asiento} />
          ) : (
            <div>Loading...</div>
          )}
        </Stack>
      </Box>
    </React.Fragment>
  );
}
