import { Page, Text, View, Document, StyleSheet, PDFViewer } from '@react-pdf/renderer';
import { ProfitLossItem } from '@/api/perdidas-ganancias/pyg-types'; // Asegúrate de importar la interfaz correcta

interface PerdidasGananciasPDFProps {
    startDate: string;
    endDate: string;
    level: number | 'All';
    report: ProfitLossItem[];
}

const styles = StyleSheet.create({
    page: {
        padding: 40,
        fontFamily: 'Helvetica',
        fontSize: 10,
    },
    header: {
        fontSize: 18,
        marginBottom: 10,
        fontWeight: 'bold',
        textAlign: 'center',
        color: '#2c3e50',
    },
    subheader: {
        fontSize: 12,
        marginBottom: 10,
        textAlign: 'center',
        color: '#34495e',
    },
    table: {
        display: 'flex',
        width: '100%',
        borderStyle: 'solid',
        borderWidth: 1,
        borderColor: '#bdc3c7',
        marginTop: 10,
    },
    tableRow: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: '#bdc3c7',
    },
    tableColHeader: {
        width: '25%',
        padding: 5,
        backgroundColor: '#ecf0f1',
        textAlign: 'center',
        fontWeight: 'bold',
    },
    tableCol: {
        width: '25%',
        padding: 5,
        textAlign: 'center',
    },
    tableColCode: {
        width: '25%',
        padding: 5,
        textAlign: 'left',
    },
    tableCell: {
        fontSize: 10,
    },
    boldText: {
        fontWeight: 'bold', // Estilo para texto en negrita
    },
    totalRow: {
        backgroundColor: '#2ecc71',
        color: '#fff',
        fontWeight: 'bold',
    },
    pageNumber: {
        position: 'absolute',
        bottom: 20,
        left: 0,
        right: 0,
        textAlign: 'center',
        fontSize: 10,
        color: '#666',
    },
    emissionInfo: {
        fontSize: 10,
        marginBottom: 10,
        textAlign: 'center',
        color: '#34495e',
    },
});

const PerdidasGananciasPDF: React.FC<PerdidasGananciasPDFProps> = ({ startDate, endDate, level, report }) => {
    const formatCurrency = (value: number | null | undefined) => {
        const numericValue = value || 0;
        return new Intl.NumberFormat('es-EC', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 2,
        }).format(numericValue);
    };

    const fechaEmision = new Date().toLocaleString('es-EC', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
    });

    // Ajustar dinámicamente el número de filas por página según el nivel
    const getRowsPerPage = () => {
        switch (level) {
            case 1:
                return 10; // Menos filas para nivel 1
            case 2:
                return 14; // Más filas para nivel 2
            case 3:
                return 15; // Más filas para nivel 3
            case 4:
                return 16; // Más filas para nivel 4
            default:
                return 18; // Valor por defecto
        }
    };

    const splitReportIntoPages = (report: ProfitLossItem[], rowsPerPage: number = getRowsPerPage()) => {
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
                    <Text style={styles.header}>VJOB</Text>
                    <Text style={styles.header}>ESTADO DE PÉRDIDAS Y GANANCIAS</Text>
                    <Text style={styles.subheader}>
                        Desde: {startDate} | Hasta: {endDate} | Nivel: {level}
                    </Text>
                    <Text style={styles.emissionInfo}>
                        Fecha y Hora de Emisión: {fechaEmision}
                    </Text>

                    <View style={styles.table}>
                        {/* Encabezado de la tabla */}
                        <View style={styles.tableRow}>
                            <View style={styles.tableColHeader}>
                                <Text style={styles.tableCell}>CÓDIGO</Text>
                            </View>
                            <View style={styles.tableColHeader}>
                                <Text style={styles.tableCell}>NOMBRE</Text>
                            </View>
                            <View style={styles.tableColHeader}>
                                <Text style={styles.tableCell}>MENSUAL</Text>
                            </View>
                            <View style={styles.tableColHeader}>
                                <Text style={styles.tableCell}>TOTAL</Text>
                            </View>
                        </View>

                        {/* Filas de la tabla */}
                        {page.map((item, index) => (
                            <View
                                key={index}
                                style={[
                                    styles.tableRow,
                                    item.code === 'NET' ? styles.totalRow : {}, // Estilo condicional para la fila NET
                                ]}
                            >
                                <View style={styles.tableColCode}>
                                    <Text style={[styles.tableCell, item.isHeader ? styles.boldText : {}]}>
                                        {item.code}
                                    </Text>
                                </View>
                                <View style={styles.tableCol}>
                                    <Text style={[styles.tableCell, item.isHeader ? styles.boldText : {}]}>
                                        {item.name}
                                    </Text>
                                </View>
                                <View style={styles.tableCol}>
                                    <Text style={[styles.tableCell, item.isHeader ? styles.boldText : {}]}>
                                        {formatCurrency(item.monthly)}
                                    </Text>
                                </View>
                                <View style={styles.tableCol}>
                                    <Text style={[styles.tableCell, item.isHeader ? styles.boldText : {}]}>
                                        {formatCurrency(item.total)}
                                    </Text>
                                </View>
                            </View>
                        ))}
                    </View>

                    {/* Número de página */}
                    <Text style={styles.pageNumber} render={({ pageNumber, totalPages }) => (
                        `Página ${pageNumber} de ${totalPages}`
                    )} fixed />
                </Page>
            ))}
        </Document>
    );
};

export default PerdidasGananciasPDF;