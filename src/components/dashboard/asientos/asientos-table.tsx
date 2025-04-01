import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Chip,
  Paper,
  Box,
  TablePagination,
  CircularProgress,
  Alert,
  Tooltip,
  Stack,
} from "@mui/material";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import PrintOutlinedIcon from "@mui/icons-material/PrintOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import { useState } from "react";
import { Asiento } from "@/api/asientos/asientos-types";
import Swal from "sweetalert2";
import { useDeleteAsiento } from "@/api/asientos/asientos-request";
import { useNavigate } from "react-router-dom";
import { paths } from "@/paths";
import { useSelector } from "react-redux";
import { RootState } from "@/state/store";

// Constants
const ROWS_PER_PAGE_OPTIONS = [5, 10, 25];
const DEFAULT_ROWS_PER_PAGE = 5;

// Types
export type OrderStatus = "Pendiente" | "Activo" | "Cancelado" | "Rechazado";
export type ActionType = "edit" | "delete" | "print";

interface AsientoTableProps {
  asientos?: Asiento[];
  isLoading: boolean;
  isError: boolean;
  onSuccessF: () => void;
  onErrorF: (error: string) => void;
}

// Status configuration
const STATUS_COLORS: Record<
  OrderStatus,
  "default" | "error" | "warning" | "success"
> = {
  Pendiente: "warning",
  Activo: "success",
  Cancelado: "error",
  Rechazado: "default",
};

const AsientoTableRow = ({
  asiento,
  handleAction,
}: {
  asiento: Asiento;
  handleAction: (asiento: Asiento, action: ActionType) => void;
}) => (
  <TableRow key={asiento.id}>
    <TableCell>
      <Box display="flex" flexDirection="column">
        <Typography variant="body2" color="textSecondary">
          {asiento.fecha_emision}
        </Typography>
        <Typography variant="subtitle2">#{asiento.nro_asiento}</Typography>
        <Typography variant="body2" color="textSecondary">
          ID-{asiento.id}
        </Typography>
      </Box>
    </TableCell>
    <TableCell>{asiento.comentario ?? "-"}</TableCell>
    <TableCell>
      <Chip
        label={asiento.estado}
        color={STATUS_COLORS[asiento.estado as OrderStatus]}
        variant="outlined"
        size="small"
      />
    </TableCell>
    <TableCell>{asiento.total_debe}</TableCell>
    <TableCell>{asiento.total_haber}</TableCell>
    <TableCell align="center">
      <Stack
        direction="row"
        spacing={1}
        justifyContent="center"
        alignItems="center"
      >
        <Tooltip title="Editar" arrow>
          <VisibilityOutlinedIcon
            fontSize="small"
            sx={{
              cursor: "pointer",
              color: "action.active",
              "&:hover": { color: "primary.main" },
            }}
            onClick={() => handleAction(asiento, "edit")}
          />
        </Tooltip>
        <Tooltip title="Eliminar" arrow>
          <DeleteOutlineOutlinedIcon
            fontSize="small"
            sx={{
              cursor: "pointer",
              color: "action.active",
              "&:hover": { color: "error.main" },
            }}
            onClick={() => handleAction(asiento, "delete")}
          />
        </Tooltip>
        <Tooltip title="Imprimir" arrow>
          <PrintOutlinedIcon
            fontSize="small"
            sx={{
              cursor: "pointer",
              color: "action.active",
              "&:hover": { color: "secondary.main" },
            }}
            onClick={() => handleAction(asiento, "print")}
          />
        </Tooltip>
      </Stack>
    </TableCell>
  </TableRow>
);

// Component
export default function AsientoTable({
  asientos = [],
  isLoading,
  isError,
  onSuccessF,
  onErrorF,
}: AsientoTableProps) {
  //console.log(asientos)
  const navigate = useNavigate();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(DEFAULT_ROWS_PER_PAGE);
  
  const { selectedEmpresa } = useSelector((state: RootState) => state.empresaSlice);

  const { mutate: deleteAsiento } = useDeleteAsiento(
    selectedEmpresa.id,
    onSuccessF,
    onErrorF
  );

  // Pagination handlers
  const handleChangePage = (_: unknown, newPage: number) => setPage(newPage);
  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Calculate paginated data
  const paginatedAsientos = asientos.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const handleDelete = async (asientoId: number, empresaId: number) => {
    const result = await Swal.fire({
      title: "¿Estás seguro?",
      text: "No podrás revertir esta acción.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#635bff",
      cancelButtonColor: "rgb(223, 51, 51)",
      confirmButtonText: "Sí, borrar",
      cancelButtonText: "Cancelar",
    });

    if (result.isConfirmed) {
      deleteAsiento({id: asientoId, empresa_id: empresaId}, {
        onSuccess: () => {
          // Swal.fire(
          //   "¡Borrado!",
          //   "El registro ha sido eliminado correctamente.",
          //   "success"
          // );
        },
        onError: (error) => {
          console.error(error);
          // Swal.fire(
          //   "Error",
          //   "No se pudo eliminar el asiento. Intenta nuevamente.",
          //   "error"
          // );
        },
      });
    }
  };

  const handleAction = (asiento: Asiento, action: ActionType) => {
    if (!asiento.id) {
      Swal.fire("Error", "El ID del asiento es inválido.", "error");
      return;
    }

    const actions: Record<ActionType, () => void> = {
      edit: () => {
        navigate(paths.dashboard.asientos.details(asiento.empresa_id, asiento.id!));
      },
      delete: () => handleDelete(asiento.id!, asiento.empresa_id),
      print: () => navigate(paths.dashboard.asientos.pdf(asiento.empresa_id, asiento.id!)),
    };

    actions[action]();
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
      </Box>
    );
  }

  if (isError) {
    return <Alert severity="error">Error al cargar los asientos</Alert>;
  }

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Asiento</TableCell>
            <TableCell>Comentario</TableCell>
            <TableCell>Estado</TableCell>
            <TableCell>Total Debe</TableCell>
            <TableCell>Total Haber</TableCell>
            <TableCell align="center">Acciones</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {paginatedAsientos.map((asiento) => (
            <AsientoTableRow
              key={asiento.id}
              asiento={asiento}
              handleAction={handleAction}
            />
          ))}
        </TableBody>
      </Table>
      <TablePagination
        rowsPerPageOptions={ROWS_PER_PAGE_OPTIONS}
        component="div"
        count={asientos.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </TableContainer>
  );
}