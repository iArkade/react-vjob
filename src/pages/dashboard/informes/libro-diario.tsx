import { useState } from 'react';
import {
    Button,
    Container,
    Box,
    Typography,
    Modal,
    TextField,
    CircularProgress,
    Grid,
    InputLabel,
    MenuItem,
    FormControl,
    Select,
    SelectChangeEvent,
} from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFnsV3';
import { PDFViewer } from '@react-pdf/renderer';
import LibroDiarioPDF from '@/components/pdfs/libro-diario-pdf';
import { format } from 'date-fns';
import { useGetLibroDiario } from '@/api/libro-diario/libro-request';
import { RootState } from '@/state/store';
import { useSelector } from 'react-redux';
import { useGetTransaccionContable } from '@/api/transaccion_contable/transaccion-contable-request';
import Swal from 'sweetalert2';

const LibroDiario: React.FC = () => {
    const { selectedEmpresa } = useSelector((state: RootState) => state.empresaSlice);
    const empresaId = selectedEmpresa.id;

    const [startDate, setStartDate] = useState<string>(
        format(new Date(new Date().getFullYear(), 0, 1), 'yyyy-MM-dd')
    );
    const [endDate, setEndDate] = useState<string>(
        format(new Date(), 'yyyy-MM-dd')
    );
    const [codigoTransaccion, setCodigoTransaccion] = useState<string>('');
    const [modalOpen, setModalOpen] = useState(false);

    const {
        data: transacciones = [],
        isLoading: isLoadingTransacciones,
        isError: isErrorTransacciones,
    } = useGetTransaccionContable(selectedEmpresa.id);


    const { data, isLoading, error, refetch } = useGetLibroDiario(
        empresaId,
        startDate,
        endDate,
        codigoTransaccion || undefined
    );

    //console.log(data?.asientos.length);

    const handleTransaccionChange = (event: SelectChangeEvent) => {
        setCodigoTransaccion(event.target.value as string);
    };

    const obtenerDatos = async () => {
        if (!startDate || !endDate) return;
        
        const { data: fetchedData } = await refetch();

    
        // Verifica si no hay registros
        if (fetchedData?.asientos?.length === 0) {
            await Swal.fire({
                title: 'Sin registros',
                text: 'No hay transacciones para el código seleccionado en el rango de fechas.',
                icon: 'warning',
                confirmButtonText: 'Entendido',
                confirmButtonColor: '#3085d6',
            });
            return; // Evita abrir el modal
        }
    
        setModalOpen(true); // Abre el modal solo si hay datos
    };

    return (
        <Container maxWidth="md">
            <Box my={5} p={3} sx={{ bgcolor: 'background.paper', borderRadius: 2, boxShadow: 3 }}>
                <Typography variant="h4" component="h1" gutterBottom align="center" sx={{ fontWeight: 'bold' }}>
                    Libro Diario
                </Typography>

                <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <Grid container spacing={2} justifyContent="center" sx={{ mt: 3 }}>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Desde"
                                type="date"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                                InputLabelProps={{ shrink: true }}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Hasta"
                                type="date"
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                                InputLabelProps={{ shrink: true }}
                            />
                        </Grid>
                    </Grid>
                </LocalizationProvider>

                <Grid container spacing={2} justifyContent="center" sx={{ mt: 2 }}>
                    <Grid item xs={12} sm={6}>
                        <FormControl fullWidth>
                            <InputLabel id="transaccion-label">Código de Transacción</InputLabel>
                            <Select
                                labelId="transaccion-label"
                                id="transaccion-select"
                                value={codigoTransaccion}
                                label="Código de Transacción (opcional)"
                                onChange={handleTransaccionChange}
                                disabled={isLoadingTransacciones}
                            >
                                <MenuItem value="">
                                    <em>Ninguno</em>
                                </MenuItem>
                                {transacciones.map((transaccion) => (
                                    <MenuItem 
                                        key={transaccion.id} 
                                        value={transaccion.codigo_transaccion}
                                    >
                                        {transaccion.codigo_transaccion} - {transaccion.nombre}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                </Grid>

                <Box display="flex" justifyContent="center" mt={3}>
                    <Button
                        variant="contained"
                        color="primary"
                        size="large"
                        onClick={obtenerDatos}
                        disabled={isLoading}
                        sx={{ px: 4, py: 1.5, fontSize: '1rem', fontWeight: 'bold', borderRadius: 2 }}
                    >
                        {isLoading ? <CircularProgress size={24} sx={{ color: 'white' }} /> : 'Generar Informe'}
                    </Button>
                </Box>

                {error instanceof Error && (
                    <Typography color="error" mt={2} textAlign="center">
                        Error: {error.message}
                    </Typography>
                )}

                <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
                    <Box
                        sx={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            width: '90%',
                            height: '90%',
                            bgcolor: 'background.paper',
                            boxShadow: 24,
                            p: 2,
                            borderRadius: 2,
                            display: 'flex',
                            flexDirection: 'column',
                        }}
                    >
                        <Typography variant="h6" align="center" sx={{ mb: 2, fontWeight: 'bold' }}>
                            Vista Previa del Libro Diario
                        </Typography>
                        {data?.asientos ? (
                            <PDFViewer width="100%" height="100%">
                                <LibroDiarioPDF
                                    startDate={startDate}
                                    endDate={endDate}
                                    codigoTransaccion={codigoTransaccion}
                                    report={{
                                        asientos: data.asientos || [],
                                        fechaDesde: data.fechaDesde || startDate,
                                        fechaHasta: data.fechaHasta || endDate,
                                        codigoTransaccion: data.codigoTransaccion || codigoTransaccion || null,
                                        totalDebe: data.totalDebe || 0,
                                        totalHaber: data.totalHaber || 0,
                                        totalDiferencia: data.totalDiferencia || 0
                                    }}
                                />
                            </PDFViewer>
                        ) : (
                            <Typography textAlign="center" mt={4}>
                                No hay datos para mostrar
                            </Typography>
                        )}
                    </Box>
                </Modal>
            </Box>
        </Container>
    );
};

export default LibroDiario;