import React, { useState } from "react";
import { TResume } from "@redundant/common/src";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
  Image,
  PDFViewer,
} from "@react-pdf/renderer";

// Register custom fonts if needed
Font.register({
  family: "Roboto",
  src: "https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-light-webfont.ttf",
});

const styles = StyleSheet.create({
  page: {
    flexDirection: "row",
    backgroundColor: "white",
    fontFamily: "Roboto",
  },
  leftSection: {
    width: "66%",
    padding: 30,
  },
  rightSection: {
    width: "34%",
    backgroundColor: "#1f2937",
    color: "white",
    padding: 30,
  },
  header: {
    flexDirection: "row",
    marginBottom: 20,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 20,
  },
  name: {
    fontSize: 24,
    fontWeight: "bold",
  },
  position: {
    fontSize: 16,
    color: "#4b5563",
    marginTop: 5,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    marginTop: 20,
  },
  jobTitle: {
    fontSize: 14,
    fontWeight: "bold",
  },
  jobDetails: {
    fontSize: 12,
    color: "#4b5563",
    marginBottom: 5,
  },
  bulletPoint: {
    fontSize: 12,
    marginBottom: 2,
  },
  rightSectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
    marginTop: 20,
  },
  rightSectionText: {
    fontSize: 12,
    marginBottom: 5,
  },
  separator: {
    borderBottom: "1 solid #4b5563",
    marginVertical: 15,
  },
});

interface ResumePDFRendererProps {
  resume: TResume;
  onRenderSuccess: () => void;
}

const ResumePDFRenderer: React.FC<ResumePDFRendererProps> = React.memo(
  ({ resume, onRenderSuccess }) => {
    return (
      <Document onRender={onRenderSuccess}>
        <Page size="A4" style={styles.page}>
          <View style={styles.leftSection}>
            <View style={styles.header}>
              <View>
                <Text style={styles.name}>{resume.fullName}</Text>
                <Text style={styles.position}>{resume.positionName}</Text>
              </View>
            </View>

            <Text style={styles.sectionTitle}>Profile</Text>
            {/* Add profile content here */}

            <Text style={styles.sectionTitle}>Employment History</Text>
            {resume.experience?.map((job, index) => (
              <View key={index} style={{ marginBottom: 10 }}>
                <Text style={styles.jobTitle}>
                  {job.positionTitle}, {job.company}
                </Text>
                <Text style={styles.jobDetails}>
                  {job.startDate} — {job.endDate || "PRESENT"}
                </Text>
                {job.contributions?.map((contribution, i) => (
                  <Text key={i} style={styles.bulletPoint}>
                    • {contribution}
                  </Text>
                ))}
              </View>
            ))}

            <Text style={styles.sectionTitle}>Education</Text>
            {resume.education?.map((edu, index) => (
              <View key={index} style={{ marginBottom: 5 }}>
                <Text style={styles.jobTitle}>{edu.degree}</Text>
                <Text style={styles.jobDetails}>
                  {edu.university}, {edu.startDate} - {edu.endDate}
                </Text>
              </View>
            ))}
          </View>

          <View style={styles.rightSection}>
            <Text style={styles.rightSectionTitle}>Details</Text>
            <Text style={styles.rightSectionText}>
              {resume.city}, {resume.country}
            </Text>
            <Text style={styles.rightSectionText}>{resume.phoneNumber}</Text>
            <Text style={styles.rightSectionText}>{resume.email}</Text>

            <View style={styles.separator} />

            <View style={styles.separator} />

            <Text style={styles.rightSectionTitle}>Skills</Text>
            {resume.skills?.map((skill, index) => (
              <Text key={index} style={styles.rightSectionText}>
                {skill}
              </Text>
            ))}
          </View>
        </Page>
      </Document>
    );
  }
);

export default ResumePDFRenderer;
