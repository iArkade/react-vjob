// AsientoRow.tsx
import {
     TableRow,
     TableCell,
     Typography,
     Box,
     Stack,
     Tooltip,
     Chip,
} from '@mui/material';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import PrintOutlinedIcon from '@mui/icons-material/PrintOutlined';
import { Asiento } from '@/api/asientos/asientos-types';
import { ActionType, OrderStatus } from './asientos-table';

const STATUS_COLORS: Record<OrderStatus, "default" | "error" | "warning" | "success"> = {
     Pendiente: "warning",
     Activo: "success",
     Cancelado: "error",
     Rechazado: "default",
};

interface Props {
     asiento: Asiento;
     handleAction: (asiento: Asiento, action: ActionType) => void;
}

export default function AsientoTableRow({ asiento, handleAction }: Props) {
     return (
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
                    <Stack direction="row" spacing={1} justifyContent="center" alignItems="center">
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
}
