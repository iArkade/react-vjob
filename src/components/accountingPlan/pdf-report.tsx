import React from 'react';
import { Document, Page, Text, View, StyleSheet, Font, BlobProvider } from '@react-pdf/renderer';
import { AccountingPlanResponseType } from '@/api/accounting-plan/account-types';
import { Alert, Box, IconButton, CircularProgress, Tooltip } from '@mui/material';
import { FilePdf } from '@phosphor-icons/react';

// Register custom fonts
Font.register({
    family: 'Roboto',
    fonts: [
        { src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-light-webfont.ttf', fontWeight: 300 },
        { src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-regular-webfont.ttf', fontWeight: 400 },
        { src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-medium-webfont.ttf', fontWeight: 500 },
        { src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-bold-webfont.ttf', fontWeight: 700 },
    ],
});

const styles = StyleSheet.create({
    page: {
        flexDirection: 'column',
        backgroundColor: '#ffffff',
        padding: 30,
        paddingBottom: 50,
        fontFamily: 'Roboto',
    },
    header: {
        marginBottom: 20,
        borderBottom: '1 solid #777777',
        paddingBottom: 10,
    },
    title: {
        fontSize: 24,
        fontWeight: 700,
        color: '#333333',
    },
    subtitle: {
        fontSize: 16,
        color: '#666666',
        marginTop: 5,
    },
    table: {
        width: 'auto',
        borderStyle: 'solid',
        borderWidth: 1,
        borderColor: '#bfbfbf',
        marginBottom: 10,
    },
    tableRow: {
        flexDirection: 'row',
    },
    tableHeader: {
        backgroundColor: '#f0f0f0',
    },
    tableCol: {
        width: '50%',
        borderStyle: 'solid',
        borderWidth: 1,
        borderColor: '#bfbfbf',
    },
    tableCell: {
        padding: 5,
        fontSize: 10,
    },
    pageNumber: {
        position: 'absolute',
        fontSize: 10,
        bottom: 30,
        left: 0,
        right: 0,
        textAlign: 'center',
        color: '#777777',
    },
});

interface PDFReportProps {
    accounts: AccountingPlanResponseType[];
}

const ItemsPerPage = 20; 

const PDFReport: React.FC<PDFReportProps> = ({ accounts }) => {
    const pageCount = Math.ceil(accounts.length / ItemsPerPage);

    return (
        <Document>
            {Array.from({ length: pageCount }, (_, pageIndex) => (
                <Page key={`page_${pageIndex}`} size="A4" style={styles.page}>
                    {pageIndex === 0 && (
                        <View style={styles.header}>
                            <Text style={styles.title}>Plan de Cuentas</Text>
                            <Text style={styles.subtitle}>Reporte Generado el {new Date().toLocaleDateString()}</Text>
                        </View>
                    )}

                    <View style={styles.table}>
                        <View style={[styles.tableRow, styles.tableHeader]}>
                            <View style={styles.tableCol}>
                                <Text style={styles.tableCell}>Código</Text>
                            </View>
                            <View style={styles.tableCol}>
                                <Text style={styles.tableCell}>Nombre</Text>
                            </View>
                        </View>
                        {accounts.slice(pageIndex * ItemsPerPage, (pageIndex + 1) * ItemsPerPage).map((account) => (
                            <View key={account.id} style={styles.tableRow}>
                                <View style={styles.tableCol}>
                                    <Text style={styles.tableCell}>{account.code}</Text>
                                </View>
                                <View style={styles.tableCol}>
                                    <Text style={styles.tableCell}>{account.name}</Text>
                                </View>
                            </View>
                        ))}
                    </View>

                    <Text
                        style={styles.pageNumber}
                        render={({ pageNumber, totalPages }) => `Página ${pageNumber} de ${totalPages}`}
                        fixed
                    />
                </Page>
            ))}
        </Document>
    );
};

interface PDFReportGeneratorProps {
    accounts: AccountingPlanResponseType[];
}

const PDFReportGenerator: React.FC<PDFReportGeneratorProps> = React.memo(({ accounts }) => {
    return (
        <BlobProvider document={<PDFReport accounts={accounts} />}>
            {({ url, loading, error }) => (
                <Box display="flex" alignItems="center" flexDirection="column">
                    {loading && (
                        <CircularProgress size={24} style={{ marginBottom: '10px' }} />
                    )}
                    {error && (
                        <Alert severity="error" style={{ marginBottom: '10px' }}>
                            Error al generar el PDF
                        </Alert>
                    )}
                    {url && (
                        <Box
                            display="flex"
                            justifyContent="flex-start"
                            width="100%"
                            paddingLeft={2}
                        >
                            <IconButton
                                color="primary"
                                href={url}
                                download="plan_de_cuentas.pdf"
                            >
                                <Tooltip title="Descargar" arrow>
                                    {/* <PictureAsPdfIcon /> */}
                                    <FilePdf size={40} />
                                </Tooltip>
                                
                            </IconButton>
                        </Box>
                    )}
                </Box>
            )}
        </BlobProvider>
    );
});

export default PDFReportGenerator;

