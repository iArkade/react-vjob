import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';
import { BalanceGeneralItem } from '@/api/balance-general/balance-types';

interface BalanceGeneralPDFProps {
    endDate: string;
    level: number | 'All';
    report: BalanceGeneralItem[];
}

// Definir estilos mejorados
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
    tableRow: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: '#e2e8f0',
        minHeight: 22, // Altura mínima para mejorar la legibilidad
    },
    tableRowEven: {
        backgroundColor: '#f7fafc',
    },
    tableRowOdd: {
        backgroundColor: '#ffffff',
    },
    tableColHeader: {
        backgroundColor: '#2b6cb0',
        padding: 8,
        textAlign: 'center',
        fontWeight: 'bold',
        color: 'white',
    },
    codeHeader: {
        width: '25%',
        borderRight: '1px solid #e2e8f0',
    },
    nameHeader: {
        width: '50%',
        borderRight: '1px solid #e2e8f0',
    },
    totalHeader: {
        width: '25%',
    },
    tableColCode: {
        width: '25%',
        padding: '5px 8px',
        textAlign: 'left',
        justifyContent: 'center',
        borderRight: '1px solid #e2e8f0',
    },
    tableColName: {
        width: '50%',
        padding: '5px 8px',
        textAlign: 'left',
        justifyContent: 'center',
        borderRight: '1px solid #e2e8f0',
    },
    tableColTotal: {
        width: '25%',
        padding: '5px 8px',
        textAlign: 'right',
        justifyContent: 'center',
    },
    tableCell: {
        fontSize: 9,
    },
    boldText: {
        fontWeight: 'bold',
    },
    // Diferentes niveles de indentación
    level1: {
        paddingLeft: 0,
    },
    level2: {
        paddingLeft: 10,
    },
    level3: {
        paddingLeft: 20,
    },
    level4: {
        paddingLeft: 30,
    },
    // Estilos para totales
    sectionTotal: {
        backgroundColor: '#ebf8ff',
        fontWeight: 'bold',
    },
    mainTotal: {
        backgroundColor: '#2c5282',
        color: 'white',
        fontWeight: 'bold',
    },
    finalTotal: {
        backgroundColor: '#1a365d',
        color: 'white',
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
    balanceCorrect: {
        color: '#38a169',
        fontWeight: 'bold'
    },
    balanceIncorrect: {
        color: '#e53e3e',
        fontWeight: 'bold'
    },
    warningBox: {
        marginTop: 10,
        padding: 8,
        backgroundColor: '#fff5f5',
        border: '1px solid #fed7d7',
        borderRadius: 4
    }
});

const BalanceGeneralPDF: React.FC<BalanceGeneralPDFProps> = ({ endDate, level, report }) => {
    const formatCurrency = (value: number | null | undefined) => {
        const numericValue = value || 0;
        return new Intl.NumberFormat('es-EC', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 2,
        }).format(numericValue);
    };

    const formatEndDate = (dateString: string) => {
        // Añadir hora UTC explícita para evitar cambios
        const date = new Date(`${dateString}T00:00:00Z`); // <- "Z" indica UTC
        return date.toLocaleDateString('es-EC', {
            timeZone: 'UTC', // Fuerza UTC en el formateo
            day: '2-digit',
            month: 'long',
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

    // Obtener nivel de indentación para el nombre basado en el nivel de la cuenta
    const getLevelStyle = (level: number) => {
        switch (level) {
            case 1: return styles.level1;
            case 2: return styles.level2;
            case 3: return styles.level3;
            case 4: return styles.level4;
            default: return styles.level4;
        }
    };

    // Determinar el estilo de una fila basado en su código y si es un total
    const getRowStyle = (item: BalanceGeneralItem, index: number) => {
        if (item.code === 'TOTALPYPNET' || item.code === 'NET') {
            return styles.finalTotal;
        }
        if (item.code.startsWith('TOTAL')) {
            return styles.mainTotal;
        }
        if (item.isHeader && item.level === 1) {
            return styles.sectionTotal;
        }

        return index % 2 === 0 ? styles.tableRowEven : styles.tableRowOdd;
    };

    // Dividir el reporte en páginas
    const splitReportIntoPages = (report: BalanceGeneralItem[], rowsPerPage: number = 21) => {
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
                    {/* Encabezado */}
                    <Text style={styles.header}>VJOB</Text>
                    <Text style={styles.header}>ESTADO DE SITUACIÓN FINANCIERA</Text>
                    <Text style={styles.subheader}>Al {formatEndDate(endDate)}</Text>

                    {/* Información adicional */}
                    <View style={styles.infoContainer}>
                        <View style={styles.infoLeft}>
                            <Text style={styles.infoText}>Nivel de detalle: {level === 'All' ? 'Todos' : level}</Text>
                            <Text style={styles.infoText}>Ejercicio Fiscal: {new Date(endDate).getFullYear()}</Text>
                        </View>
                        <View style={styles.infoRight}>
                            <Text style={styles.infoText}>Fecha de emisión: {fechaEmision}</Text>
                            {/* <Text style={[
                                styles.infoText,
                                balanceCorrecto ? styles.balanceCorrect : styles.balanceIncorrect
                            ]}>
                                {balanceCorrecto ? 'Balance Correcto ✓' : 'Balance Desequilibrado ✗'}
                            </Text> */}
                            <Text style={styles.infoText}>Página {pageIndex + 1} de {pages.length}</Text>
                        </View>
                    </View>

                    {/* Tabla */}
                    <View style={styles.table}>
                        {/* Encabezado de la tabla */}
                        <View style={[styles.tableRow]}>
                            <View style={[styles.tableColHeader, styles.codeHeader]}>
                                <Text style={styles.tableCell}>CÓDIGO</Text>
                            </View>
                            <View style={[styles.tableColHeader, styles.nameHeader]}>
                                <Text style={styles.tableCell}>CUENTA</Text>
                            </View>
                            <View style={[styles.tableColHeader, styles.totalHeader]}>
                                <Text style={styles.tableCell}>SALDO</Text>
                            </View>
                        </View>

                        {/* Filas de la tabla */}
                        {page.map((item, index) => (
                            <View
                                key={index}
                                style={[
                                    styles.tableRow,
                                    getRowStyle(item, index)
                                ]}
                            >
                                <View style={styles.tableColCode}>
                                    <Text style={[
                                        styles.tableCell,
                                        item.isHeader ? styles.boldText : {}
                                    ]}>
                                        {item.code}
                                    </Text>
                                </View>
                                <View style={styles.tableColName}>
                                    <Text style={[
                                        styles.tableCell,
                                        item.isHeader ? styles.boldText : {},
                                        getLevelStyle(item.level)
                                    ]}>
                                        {item.name}
                                    </Text>
                                </View>
                                <View style={styles.tableColTotal}>
                                    <Text style={[
                                        styles.tableCell,
                                        item.isHeader ? styles.boldText : {}
                                    ]}>
                                        {formatCurrency(item.total)}
                                    </Text>
                                </View>
                            </View>
                        ))}
                    </View>

                    {/* Pie de página */}
                    <Text style={styles.footer}>
                        Este documento es una representación impresa del Balance General. VJOB © {new Date().getFullYear()}
                    </Text>
                </Page>
            ))}
        </Document>
    );
};

export default BalanceGeneralPDF;