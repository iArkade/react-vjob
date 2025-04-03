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

const MayorGeneral: React.FC = () => {
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
     const [transaction, setTransaction] = useState('');
     const [modalOpen, setModalOpen] = useState(false);

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
          transaction,
     );

     const obtenerDatos = async () => {
          const result = await refetch();
          if (result.data) {
               setModalOpen(true);
          }
     };
     const cerrarModal = () => {
          setModalOpen(false);
          setInitialAccount('');
          setFinalAccount('');
          setTransaction('');
          setStartDate(format(new Date(new Date().getFullYear(), 0, 1), 'yyyy-MM-dd'));
          setEndDate(format(new Date(), 'yyyy-MM-dd'));

     };

     return (
          <Container maxWidth="md">
               <Box my={5} p={3} sx={{ bgcolor: 'background.paper', borderRadius: 2, boxShadow: 3 }}>
                    <Typography variant="h4" component="h1" gutterBottom align="center" sx={{ fontWeight: 'bold' }}>
                         Mayor General
                    </Typography>

                    <Grid container spacing={2} justifyContent="center" sx={{ mt: 3 }}>
                         <Grid item xs={12} sm={6}>
                              <TextField
                                   fullWidth
                                   label="Cuenta Inicial"
                                   value={initialAccount}
                                   onChange={(e) => setInitialAccount(e.target.value)}
                                   placeholder="Ej. 1.1.1.01.01"
                              />
                         </Grid>

                         <Grid item xs={12} sm={6}>
                              <TextField
                                   fullWidth
                                   label="Cuenta Final"
                                   value={finalAccount}
                                   onChange={(e) => setFinalAccount(e.target.value)}
                                   placeholder="Ej. 1.1.1.01.02"
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

                    <Grid container spacing={2} justifyContent="center" sx={{ mt: 2 }}>
                         <Grid item xs={12}>
                              <TextField
                                   label="Transacciones"
                                   value={transaction}
                                   onChange={(e) => setTransaction(e.target.value)}
                                   placeholder="Ej. TRASL+, FACT, ING, etc."
                              />
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
                    {/* Cerrar sin que afecte en nada a los datos antes de la busqueda
                         onClose={() => setModalOpen(false)}
                    */}
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
                                        mb: 1, // Margen inferior para separar del contenido
                                        position: 'relative' // Para centrado absoluto del título
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
                                        Vista Previa del Informe
                                   </Typography>
                                   <IconButton
                                        onClick={cerrarModal}
                                        disabled={isLoading}
                                        sx={{ ml: 'auto' }}
                                   >
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
                                   <Typography textAlign="center" mt={2}>
                                        No hay datos para mostrar.
                                   </Typography>
                              )}
                         </Box>
                    </Modal>
               </Box>
          </Container>
     );
};

export default MayorGeneral;