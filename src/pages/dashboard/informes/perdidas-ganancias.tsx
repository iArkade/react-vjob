import { useState } from 'react';
import {
    Button,
    Container,
    Box,
    Typography,
    Modal,
    TextField,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    CircularProgress,
    Grid,
} from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFnsV3';
import { PDFViewer } from '@react-pdf/renderer';
import PerdidasGananciasPDF from '@/components/pdfs/perdidas-ganancias-pdf';
import { format } from 'date-fns';
import { useGetProfitLoss } from '@/api/perdidas-ganancias/pyg-request';
import { RootState } from '@/state/store';
import { useSelector } from 'react-redux';

const PerdidasGanancias: React.FC = () => {
    const { selectedEmpresa } = useSelector((state: RootState) => state.empresaSlice);
    const empresaId = selectedEmpresa.id;

    const [startDate, setStartDate] = useState<string>(
        format(new Date(new Date().getFullYear(), 0, 1), 'yyyy-MM-dd')
    );
    const [endDate, setEndDate] = useState<string>(
        format(new Date(), 'yyyy-MM-dd')
    );
    const [level, setLevel] = useState<number | 'All'>('All');
    const [modalOpen, setModalOpen] = useState(false);

    // Usar el hook con enabled: false para evitar la carga automática
    const { data, isLoading, error, refetch } = useGetProfitLoss(
        empresaId,
        startDate,
        endDate,
        level === 'All' ? undefined : level
    );

    const formattedReport = data?.report?.map(item => ({
        ...item,
        monthly: item.monthly || 0,
        total: item.total || 0,
    })) || [];

    const obtenerDatos = async () => {
        if (!startDate || !endDate) return;
        await refetch(); // Llamar manualmente a refetch para obtener los datos
        setModalOpen(true);
    };

    console.log(data);
    

    return (
        <Container maxWidth="md">
            <Box my={5} p={3} sx={{ bgcolor: 'background.paper', borderRadius: 2, boxShadow: 3 }}>
                <Typography variant="h4" component="h1" gutterBottom align="center" sx={{ fontWeight: 'bold' }}>
                    Estado de Pérdidas y Ganancias
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
                            <InputLabel id="level-label">Nivel</InputLabel>
                            <Select
                                labelId="level-label"
                                id="level"
                                value={level}
                                label="Nivel"
                                onChange={(e) => setLevel(e.target.value === 'All' ? 'All' : Number(e.target.value))}
                            >
                                <MenuItem value="All">Todos</MenuItem>
                                <MenuItem value={1}>1</MenuItem>
                                <MenuItem value={2}>2</MenuItem>
                                <MenuItem value={3}>3</MenuItem>
                                <MenuItem value={4}>4</MenuItem>
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

                {/* Modal para mostrar vista previa del PDF */}
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
                            Vista Previa del Informe
                        </Typography>
                        <PDFViewer width="100%" height="100%">
                            <PerdidasGananciasPDF
                                startDate={startDate || ''}
                                endDate={endDate || ''}
                                level={level}
                                report={formattedReport}
                            />
                        </PDFViewer>
                    </Box>
                </Modal>
            </Box>
        </Container>
    );
};

export default PerdidasGanancias;