import { LibroDiarioAsiento, LibroDiarioResponseType } from '@/api/libro-diario/libro-types';
import { Page, Text, View, Document, StyleSheet, pdf } from '@react-pdf/renderer';

const styles = StyleSheet.create({
    page: {
        padding: 40,
        fontFamily: 'Helvetica',
        fontSize: 10,
        backgroundColor: '#FFFFFF',
    },
    header: {
        fontSize: 18,
        marginBottom: 6,
        fontWeight: 'bold',
        textAlign: 'center',
        color: '#1a365d',
    },
    subheader: {
        fontSize: 12,
        marginBottom: 15,
        textAlign: 'center',
        color: '#2c5282',
    },
    infoContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 15,
        borderBottom: '1px solid #e2e8f0',
        paddingBottom: 10,
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
    table: {
        display: 'flex',
        width: '100%',
        borderStyle: 'solid',
        borderWidth: 1,
        borderColor: '#cbd5e0',
        borderRadius: 2,
        marginTop: 10,
    },
    tableHeader: {
        flexDirection: 'row',
        backgroundColor: '#2b6cb0',
        color: 'white',
        fontWeight: 'bold',
        borderBottomWidth: 1,
        borderBottomColor: '#e2e8f0',
    },
    tableRow: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: '#e2e8f0',
    },
    tableRowEven: {
        backgroundColor: '#f7fafc',
    },
    tableRowOdd: {
        backgroundColor: '#ffffff',
    },
    mesHeader: {
        backgroundColor: '#4299e1',
        color: 'white',
        fontWeight: 'bold',
    },
    colFecha: {
        width: '10%',
        padding: 5,
        borderRight: '1px solid #e2e8f0',
    },
    colCuenta: {
        width: '12%',
        padding: 5,
        borderRight: '1px solid #e2e8f0',
    },
    colNombre: {
        width: '28%',
        padding: 5,
        borderRight: '1px solid #e2e8f0',
    },
    colReferencia: {
        width: '15%',
        padding: 5,
        borderRight: '1px solid #e2e8f0',
    },
    colDebe: {
        width: '10%',
        padding: 5,
        borderRight: '1px solid #e2e8f0',
        textAlign: 'right',
    },
    colHaber: {
        width: '10%',
        padding: 5,
        borderRight: '1px solid #e2e8f0',
        textAlign: 'right',
    },
    colDiferencia: {
        width: '10%',
        padding: 5,
        textAlign: 'right',
    },
    tableCell: {
        fontSize: 9,
    },
    boldText: {
        fontWeight: 'bold',
    },
    totalRow: {
        backgroundColor: '#ebf8ff',
        fontWeight: 'bold',
    },
    pageNumber: {
        position: 'absolute',
        bottom: 30,
        left: 0,
        right: 0,
        textAlign: 'center',
        fontSize: 9,
        color: '#718096',
    },
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

const formatCurrency = (value: number): string => {
    return value.toLocaleString('es-ES', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
};

const formatDate = (dateString: string): string => {
    try {
        // Asegurar que la fecha se maneja en UTC para evitar problemas de zona horaria
        const date = new Date(dateString);
        date.setMinutes(date.getMinutes() + date.getTimezoneOffset());
        
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    } catch (error) {
        console.error('Error al formatear fecha:', error);
        return dateString;
    }
};

const getMonthName = (dateString: string): string => {
    const months = [
        'ENERO', 'FEBRERO', 'MARZO', 'ABRIL', 'MAYO', 'JUNIO',
        'JULIO', 'AGOSTO', 'SEPTIEMBRE', 'OCTUBRE', 'NOVIEMBRE', 'DICIEMBRE'
    ];
    try {
        const date = new Date(dateString);
        date.setMinutes(date.getMinutes() + date.getTimezoneOffset());
        return months[date.getMonth()];
    } catch (error) {
        console.error('Error al obtener nombre del mes:', error);
        return 'MES DESCONOCIDO';
    }
};

const getMonthNumber = (dateString: string): string => {
    try {
        const date = new Date(dateString);
        date.setMinutes(date.getMinutes() + date.getTimezoneOffset());
        return (date.getMonth() + 1).toString().padStart(2, '0');
    } catch (error) {
        console.error('Error al obtener número del mes:', error);
        return '00';
    }
};

const calculateAsientoHeight = (asiento: LibroDiarioAsiento) => {
    // Cada item del asiento ocupa 1 unidad + fila de total (1 unidad)
    return asiento.items.length + 1;
};

const splitIntoPages = (asientos: LibroDiarioAsiento[], maxRowsPerPage = 12) => {
    const pages: Array<{
        asientos: LibroDiarioAsiento[];
        currentMonth?: string;
    }> = [];
    
    let currentPageAsientos: LibroDiarioAsiento[] = [];
    let currentPageRows = 0;
    let currentMonth: string | undefined = undefined;

    for (const asiento of asientos) {
        const asientoMonth = getMonthNumber(asiento.fecha_emision);
        const asientoHeight = calculateAsientoHeight(asiento);

        // Si cambia el mes o la página está llena, crear nueva página
        if ((currentMonth && asientoMonth !== currentMonth) || 
            (currentPageRows + asientoHeight > maxRowsPerPage && currentPageAsientos.length > 0)) {
            
            pages.push({
                asientos: currentPageAsientos,
                currentMonth
            });
            
            currentPageAsientos = [];
            currentPageRows = 0;
        }

        currentMonth = asientoMonth;
        currentPageAsientos.push(asiento);
        currentPageRows += asientoHeight;
    }

    // Agregar la última página
    if (currentPageAsientos.length > 0) {
        pages.push({
            asientos: currentPageAsientos,
            currentMonth
        });
    }

    return pages;
};

const LibroDiarioPDF: React.FC<{
    startDate: string;
    endDate: string;
    codigoTransaccion: string;
    report: LibroDiarioResponseType;
}> = ({ startDate, endDate, codigoTransaccion, report }) => {
    const fechaEmision = new Date().toLocaleDateString('es-ES', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });

    // Ordenar asientos por fecha
    const asientosOrdenados = [...report.asientos].sort((a, b) => 
        new Date(a.fecha_emision).getTime() - new Date(b.fecha_emision).getTime()
    );

    const pages = splitIntoPages(asientosOrdenados);

    return (
        <Document>
            {pages.map((page, pageIndex) => {
                let currentMonth: string | undefined = undefined;
                
                return (
                    <Page key={pageIndex} size="A4" style={styles.page} orientation="landscape">
                        {/* Encabezado */}
                        <Text style={styles.header}>LIBRO DIARIO</Text>
                        <Text style={styles.subheader}>
                            Desde: {formatDate(startDate)} | Hasta: {formatDate(endDate)}
                        </Text>

                        {/* Información adicional */}
                        <View style={styles.infoContainer}>
                            <View style={styles.infoLeft}>
                                <Text style={styles.infoText}>Código de Transacción: {codigoTransaccion || 'Todos'}</Text>
                                <Text style={styles.infoText}>Ejercicio Fiscal: {new Date(endDate).getFullYear()}</Text>
                            </View>
                            <View style={styles.infoRight}>
                                <Text style={styles.infoText}>Fecha de emisión: {fechaEmision}</Text>
                                <Text style={styles.infoText}>Página {pageIndex + 1} de {pages.length}</Text>
                            </View>
                        </View>

                        {/* Tabla */}
                        <View style={styles.table}>
                            {/* Encabezados de la tabla */}
                            <View style={styles.tableHeader}>
                                <View style={styles.colFecha}>
                                    <Text style={[styles.tableCell, styles.boldText]}>FECHA</Text>
                                </View>
                                <View style={styles.colCuenta}>
                                    <Text style={[styles.tableCell, styles.boldText]}>CTA. CODIGO</Text>
                                </View>
                                <View style={styles.colNombre}>
                                    <Text style={[styles.tableCell, styles.boldText]}>CTA. NOMBRE</Text>
                                </View>
                                <View style={styles.colReferencia}>
                                    <Text style={[styles.tableCell, styles.boldText]}>REFERENCIA</Text>
                                </View>
                                <View style={styles.colDebe}>
                                    <Text style={[styles.tableCell, styles.boldText]}>DEBE</Text>
                                </View>
                                <View style={styles.colHaber}>
                                    <Text style={[styles.tableCell, styles.boldText]}>HABER</Text>
                                </View>
                                <View style={styles.colDiferencia}>
                                    <Text style={[styles.tableCell, styles.boldText]}>DIF.</Text>
                                </View>
                            </View>

                            {/* Asientos */}
                            {page.asientos.map((asiento) => {
                                const asientoMonth = getMonthNumber(asiento.fecha_emision);
                                const showMonthHeader = currentMonth !== asientoMonth;
                                currentMonth = asientoMonth;

                                return (
                                    <View key={asiento.id}>
                                        {/* Encabezado de mes si cambió */}
                                        {showMonthHeader && (
                                            <View style={[styles.tableRow, styles.mesHeader]}>
                                                <View style={styles.colFecha}>
                                                    <Text style={[styles.tableCell, styles.boldText]}>Mes:</Text>
                                                </View>
                                                <View style={styles.colCuenta}>
                                                    <Text style={[styles.tableCell, styles.boldText]}>{asientoMonth}</Text>
                                                </View>
                                                <View style={styles.colNombre}>
                                                    <Text style={[styles.tableCell, styles.boldText]}>
                                                        {getMonthName(asiento.fecha_emision)}
                                                    </Text>
                                                </View>
                                                <View style={styles.colReferencia}></View>
                                                <View style={styles.colDebe}></View>
                                                <View style={styles.colHaber}></View>
                                                <View style={styles.colDiferencia}></View>
                                            </View>
                                        )}

                                        {/* Items del asiento */}
                                        {asiento.items.map((item, index) => (
                                            <View 
                                                key={`${asiento.id}-${index}`}
                                                style={[
                                                    styles.tableRow,
                                                    index % 2 === 0 ? styles.tableRowEven : styles.tableRowOdd
                                                ]}
                                            >
                                                <View style={styles.colFecha}>
                                                    <Text style={styles.tableCell}>
                                                        {index === 0 ? formatDate(asiento.fecha_emision) : ''}
                                                    </Text>
                                                </View>
                                                <View style={styles.colCuenta}>
                                                    <Text style={styles.tableCell}>{item.cta}</Text>
                                                </View>
                                                <View style={styles.colNombre}>
                                                    <Text style={styles.tableCell}>{item.cta_nombre}</Text>
                                                </View>
                                                <View style={styles.colReferencia}>
                                                    <Text style={styles.tableCell}>{asiento.nro_referencia || ''}</Text>
                                                </View>
                                                <View style={styles.colDebe}>
                                                    <Text style={styles.tableCell}>
                                                        {item.debe > 0 ? formatCurrency(item.debe) : ''}
                                                    </Text>
                                                </View>
                                                <View style={styles.colHaber}>
                                                    <Text style={styles.tableCell}>
                                                        {item.haber > 0 ? formatCurrency(item.haber) : ''}
                                                    </Text>
                                                </View>
                                                <View style={styles.colDiferencia}>
                                                    <Text style={styles.tableCell}>
                                                        {Math.abs(item.debe - item.haber) > 0 ?
                                                            formatCurrency(Math.abs(item.debe - item.haber)) : ''}
                                                    </Text>
                                                </View>
                                            </View>
                                        ))}

                                        {/* Total del asiento */}
                                        <View style={[styles.tableRow, styles.totalRow]}>
                                            <View style={styles.colFecha}></View>
                                            <View style={styles.colCuenta}></View>
                                            <View style={styles.colNombre}>
                                                <Text style={[styles.tableCell, styles.boldText]}>
                                                    TOTAL ASIENTO {asiento.nro_asiento}
                                                </Text>
                                            </View>
                                            <View style={styles.colReferencia}></View>
                                            <View style={styles.colDebe}>
                                                <Text style={[styles.tableCell, styles.boldText]}>
                                                    {formatCurrency(asiento.total_debe)}
                                                </Text>
                                            </View>
                                            <View style={styles.colHaber}>
                                                <Text style={[styles.tableCell, styles.boldText]}>
                                                    {formatCurrency(asiento.total_haber)}
                                                </Text>
                                            </View>
                                            <View style={styles.colDiferencia}>
                                                <Text style={[styles.tableCell, styles.boldText]}>
                                                    {formatCurrency(Math.abs(asiento.total_debe - asiento.total_haber))}
                                                </Text>
                                            </View>
                                        </View>
                                    </View>
                                );
                            })}

                            {/* Totales generales (solo en la última página) */}
                            {pageIndex === pages.length - 1 && (
                                <View style={[styles.tableRow, styles.mesHeader]}>
                                    <View style={styles.colFecha}></View>
                                    <View style={styles.colCuenta}></View>
                                    <View style={styles.colNombre}>
                                        <Text style={[styles.tableCell, styles.boldText]}>TOTAL GENERAL</Text>
                                    </View>
                                    <View style={styles.colReferencia}></View>
                                    <View style={styles.colDebe}>
                                        <Text style={[styles.tableCell, styles.boldText]}>
                                            {formatCurrency(report.totalDebe)}
                                        </Text>
                                    </View>
                                    <View style={styles.colHaber}>
                                        <Text style={[styles.tableCell, styles.boldText]}>
                                            {formatCurrency(report.totalHaber)}
                                        </Text>
                                    </View>
                                    <View style={styles.colDiferencia}>
                                        <Text style={[styles.tableCell, styles.boldText]}>
                                            {formatCurrency(report.totalDiferencia)}
                                        </Text>
                                    </View>
                                </View>
                            )}
                        </View>

                        {/* Pie de página */}
                        <Text style={styles.footer}>
                            Este documento es una representación impresa del Libro Diario. VJOB © {new Date().getFullYear()}
                        </Text>
                    </Page>
                );
            })}
        </Document>
    );
};

export default LibroDiarioPDF;