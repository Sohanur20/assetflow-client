import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: { padding: 40, fontSize: 11, color: '#1e293b', fontFamily: 'Helvetica' },
  header: { borderBottom: '2px solid #0f766e', paddingBottom: 12, marginBottom: 20 },
  company: { fontSize: 20, fontWeight: 'bold', color: '#0f766e' },
  powered: { fontSize: 9, color: '#64748b', marginTop: 2 },
  title: { fontSize: 14, fontWeight: 'bold', marginBottom: 14 },
  row: { flexDirection: 'row', marginBottom: 8 },
  label: { width: 130, fontWeight: 'bold', color: '#475569' },
  value: { flex: 1 },
  footer: { position: 'absolute', bottom: 40, left: 40, right: 40, borderTop: '1px solid #e2e8f0', paddingTop: 8, fontSize: 9, color: '#64748b' },
});

// Printable hand-over document: company info on top, printing date at bottom.
const AssetPdf = ({ request, dbUser }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.header}>
        <Text style={styles.company}>{request.companyName || dbUser?.companyName || 'Your Company'}</Text>
        <Text style={styles.powered}>Asset record generated with AssetFlow by XYZ</Text>
      </View>

      <Text style={styles.title}>Approved Asset Details</Text>

      <View style={styles.row}><Text style={styles.label}>Asset Name</Text><Text style={styles.value}>{request.assetName}</Text></View>
      <View style={styles.row}><Text style={styles.label}>Asset Type</Text><Text style={styles.value}>{request.assetType}</Text></View>
      <View style={styles.row}><Text style={styles.label}>Requested By</Text><Text style={styles.value}>{request.requesterName}</Text></View>
      <View style={styles.row}><Text style={styles.label}>Requester Email</Text><Text style={styles.value}>{request.requesterEmail}</Text></View>
      <View style={styles.row}><Text style={styles.label}>Request Date</Text><Text style={styles.value}>{new Date(request.requestDate).toLocaleDateString()}</Text></View>
      <View style={styles.row}><Text style={styles.label}>Approval Date</Text><Text style={styles.value}>{request.approvalDate ? new Date(request.approvalDate).toLocaleDateString() : '—'}</Text></View>
      <View style={styles.row}><Text style={styles.label}>Status</Text><Text style={styles.value}>{request.status}</Text></View>
      {request.additionalNote ? (
        <View style={styles.row}><Text style={styles.label}>Additional Note</Text><Text style={styles.value}>{request.additionalNote}</Text></View>
      ) : null}

      <View style={styles.footer}>
        <Text>Printing date: {new Date().toLocaleDateString()} · AssetFlow — Asset Management by XYZ</Text>
      </View>
    </Page>
  </Document>
);

export default AssetPdf;
