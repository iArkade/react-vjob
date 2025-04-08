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
    IconButton,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
} from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFnsV3';
import { PDFViewer } from '@react-pdf/renderer';
import { format } from 'date-fns';
import { RootState } from '@/state/store';
import { useSelector } from 'react-redux';
import BalanceComprobacionPDF from '@/components/pdfs/balance-comprobacion-pdf';
import { useGetBalanceComprobacion } from '@/api/balance-comprobacion/balanceC-request';
import CloseIcon from '@mui/icons-material/Close';
import CuentasSelectionModal from '@/components/dashboard/informes/cuentas-selection-modal';

const BalanceComprobacion: React.FC = () => {
    const { selectedEmpresa } = useSelector((state: RootState) => state.empresaSlice);
    const empresaId = selectedEmpresa.id;

    const [startDate, setStartDate] = useState<string>(
        format(new Date(new Date().getFullYear(), 0, 1), 'yyyy-MM-dd')
    );
    const [endDate, setEndDate] = useState<string>(
        format(new Date(), 'yyyy-MM-dd')
    );
    const [initialAccount, setInitialAccount] = useState('');
    const [finalAccount, setFinalAccount] = useState('');
    const [cuentaTarget, setCuentaTarget] = useState<'initial' | 'final' | null>(null);
    const [modalCuentasOpen, setModalCuentasOpen] = useState(false);
    const [level, setLevel] = useState<number | 'All'>('All');
    const [modalOpen, setModalOpen] = useState(false);

    const {
        data: balanceData,
        isLoading,
        error,
        refetch,
    } = useGetBalanceComprobacion(
        empresaId,
        startDate,
        endDate,
        initialAccount,
        finalAccount,
        level === 'All' ? undefined : level,
    );

    console.log(balanceData);


    const obtenerDatos = async () => {
        const result = await refetch();
        if (result.data) {
            setModalOpen(true);
        }
    };

    const cerrarModal = () => {
        setModalOpen(false);
    };

    return (
        <Container maxWidth="md">
            <Box my={5} p={3} sx={{ bgcolor: 'background.paper', borderRadius: 2, boxShadow: 3 }}>
                <Typography variant="h4" component="h1" gutterBottom align="center" sx={{ fontWeight: 'bold' }}>
                    Balance de Comprobación
                </Typography>

                <Grid container spacing={2} justifyContent="center" sx={{ mt: 3 }}>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            label="Cuenta Inicial"
                            value={initialAccount}
                            onClick={() => {
                                setCuentaTarget('initial');
                                setModalCuentasOpen(true);
                            }}
                            placeholder="Seleccione una cuenta"
                            InputProps={{ readOnly: true }}
                        />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            label="Cuenta Final"
                            value={finalAccount}
                            onClick={() => {
                                setCuentaTarget('final');
                                setModalCuentasOpen(true);
                            }}
                            placeholder="Seleccione una cuenta"
                            InputProps={{ readOnly: true }}
                        />
                    </Grid>
                </Grid>

                <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <Grid container spacing={2} justifyContent="center" sx={{ mt: 3 }}>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                label="Desde"
                                type="date"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                                InputLabelProps={{ shrink: true }}
                                fullWidth
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                label="Hasta"
                                type="date"
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                                InputLabelProps={{ shrink: true }}
                                fullWidth
                            />
                        </Grid>
                    </Grid>
                </LocalizationProvider>

                <Grid container spacing={2} justifyContent="center" sx={{ mt: 2 }}>
                    <Grid item xs={12}>
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

                <Modal
                    open={modalOpen}
                    onClose={(_, reason) => {
                        if (isLoading && (reason === 'backdropClick' || reason === 'escapeKeyDown')) return;
                        cerrarModal();
                    }}
                >
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
                        <Box
                            sx={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                mb: 1,
                                position: 'relative'
                            }}
                        >
                            <Typography
                                variant="h6"
                                sx={{
                                    position: 'absolute',
                                    left: '50%',
                                    transform: 'translateX(-50%)',
                                    fontWeight: 'bold'
                                }}
                            >
                                Vista Previa del Balance de Comprobación
                            </Typography>
                            <IconButton
                                onClick={cerrarModal}
                                disabled={isLoading}
                                sx={{ ml: 'auto' }}
                            >
                                <CloseIcon />
                            </IconButton>
                        </Box>
                        {balanceData ? (
                            <PDFViewer width="100%" height="100%">
                                <BalanceComprobacionPDF
                                    report={balanceData.report}
                                    startDate={balanceData.startDate}
                                    endDate={balanceData.endDate}
                                    initialAccount={balanceData.initialAccount}
                                    finalAccount={balanceData.finalAccount}
                                    level={level}
                                    totalSaldoAnteriorDebe={balanceData.totalSaldoAnteriorDebe}
                                    totalSaldoAnteriorHaber={balanceData.totalSaldoAnteriorHaber}
                                    totalMovimientosDebe={balanceData.totalMovimientosDebe}
                                    totalMovimientosHaber={balanceData.totalMovimientosHaber}
                                    totalSaldosDebe={balanceData.totalSaldosDebe}
                                    totalSaldosHaber={balanceData.totalSaldosHaber}
                                    diferenciaMovimientos={balanceData.diferenciaMovimientos}
                                    diferenciaSaldos={balanceData.diferenciaSaldos}
                                />
                            </PDFViewer>
                        ) : (
                            <Typography textAlign="center" mt={2}>
                                No hay datos para mostrar.
                            </Typography>
                        )}
                    </Box>
                </Modal>

                {/* Modal de selección de cuenta */}
                <CuentasSelectionModal
                    open={modalCuentasOpen}
                    onClose={() => {
                        setModalCuentasOpen(false);
                        setCuentaTarget(null);
                    }}
                    empresaId={empresaId}
                    onCuentaSeleccionada={(code) => {
                        if (cuentaTarget === 'initial') setInitialAccount(code);
                        if (cuentaTarget === 'final') setFinalAccount(code);
                        setModalCuentasOpen(false);
                        setCuentaTarget(null);
                    }}
                />
            </Box>
        </Container>
    );
};

export default BalanceComprobacion;