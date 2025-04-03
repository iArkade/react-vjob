// components/pdfs/mayor-general-pdf.tsx
import { MayorGeneralCuenta } from '@/api/mayor-general/mayor-types';
import {
     Document,
     Page,
     Text,
     View,
     StyleSheet,
} from '@react-pdf/renderer';
import { format } from 'date-fns';

interface Props {
     data: MayorGeneralCuenta[];
     startDate?: string;
     endDate?: string;
     initialAccount?: string;
     finalAccount?: string;
     transaction?: string;
}

const styles = StyleSheet.create({
     page: {
          padding: 40,
          fontSize: 9,
          fontFamily: 'Helvetica',
          backgroundColor: '#FFFFFF',
     },
     header: {
          fontSize: 18,
          marginBottom: 4,
          fontWeight: 'bold',
          textAlign: 'center',
          color: '#1a365d',
     },
     subheader: {
          fontSize: 12,
          marginBottom: 10,
          textAlign: 'center',
          color: '#2c5282',
     },
     infoContainer: {
          flexDirection: 'row',
          justifyContent: 'space-between',
          marginBottom: 10,
          borderBottom: '1px solid #e2e8f0',
          paddingBottom: 6,
     },
     infoLeft: {
          width: '50%',
     },
     infoRight: {
          width: '50%',
          textAlign: 'right',
     },
     infoText: {
          fontSize: 9,
          color: '#4a5568',
          marginBottom: 3,
     },
     cuentaTitulo: {
          fontSize: 11,
          marginTop: 12,
          fontWeight: 'bold',
          color: '#1a202c',
     },
     tableHeader: {
          flexDirection: 'row',
          backgroundColor: '#2b6cb0',
          color: 'white',
          fontWeight: 'bold',
          padding: 4,
     },
     row: {
          flexDirection: 'row',
          padding: 4,
          borderBottomWidth: 0.5,
          borderBottomColor: '#e2e8f0',
     },
     col: {
          paddingHorizontal: 2,
     },
     colFecha: { width: '10%' },
     colAsiento: { width: '18%' },
     colDescripcion: { width: '26%' },
     colNota: { width: '10%' },
     colDebe: { width: '10%', textAlign: 'right' },
     colHaber: { width: '10%', textAlign: 'right' },
     colSaldo: { width: '16%', textAlign: 'right' },
     footer: {
          position: 'absolute',
          bottom: 15,
          left: 40,
          right: 40,
          textAlign: 'center',
          fontSize: 8,
          color: '#a0aec0',
          borderTopWidth: 1,
          borderTopColor: '#e2e8f0',
          paddingTop: 5,
     },
});

const MayorGeneralPDF: React.FC<Props> = ({
     data,
     startDate,
     endDate,
     initialAccount,
     finalAccount,
     transaction,
}) => {
     const fechaEmision = new Date().toLocaleString('es-EC', {
          day: '2-digit',
          month: 'long',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
     });

     return (
          <Document>
               <Page size="A4" style={styles.page}>
                    <Text style={styles.header}>VJOB</Text>
                    <Text style={styles.header}>REPORTE MAYOR GENERAL</Text>
                    <Text style={styles.subheader}>
                         Desde: {startDate} | Hasta: {endDate}
                    </Text>

                    <View style={styles.infoContainer}>
                         <View style={styles.infoLeft}>
                              <Text style={styles.infoText}>Cuenta Inicial: {initialAccount || '-'}</Text>
                              <Text style={styles.infoText}>Cuenta Final: {finalAccount || '-'}</Text>
                              {transaction && <Text style={styles.infoText}>Transacción: {transaction}</Text>}
                         </View>
                         <View style={styles.infoRight}>
                              <Text style={styles.infoText}>Fecha de emisión: {fechaEmision}</Text>
                         </View>
                    </View>

                    {data.map((cuenta, index) => (
                         <View key={index}>
                              <Text style={styles.cuentaTitulo}>{cuenta.cuenta}</Text>

                              <View style={styles.tableHeader}>
                                   <Text style={[styles.col, styles.colFecha]}>Fecha</Text>
                                   <Text style={[styles.col, styles.colAsiento]}>Asiento</Text>
                                   <Text style={[styles.col, styles.colDescripcion]}>Descripción</Text>
                                   <Text style={[styles.col, styles.colNota]}>Nota</Text>
                                   <Text style={[styles.col, styles.colDebe]}>Debe</Text>
                                   <Text style={[styles.col, styles.colHaber]}>Haber</Text>
                                   <Text style={[styles.col, styles.colSaldo]}>Saldo</Text>
                              </View>

                              {/* Fila SALDO ANTERIOR */}
                              <View style={styles.row}>
                                   <Text style={[styles.col, styles.colFecha]}>-</Text>
                                   <Text style={[styles.col, styles.colAsiento]}>-</Text>
                                   <Text style={[styles.col, styles.colDescripcion]}>SALDO ANTERIOR</Text>
                                   <Text style={[styles.col, styles.colNota]}>-</Text>
                                   <Text style={[styles.col, styles.colDebe]}>-</Text>
                                   <Text style={[styles.col, styles.colHaber]}>-</Text>
                                   <Text style={[styles.col, styles.colSaldo]}>
                                        {cuenta.saldoInicial.toFixed(2)}
                                   </Text>
                              </View>

                              {cuenta.movimientos.map((m, i) => (
                                   <View key={i} style={styles.row}>
                                        <Text style={[styles.col, styles.colFecha]}>
                                             {format(new Date(m.fecha), 'yyyy-MM-dd')}
                                        </Text>
                                        <Text style={[styles.col, styles.colAsiento]}>{m.nro_asiento}</Text>
                                        <Text style={[styles.col, styles.colDescripcion]}>{m.descripcion}</Text>
                                        <Text style={[styles.col, styles.colNota]}>{m.nota || '-'}</Text>
                                        <Text style={[styles.col, styles.colDebe]}>{m.debe.toFixed(2)}</Text>
                                        <Text style={[styles.col, styles.colHaber]}>{m.haber.toFixed(2)}</Text>
                                        <Text style={[styles.col, styles.colSaldo]}>{m.saldo.toFixed(2)}</Text>
                                   </View>
                              ))}
                         </View>
                    ))}

                    <Text style={styles.footer}>
                         Este documento es una representación impresa del Mayor General. VJOB © {new Date().getFullYear()}
                    </Text>
               </Page>
          </Document>
     );
};

export default MayorGeneralPDF;