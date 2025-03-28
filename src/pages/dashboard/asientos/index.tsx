import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { Plus as PlusIcon } from "@phosphor-icons/react/dist/ssr/Plus";
import AsientoTable from "@/components/dashboard/asientos/asientos-table";
import { RouterLink } from "@/components/core/link";
import { paths } from "@/paths";
import { useAsientos } from "@/api/asientos/asientos-request";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/state/store";
import { setFeedback } from "@/state/slices/feedBackSlice";
import { Alert, CircularProgress } from "@mui/material";

export function Asientos(): React.JSX.Element {
  const dispatch = useDispatch();

  const { selectedEmpresa } = useSelector((state: RootState) => state.empresaSlice);
  const { data: asientos, isLoading, isError, error } = useAsientos(selectedEmpresa.id);

  const onSuccess = () => {
    dispatch(setFeedback({
      message: "Asiento eliminado exitosamente",
      severity: "success",
      isError: false,
    }));
  };

  const onError = (message: string) => {
    dispatch(setFeedback({
      message,
      severity: "error",
      isError: true,
    }));
  };

  if (isLoading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100%"
      >
        <CircularProgress />
        <Typography sx={{ ml: 1 }}>Cargando...</Typography>
      </Box>
    );
  }

  if (error) {
    return <Alert severity="error">Error al cargar usuarios</Alert>;
  }

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
          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={3}
            sx={{ alignItems: "flex-start" }}
          >
            <Box sx={{ flex: "1 1 auto" }}>
              <Typography variant="h4">Asientos</Typography>
            </Box>
            <div>
              <Button
                component={RouterLink}
                href={paths.dashboard.asientos.create(selectedEmpresa.id)}
                startIcon={<PlusIcon />}
                variant="contained"
              >
                Asiento Diario
              </Button>
            </div>
          </Stack>
          <Card>
            <Box sx={{ overflowX: "auto" }}>
              <AsientoTable
                asientos={asientos} // Pasamos los datos
                isLoading={isLoading} // Estado de carga
                isError={isError} // Estado de error
                onSuccessF={onSuccess}
                onErrorF={onError}
              />
            </Box>
            <Divider />
          </Card>
        </Stack>
      </Box>

      { /* <AsientoDetailsModal
            open={openModal}
            onClose={handleCloseModal}
            asiento={selectedAsiento}
            previewId={searchParams.get('previewId') || ''}
        /> */}

    </React.Fragment>
  );
}
