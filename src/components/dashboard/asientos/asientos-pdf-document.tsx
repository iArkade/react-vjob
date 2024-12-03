"use client";

import * as React from "react";
import {
  Document,
  Image,
  Page,
  StyleSheet,
  Text,
  View,
} from "@react-pdf/renderer";

import { Asiento } from "@/api/asientos/asientos-types";

const styles = StyleSheet.create({
  // Utils
  fontMedium: { fontWeight: 500 },
  fontSemibold: { fontWeight: 600 },
  fontBold: { fontWeight: 850 },
  textLg: { fontSize: 10, lineHeight: 1.5 },
  textXl: { fontSize: 18, lineHeight: 1.6 },
  textRight: { textAlign: "right" },
  textCenter: { textAlign: "center" },
  uppercase: { textTransform: "uppercase" },
  gutterBottom: { marginBottom: 4 },
  flexGrow: { flexGrow: 1 },
  flexRow: { flexDirection: "row" },
  flexColumn: { flexDirection: "column" },
  w50: { width: "50%" },
  maxTextWidth: { flexWrap: "wrap", maxWidth: "100%" },
  // Components
  page: {
    backgroundColor: "#FFFFFF",
    gap: 32,
    padding: 24,
    fontSize: 10,
    fontWeight: 400,
    lineHeight: 1.43,
  },
  header: { flexDirection: "row", justifyContent: "space-between" },
  brand: { height: 40, width: 40 },
  refs: { gap: 8 },
  refRow: { flexDirection: "row" },
  refDescription: { fontWeight: 500, width: 100 },
  items: {
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: "#EEEEEE",
    borderRadius: 4,
    marginTop: 8,
  },
  itemRow: {
    borderBottomWidth: 1,
    borderBottomStyle: "solid",
    borderBottomColor: "#EEEEEE",
    flexDirection: "row",
  },
  itemCentro: { padding: 6, width: "15%", textAlign: "center" },
  itemCta: { padding: 6, width: "15%", textAlign: "center" },
  itemCtaNombre: { padding: 6, width: "20%" },
  itemDebe: { padding: 6, width: "10%", textAlign: "right" },
  itemHaber: { padding: 6, width: "10%", textAlign: "right" },
  itemNota: { padding: 6, width: "30%" },
  summaryRow: { flexDirection: "row", marginTop: 8 },
  summaryGap: { padding: 6, width: "70%" },
  summaryTitle: { padding: 6, width: "15%" },
  summaryValue: { padding: 6, width: "15%", textAlign: "right" },
});

type AsientoProps = {
  asiento: Asiento | undefined;
};

export function AsientoPDFDocument({
  asiento,
}: AsientoProps): React.JSX.Element {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.flexGrow}>
            <Text style={[styles.textXl, styles.fontSemibold]}>
              Asiento Diario Contable
            </Text>
          </View>
          <View>
            <Image
              source="/assets/logo-emblem--dark.png"
              style={styles.brand}
            />
          </View>
        </View>

        {/* Información principal */}
        <View style={styles.refs}>
          <View style={styles.refRow}>
            <Text style={styles.refDescription}>Numero:</Text>
            <Text>{asiento?.nro_asiento}</Text>
          </View>
          <View style={styles.refRow}>
            <Text style={styles.refDescription}>Estado</Text>
            <Text>{asiento?.estado}</Text>
          </View>
          <View style={styles.refRow}>
            <Text style={styles.refDescription}>Fecha Tr:</Text>
            <Text>{asiento?.fecha_emision}</Text>
          </View>
          <View style={styles.refRow}>
            <Text style={styles.refDescription}>Nro Ref:</Text>
            <Text>{asiento?.nro_referencia}</Text>
          </View>
        </View>

        {/* Comentario y Transacción */}
        <View style={[styles.flexRow, { gap: 16 }]}>
          <View style={[styles.w50, styles.maxTextWidth]}>
            <Text style={[styles.fontBold, styles.gutterBottom]}>
              Comentario
            </Text>
            <Text>{asiento?.comentario}</Text>
          </View>
          <View style={styles.w50}>
            <Text style={[styles.fontBold, styles.gutterBottom]}>
              Transacción
            </Text>
            <Text>{asiento?.codigo_transaccion}</Text>

            <Text style={[styles.gutterBottom, styles.fontBold]}>Centro</Text>
            <Text>{asiento?.codigo_centro}</Text>
          </View>
        </View>

        {/* Tabla */}
        <View>
          <View style={styles.items}>
            {/* Encabezados de la tabla */}
            <View style={styles.itemRow}>
              <View style={styles.itemCentro}>
                <Text style={[styles.fontSemibold, styles.textCenter]}>
                  Centro
                </Text>
              </View>
              <View style={styles.itemCta}>
                <Text style={[styles.fontSemibold, styles.textCenter]}>
                  Cta
                </Text>
              </View>
              <View style={styles.itemCtaNombre}>
                <Text style={styles.fontSemibold}>Cta. Nombre</Text>
              </View>
              <View style={styles.itemDebe}>
                <Text style={styles.fontSemibold}>Debe</Text>
              </View>
              <View style={styles.itemHaber}>
                <Text style={styles.fontSemibold}>Haber</Text>
              </View>
              <View style={styles.itemNota}>
                <Text style={styles.fontSemibold}>Nota</Text>
              </View>
            </View>
            {/* Filas de datos */}
            {asiento?.lineItems.map((lineItem, index) => (
              <View key={lineItem.id || index} style={styles.itemRow}>
                <View style={styles.itemCentro}>
                  <Text>{lineItem.codigo_centro}</Text>
                </View>
                <View style={styles.itemCta}>
                  <Text>{lineItem.cta}</Text>
                </View>
                <View style={styles.itemCtaNombre}>
                  <Text>{lineItem.cta_nombre}</Text>
                </View>
                <View style={styles.itemDebe}>
                  <Text>{lineItem.debe}</Text>
                </View>
                <View style={styles.itemHaber}>
                  <Text>{lineItem.haber}</Text>
                </View>
                <View style={styles.itemNota}>
                  <Text>{lineItem.nota}</Text>
                </View>
              </View>
            ))}
          </View>

          {/* Totales */}
          <View>
            <View style={styles.summaryRow}>
              <View style={styles.summaryGap} />
              <View style={styles.summaryTitle}>
                <Text>Total Debe</Text>
              </View>
              <View style={styles.summaryValue}>
                <Text>{asiento?.total_debe}</Text>
              </View>
            </View>
            <View style={styles.summaryRow}>
              <View style={styles.summaryGap} />
              <View style={styles.summaryTitle}>
                <Text>Total Haber</Text>
              </View>
              <View style={styles.summaryValue}>
                <Text>{asiento?.total_haber}</Text>
              </View>
            </View>
            <View style={styles.summaryRow}>
              <View style={styles.summaryGap} />
              <View style={styles.summaryTitle}>
                <Text>Total</Text>
              </View>
              <View style={styles.summaryValue}>
                <Text>
                  {(
                    (asiento?.total_debe || 0) - (asiento?.total_haber || 0)
                  ).toFixed(2)}
                </Text>
              </View>
            </View>
          </View>
        </View>
      </Page>
    </Document>
  );
}
