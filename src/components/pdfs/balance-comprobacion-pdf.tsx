import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';
import { BalanceComprobacionItem } from '@/api/balance-comprobacion/balanceC-types';

interface BalanceComprobacionPDFProps {
    startDate: string;
    endDate: string;
    initialAccount?: string;
    finalAccount?: string;
    level: number | 'All';
    report: BalanceComprobacionItem[];
    totalSaldoAnteriorDebe: number;
    totalSaldoAnteriorHaber: number;
    totalMovimientosDebe: number;
    totalMovimientosHaber: number;
    totalSaldosDebe: number;
    totalSaldosHaber: number;
    diferenciaMovimientos: number;
    diferenciaSaldos: number;
}

const styles = StyleSheet.create({
    page: {
        padding: 30,
        fontFamily: 'Helvetica',
        fontSize: 10,
        backgroundColor: '#FFFFFF',
    },
    header: {
        fontSize: 18,
        marginBottom: 8,
        fontWeight: 'bold',
        textAlign: 'center',
        color: '#1a365d',
        textTransform: 'uppercase',
    },
    dateRange: {
        fontSize: 11,
        marginBottom: 15,
        textAlign: 'center',
        fontWeight: 'bold',
        color: '#2d3748',
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
        marginBottom: 4,
        lineHeight: 1.4,
    },
    table: {
        display: 'flex',
        width: '100%',
        borderStyle: 'solid',
        borderWidth: 1,
        borderColor: '#cbd5e0',
        borderRadius: 3,
        marginTop: 10,
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    },
    tableRow: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: '#e2e8f0',
        minHeight: 24,
        alignItems: 'center',
    },
    tableRowEven: {
        backgroundColor: '#f7fafc',
    },
    tableRowOdd: {
        backgroundColor: '#ffffff',
    },
    // Estilos mejorados para los encabezados de tabla
    tableColHeader: {
        paddingVertical: 8,
        paddingHorizontal: 5,
        textAlign: 'center',
        fontWeight: 'bold',
        color: 'white',
    },
    tableHeaderMain: {
        backgroundColor: '#1a365d',  // Color más oscuro para el encabezado principal
        paddingTop: 10,
        paddingBottom: 10,
    },
    tableHeaderSecondary: {
        backgroundColor: '#2b6cb0',  // Color más claro para los subencabezados
        paddingTop: 6,
        paddingBottom: 6,
    },
    tableHeaderEmpty: {
        backgroundColor: '#f7fafc',
    },
    codeHeader: {
        width: '14%',
        borderRight: '1px solid #e2e8f0',
    },
    nameHeader: {
        width: '26%',
        borderRight: '1px solid #e2e8f0',
    },
    saldoAnteriorHeader: {
        width: '12%',
        borderRight: '1px solid #e2e8f0',
    },
    movimientosGroupHeader: {
        width: '24%',
        borderRight: '1px solid #e2e8f0',
    },
    saldosGroupHeader: {
        width: '24%',
    },
    subHeader: {
        width: '12%',
        borderRight: '1px solid #e2e8f0',
    },
    lastSubHeader: {
        width: '12%',
    },
    tableColCode: {
        width: '14%',
        paddingVertical: 6,
        paddingHorizontal: 4,
        textAlign: 'left',
        justifyContent: 'center',
        borderRight: '1px solid #e2e8f0',
    },
    tableColName: {
        width: '26%',
        paddingVertical: 6,
        paddingHorizontal: 4,
        textAlign: 'left',
        justifyContent: 'center',
        borderRight: '1px solid #e2e8f0',
    },
    tableColSaldoAnterior: {
        width: '12%',
        paddingVertical: 6,
        paddingHorizontal: 4,
        textAlign: 'right',
        justifyContent: 'center',
        borderRight: '1px solid #e2e8f0',
    },
    tableColMovDebe: {
        width: '12%',
        paddingVertical: 6,
        paddingHorizontal: 4,
        textAlign: 'right',
        justifyContent: 'center',
        borderRight: '1px solid #e2e8f0',
    },
    tableColMovHaber: {
        width: '12%',
        paddingVertical: 6,
        paddingHorizontal: 4,
        textAlign: 'right',
        justifyContent: 'center',
        borderRight: '1px solid #e2e8f0',
    },
    tableColSaldoDebe: {
        width: '12%',
        paddingVertical: 6,
        paddingHorizontal: 4,
        textAlign: 'right',
        justifyContent: 'center',
        borderRight: '1px solid #e2e8f0',
    },
    tableColSaldoHaber: {
        width: '12%',
        paddingVertical: 6,
        paddingHorizontal: 4,
        textAlign: 'right',
        justifyContent: 'center',
    },
    tableCell: {
        fontSize: 9,
        lineHeight: 1.3,
    },
    tableHeaderCell: {
        fontSize: 9,
        lineHeight: 1.3,
        fontWeight: 'bold',
    },
    boldText: {
        fontWeight: 'bold',
    },
    footer: {
        position: 'absolute',
        bottom: 15,
        left: 30,
        right: 30,
        textAlign: 'center',
        fontSize: 8,
        color: '#a0aec0',
        borderTopWidth: 1,
        borderTopColor: '#e2e8f0',
        paddingTop: 5,
    },
    totalsSection: {
        marginTop: 0,
        borderTop: '2px solid #1a365d',  // Color más oscuro para consistencia
    },
    totalRow: {
        flexDirection: 'row',
        backgroundColor: '#edf2f7',
        paddingVertical: 8,  // Aumentado para mejor visibilidad
        borderBottomWidth: 1,
        borderBottomColor: '#cbd5e0',
    },
    totalLabelCell: {
        width: '40%', // Código + Nombre
        paddingLeft: 10,
        fontWeight: 'bold',
        fontSize: 10,
        color: '#1a365d',
        textAlign: 'left',
    },
    totalValueCell: {
        width: '12%',
        textAlign: 'right',
        paddingRight: 5,
        fontWeight: 'bold',
        fontSize: 10,
        color: '#1a365d',
    },
    differenceRow: {
        flexDirection: 'row',
        backgroundColor: '#f0f5ff',
        paddingVertical: 7,
    },
    differenceLabelCell: {
        width: '40%', // Código + Nombre
        paddingLeft: 10,
        fontWeight: 'bold',
        fontSize: 9,
        color: '#2c5282',
        textAlign: 'left',
    },
    differenceValueCell: {
        width: '12%',
        textAlign: 'right',
        paddingRight: 5,
        fontWeight: 'bold',
        fontSize: 9,
        color: '#2c5282',
    },
    positiveValue: {
        color: '#000000', // Negro para valores positivos
    },
    negativeValue: {
        color: '#e53e3e', // Rojo para valores negativos
    },
});

const BalanceComprobacionPDF: React.FC<BalanceComprobacionPDFProps> = ({
    startDate,
    endDate,
    initialAccount,
    finalAccount,
    level,
    report,
    totalSaldoAnteriorDebe,
    totalSaldoAnteriorHaber,
    totalMovimientosDebe,
    totalMovimientosHaber,
    totalSaldosDebe,
    totalSaldosHaber,
    diferenciaMovimientos,
    diferenciaSaldos
}) => {
    const formatCurrency = (value: number | null | undefined, isNegative = false) => {
        const numericValue = Math.abs(value || 0);
        const formatted = new Intl.NumberFormat('es-EC', {
            style: 'decimal',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        }).format(numericValue);

        return formatted;
    };

    const formatValueWithSign = (value: number, tipoCuenta?: string) => {
        // Determinar si el valor debe mostrarse como negativo según la naturaleza de la cuenta
        let isNegative = false;

        if (tipoCuenta) {
            if (tipoCuenta === 'activo' || tipoCuenta === 'gasto') {
                // Para activos y gastos: 
                // - Saldo normal: DEUDOR (positivo)
                // - Saldo no normal: ACREEDOR (negativo, mostrar en rojo)
                isNegative = value < 0;
            } else { // pasivo, patrimonio, ingreso
                // Para pasivos, patrimonio e ingresos:
                // - Saldo normal: ACREEDOR (positivo)
                // - Saldo no normal: DEUDOR (negativo, mostrar en rojo)
                isNegative = value < 0;
            }
        } else {
            // Para totales y diferencias
            isNegative = value < 0;
        }

        return (
            <Text style={isNegative ? styles.negativeValue : styles.positiveValue}>
                {isNegative ? `(${formatCurrency(Math.abs(value))})` : formatCurrency(value)}
            </Text>
        );
    };

    const formatDate = (dateString: string) => {
        const date = new Date(`${dateString}T00:00:00Z`);
        return date.toLocaleDateString('es-EC', {
            timeZone: 'UTC',
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    };

    const fechaEmision = new Date().toLocaleString('es-EC', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });

    const splitReportIntoPages = (report: BalanceComprobacionItem[], rowsPerPage: number = 15) => {
        const pages = [];
        for (let i = 0; i < report.length; i += rowsPerPage) {
            pages.push(report.slice(i, i + rowsPerPage));
        }
        return pages;
    };

    const pages = splitReportIntoPages(report);

    return (
        <Document>
            {pages.map((page, pageIndex) => (
                <Page key={pageIndex} size="A4" style={styles.page}>
                    <Text style={styles.header}>Balance de Comprobación</Text>
                    <Text style={styles.dateRange}>
                        Desde: {formatDate(startDate)} - Hasta: {formatDate(endDate)}
                    </Text>

                    <View style={styles.infoContainer}>
                        <View style={styles.infoLeft}>
                            {initialAccount && (
                                <Text style={styles.infoText}>Cuenta inicial: {initialAccount}</Text>
                            )}
                            {finalAccount && (
                                <Text style={styles.infoText}>Cuenta final: {finalAccount}</Text>
                            )}
                            {level && (
                                <Text style={styles.infoText}>Nivel: {level}</Text>
                            )}
                        </View>
                        <View style={styles.infoRight}>
                            <Text style={styles.infoText}>Fecha de emisión: {fechaEmision}</Text>
                            <Text style={styles.infoText}>Página {pageIndex + 1} de {pages.length}</Text>
                        </View>
                    </View>

                    <View style={styles.table}>
                        {/* Encabezados principales con mejor diseño */}
                        <View style={styles.tableRow}>
                            <View style={[styles.tableColHeader, styles.tableHeaderMain, styles.codeHeader]}>
                                <Text style={styles.tableHeaderCell}>CTA. CÓDIGO</Text>
                            </View>
                            <View style={[styles.tableColHeader, styles.tableHeaderMain, styles.nameHeader]}>
                                <Text style={styles.tableHeaderCell}>CTA. NOMBRE</Text>
                            </View>
                            <View style={[styles.tableColHeader, styles.tableHeaderMain, styles.saldoAnteriorHeader]}>
                                <Text style={styles.tableHeaderCell}>SALDO ANTERIOR</Text>
                            </View>
                            <View style={[styles.tableColHeader, styles.tableHeaderMain, styles.movimientosGroupHeader]}>
                                <Text style={styles.tableHeaderCell}>MOVIMIENTOS</Text>
                            </View>
                            <View style={[styles.tableColHeader, styles.tableHeaderMain, styles.saldosGroupHeader]}>
                                <Text style={styles.tableHeaderCell}>SALDOS</Text>
                            </View>
                        </View>

                        {/* Subencabezados */}
                        <View style={styles.tableRow}>
                            <View style={[styles.tableColHeader, styles.tableHeaderEmpty, styles.codeHeader]} />
                            <View style={[styles.tableColHeader, styles.tableHeaderEmpty, styles.nameHeader]} />
                            <View style={[styles.tableColHeader, styles.tableHeaderEmpty, styles.saldoAnteriorHeader]} />
                            <View style={[styles.tableColHeader, styles.tableHeaderSecondary, styles.subHeader]}>
                                <Text style={styles.tableHeaderCell}>DEBE</Text>
                            </View>
                            <View style={[styles.tableColHeader, styles.tableHeaderSecondary, styles.subHeader]}>
                                <Text style={styles.tableHeaderCell}>HABER</Text>
                            </View>
                            <View style={[styles.tableColHeader, styles.tableHeaderSecondary, styles.subHeader]}>
                                <Text style={styles.tableHeaderCell}>DEBE</Text>
                            </View>
                            <View style={[styles.tableColHeader, styles.tableHeaderSecondary, styles.lastSubHeader]}>
                                <Text style={styles.tableHeaderCell}>HABER</Text>
                            </View>
                        </View>

                        {/* Filas de datos */}
                        {page.map((item, index) => (
                            <View
                                key={index}
                                style={[
                                    styles.tableRow,
                                    index % 2 === 0 ? styles.tableRowEven : styles.tableRowOdd
                                ]}
                            >
                                <View style={styles.tableColCode}>
                                    <Text style={styles.tableCell}>{item.codigo}</Text>
                                </View>
                                <View style={styles.tableColName}>
                                    <Text style={styles.tableCell}>{item.nombre}</Text>
                                </View>
                                <View style={styles.tableColSaldoAnterior}>
                                    {item.tipoCuenta === 'activo' || item.tipoCuenta === 'gasto'
                                        ? formatValueWithSign(item.saldoAnteriorDebe - item.saldoAnteriorHaber)
                                        : formatValueWithSign(item.saldoAnteriorHaber - item.saldoAnteriorDebe)}
                                </View>
                                {/* Movimientos */}
                                <View style={styles.tableColMovDebe}>
                                    {formatValueWithSign(item.movimientosDebe)}
                                </View>
                                <View style={styles.tableColMovHaber}>
                                    {formatValueWithSign(item.movimientosHaber)}
                                </View>
                                {/* Saldos */}
                                <View style={styles.tableColSaldoDebe}>
                                    {item.saldoDebe > 0 ? formatValueWithSign(item.saldoDebe) : formatValueWithSign(0)}
                                </View>
                                <View style={styles.tableColSaldoHaber}>
                                    {item.saldoHaber > 0 ? formatValueWithSign(item.saldoHaber) : formatValueWithSign(0)}
                                </View>
                            </View>
                        ))}

                        {/* Totales - sólo en la última página */}
                        {pageIndex === pages.length - 1 && (
                            <View style={styles.totalsSection}>
                                {/* SALDO ANTERIOR TOTAL */}
                                <View style={styles.totalRow}>
                                    <View style={styles.totalLabelCell}>
                                        <Text>GRAN TOTAL:</Text>
                                    </View>
                                    <View style={styles.totalValueCell}>
                                        {formatValueWithSign(totalSaldoAnteriorDebe - totalSaldoAnteriorHaber)}
                                    </View>
                                    <View style={styles.totalValueCell}>
                                        {formatValueWithSign(totalMovimientosDebe)}
                                    </View>
                                    <View style={styles.totalValueCell}>
                                        {formatValueWithSign(totalMovimientosHaber)}
                                    </View>
                                    <View style={styles.totalValueCell}>
                                        {formatValueWithSign(totalSaldosDebe)}
                                    </View>
                                    <View style={styles.totalValueCell}>
                                        {formatValueWithSign(totalSaldosHaber)}
                                    </View>
                                </View>

                                {/* DIFERENCIAS */}
                                <View style={styles.differenceRow}>
                                    <View style={styles.differenceLabelCell}>
                                        <Text>DIFERENCIAS:</Text>
                                    </View>
                                    <View style={styles.differenceValueCell}></View>
                                    <View style={styles.differenceValueCell}>
                                        {diferenciaMovimientos !== 0 && formatValueWithSign(diferenciaMovimientos)}
                                    </View>
                                    <View style={styles.differenceValueCell}></View>
                                    <View style={styles.differenceValueCell}>
                                        {diferenciaSaldos !== 0 && formatValueWithSign(diferenciaSaldos)}
                                    </View>
                                    <View style={styles.differenceValueCell}></View>
                                </View>
                            </View>
                        )}
                    </View>

                    <Text style={styles.footer}>
                        Este documento es una representación impresa del Balance de Comprobación. © {new Date().getFullYear()}
                    </Text>
                </Page>
            ))}
        </Document>
    );
};

export default BalanceComprobacionPDF;