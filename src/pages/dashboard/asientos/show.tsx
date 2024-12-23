// Page.tsx
import * as React from "react";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import { AsientosForm } from "../../../components/dashboard/asientos/asientos-form";
import { useAsiento } from "@/api/asientos/asientos-request";
import { useParams } from "react-router-dom";


export function Page(): React.JSX.Element {
  const { id } = useParams<{ id: string }>();
  const asientoId = id ? parseInt(id, 10) : undefined;

  const { data: asiento, isLoading, isError } = useAsiento(asientoId as number);
  console.log(asiento, asientoId);

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
          {!isLoading && !isError && asiento && (
            <AsientosForm asiento={asiento} />
          )}
        </Stack>
      </Box>
    </React.Fragment>
  );
}
