// src/pdfTemplates/StudentReportDocument.jsx
import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
} from "@react-pdf/renderer";

// ✅ You don’t actually need to register Helvetica manually — it's already included in React-PDF.
// You can safely remove this block (the font URL you used is invalid anyway).

// ✅ Styles
const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontFamily: "Helvetica",
    fontSize: 12,
    lineHeight: 1.5,
  },
  title: {
    fontSize: 20,
    textAlign: "center",
    marginBottom: 10,
    fontWeight: "bold",
  },
  subtitle: {
    fontSize: 14,
    marginTop: 10,
    marginBottom: 4,
    fontWeight: "bold",
  },
  section: {
    marginBottom: 10,
  },
  listItem: {
    marginLeft: 12,
  },
  divider: {
    borderBottomWidth: 1,
    borderBottomColor: "#999",
    marginVertical: 10,
  },
});

// ✅ Main Component
export default function StudentReportDocument({ report }) {
  if (!report) {
    return (
      <Document>
        <Page style={styles.page}>
          <Text>No report data available.</Text>
        </Page>
      </Document>
    );
  }

  const {
    subject = {},
    analysis = "No analysis provided.",
    passedStudents = [],
    failedStudents = [],
    classStatistics = {},
    recommendations = [],
  } = report;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <Text style={styles.title}>Student Performance Report</Text>
        <Text>
          <Text style={{ fontWeight: "bold" }}>Subject:</Text>{" "}
          {subject.code || "N/A"} - {subject.name || "N/A"}
        </Text>
        <Text>
          <Text style={{ fontWeight: "bold" }}>Instructor:</Text>{" "}
          {subject.instructor || "N/A"}
        </Text>

        <View style={styles.divider} />

        {/* AI Analysis */}
        <View style={styles.section}>
          <Text style={styles.subtitle}>AI Analysis Summary:</Text>
          <Text>{analysis}</Text>
        </View>

        {/* Statistics */}
        <View style={styles.section}>
          <Text style={styles.subtitle}>Class Statistics:</Text>
          <Text>Average: {classStatistics.classAverage || "N/A"}</Text>
          <Text>Highest Score: {classStatistics.highestScore || "N/A"}</Text>
          <Text>Lowest Score: {classStatistics.lowestScore || "N/A"}</Text>
          <Text>Pass Rate: {classStatistics.passRate || "N/A"}</Text>
        </View>

        {/* Passed Students */}
        <View style={styles.section}>
          <Text style={styles.subtitle}>✅ Passed Students:</Text>
          {passedStudents.length > 0 ? (
            passedStudents.map((name, i) => (
              <Text key={i} style={styles.listItem}>
                - {name}
              </Text>
            ))
          ) : (
            <Text style={styles.listItem}>No students passed.</Text>
          )}
        </View>

        {/* Failed Students */}
        <View style={styles.section}>
          <Text style={styles.subtitle}>Failed Students:</Text>
          {failedStudents.length > 0 ? (
            failedStudents.map((name, i) => (
              <Text key={i} style={styles.listItem}>
                - {name}
              </Text>
            ))
          ) : (
            <Text style={styles.listItem}>No students failed.</Text>
          )}
        </View>

        {/* Recommendations */}
        {recommendations.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.subtitle}>Recommendations:</Text>
            {recommendations.map((rec, i) => (
              <Text key={i} style={styles.listItem}>
                - {rec}
              </Text>
            ))}
          </View>
        )}
      </Page>
    </Document>
  );
}
