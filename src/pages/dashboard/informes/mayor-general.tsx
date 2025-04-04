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
     MenuItem,
     FormControl,
     InputLabel,
     Select,
     SelectChangeEvent,
} from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFnsV3';
import { PDFViewer } from '@react-pdf/renderer';
import { format } from 'date-fns';
import { RootState } from '@/state/store';
import { useSelector } from 'react-redux';
import MayorGeneralPDF from '@/components/pdfs/mayor-general-pdf';
import { useGetMayorGeneral } from '@/api/mayor-general/mayor-request';
import CloseIcon from '@mui/icons-material/Close';
import { useGetTransaccionContable } from '@/api/transaccion_contable/transaccion-contable-request';
import CuentasSelectionModal from '@/components/dashboard/informes/cuentas-selection-modal';

const MayorGeneral: React.FC = () => {
     const { selectedEmpresa } = useSelector((state: RootState) => state.empresaSlice);
     const empresaId = selectedEmpresa.id;

     const [startDate, setStartDate] = useState(format(new Date(new Date().getFullYear(), 0, 1), 'yyyy-MM-dd'));
     const [endDate, setEndDate] = useState(format(new Date(), 'yyyy-MM-dd'));
     const [initialAccount, setInitialAccount] = useState('');
     const [finalAccount, setFinalAccount] = useState('');
     const [codigoTransaccion, setCodigoTransaccion] = useState('');
     const [cuentaTarget, setCuentaTarget] = useState<'initial' | 'final' | null>(null);
     const [modalOpen, setModalOpen] = useState(false);
     const [modalCuentasOpen, setModalCuentasOpen] = useState(false);

     const { data: transacciones = [], isLoading: isLoadingTransacciones } = useGetTransaccionContable(empresaId);

     const {
          data: mayorGeneralData,
          isLoading,
          error,
          refetch,
     } = useGetMayorGeneral(
          empresaId,
          startDate,
          endDate,
          initialAccount,
          finalAccount,
          codigoTransaccion,
     );

     const obtenerDatos = async () => {
          const result = await refetch();
          if (result.data) setModalOpen(true);
     };

     return (
          <Container maxWidth="md">
               <Box my={5} p={3} sx={{ bgcolor: 'background.paper', borderRadius: 2, boxShadow: 3 }}>
                    <Typography variant="h4" align="center" fontWeight="bold" gutterBottom>
                         Mayor General
                    </Typography>

                    {/* Selección de cuentas */}
                    <Grid container spacing={2} sx={{ mt: 3 }}>
                         <Grid item xs={12} sm={6}>
                              <TextField
                                   fullWidth
                                   label="Cuenta Inicial"
                                   value={initialAccount}
                                   onClick={() => {
                                        setCuentaTarget('initial');
                                        setModalCuentasOpen(true);
                                   }}
                                   placeholder="Selecciona una cuenta"
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
                                   placeholder="Selecciona una cuenta"
                                   InputProps={{ readOnly: true }}
                              />
                         </Grid>
                    </Grid>

                    {/* Fechas */}
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                         <Grid container spacing={2} sx={{ mt: 3 }}>
                              <Grid item xs={12} sm={6}>
                                   <TextField
                                        label="Desde"
                                        type="date"
                                        value={startDate}
                                        onChange={(e) => setStartDate(e.target.value)}
                                        InputLabelProps={{ shrink: true }}
                                   />
                              </Grid>
                              <Grid item xs={12} sm={6}>
                                   <TextField
                                        label="Hasta"
                                        type="date"
                                        value={endDate}
                                        onChange={(e) => setEndDate(e.target.value)}
                                        InputLabelProps={{ shrink: true }}
                                   />
                              </Grid>
                         </Grid>
                    </LocalizationProvider>

                    {/* Código de transacción */}
                    <Grid container spacing={2} sx={{ mt: 2 }}>
                         <Grid item xs={12}>
                              <FormControl>
                                   <InputLabel id="transaccion-label">Código de Transacción</InputLabel>
                                   <Select
                                        labelId="transaccion-label"
                                        value={codigoTransaccion}
                                        label="Código de Transacción"
                                        onChange={(e: SelectChangeEvent) => setCodigoTransaccion(e.target.value)}
                                        disabled={isLoadingTransacciones}
                                   >
                                        <MenuItem value="">
                                             <em>Ninguno</em>
                                        </MenuItem>
                                        {transacciones.map((t) => (
                                             <MenuItem key={t.id} value={t.codigo_transaccion}>
                                                  {t.codigo_transaccion} - {t.nombre}
                                             </MenuItem>
                                        ))}
                                   </Select>
                              </FormControl>
                         </Grid>
                    </Grid>

                    {/* Botón Generar */}
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

                    {/* Modal PDF */}
                    <Modal
                         open={modalOpen}
                         onClose={(_, reason) => {
                              if (isLoading && (reason === 'backdropClick' || reason === 'escapeKeyDown')) return;
                              setModalOpen(false);
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
                              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1, position: 'relative' }}>
                                   <Typography
                                        variant="h6"
                                        sx={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)', fontWeight: 'bold' }}
                                   >
                                        Vista Previa del Informe
                                   </Typography>
                                   <IconButton onClick={() => setModalOpen(false)} disabled={isLoading} sx={{ ml: 'auto' }}>
                                        <CloseIcon />
                                   </IconButton>
                              </Box>

                              {mayorGeneralData ? (
                                   <PDFViewer width="100%" height="100%">
                                        <MayorGeneralPDF
                                             data={mayorGeneralData.report}
                                             startDate={mayorGeneralData.startDate}
                                             endDate={mayorGeneralData.endDate}
                                             initialAccount={mayorGeneralData.initialAccount}
                                             finalAccount={mayorGeneralData.finalAccount}
                                             transaction={mayorGeneralData.transaction}
                                        />
                                   </PDFViewer>
                              ) : (
                                   <Typography textAlign="center" mt={2}>No hay datos para mostrar.</Typography>
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

export default MayorGeneral;