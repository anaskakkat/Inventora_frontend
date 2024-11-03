// reportUtils.ts
import { jsPDF } from "jspdf";
import "jspdf-autotable"; // This needs to be imported separately
import * as XLSX from "xlsx";
import emailjs from "@emailjs/browser";
import { EmailTemplateParams, ReportData } from "@/utils/type";
import toast from "react-hot-toast";

// Print functionality
export const handlePrint = (): void => {
  const printContents = document.getElementById("printable-table")?.innerHTML;
  if (printContents) {
    const originalContents = document.body.innerHTML;

    document.body.innerHTML = printContents;

    window.print();

    document.body.innerHTML = originalContents;
    window.location.reload();
  } else {
    console.error("Table content not found.");
  }
};

// Excel export functionality
export const exportToExcel = (data: ReportData, reportType: string): void => {
  const ws = XLSX.utils.aoa_to_sheet([data.headers, ...data.rows]);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(
    wb,
    ws,
    reportType === "sales" ? "Sales Report" : "Items Report"
  );
  XLSX.writeFile(wb, `${reportType}_report.xlsx`);
};

// PDF export functionality
export const exportToPDF = (data: ReportData, reportType: string): void => {
  try {
    // Create new document with 'pt' units and 'a4' format
    const doc = new jsPDF({
      orientation: "portrait",
      unit: "pt",
      format: "a4",
    });

    // Add title
    const title = reportType === "sales" ? "Sales Report" : "Items Report";
    doc.setFontSize(16);
    doc.text(title, 40, 40);

    // Create the table
    (doc as any).autoTable({
      head: [data.headers],
      body: data.rows,
      startY: 60,
      margin: { top: 40, right: 40, bottom: 40, left: 40 },
      styles: {
        fontSize: 10,
        cellPadding: 5,
        overflow: "linebreak",
        cellWidth: "auto",
      },
      headStyles: {
        fillColor: [66, 139, 202],
        textColor: 255,
        fontSize: 10,
        fontStyle: "bold",
      },
      alternateRowStyles: {
        fillColor: [245, 245, 245],
      },
    });

    // Save the PDF
    doc.save(`${reportType}_report.pdf`);
  } catch (error) {
    console.error("PDF generation failed:", error);
    throw error;
  }
};

// Create PDF document for email
export const createPDFDocument = (data: ReportData): string => {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "pt",
    format: "a4",
  });

  (doc as any).autoTable({
    head: [data.headers],
    body: data.rows,
    startY: 20,
    margin: { top: 40, right: 40, bottom: 40, left: 40 },
    styles: {
      fontSize: 10,
      cellPadding: 5,
    },
    headStyles: {
      fillColor: [66, 139, 202],
      textColor: 255,
    },
  });

  return doc.output("datauristring");
};

// Create Excel document
export const createExcelDocument = (data: ReportData): string => {
  const ws = XLSX.utils.aoa_to_sheet([data.headers, ...data.rows]);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Report");
  return XLSX.write(wb, { bookType: "xlsx", type: "base64" });
};

// Email functionality
export const sendEmail = async (
  fileType: "pdf" | "excel",
  data: ReportData,
  reportType: string,
  Email: string
): Promise<void> => {
  try {
    let attachmentData: string;
    let attachmentName: string;

    if (fileType === "pdf") {
      attachmentData = createPDFDocument(data);
      attachmentName = `${reportType}_report.pdf`;
    } else {
      attachmentData = createExcelDocument(data);
      attachmentName = `${reportType}_report.xlsx`;
    }

    const templateParams: EmailTemplateParams = {
      to_email: Email,
      subject: `${
        reportType.charAt(0).toUpperCase() + reportType.slice(1)
      } Report`,
      message: `Please find attached the ${reportType} report.`,
      attachment: attachmentData,
      attachment_name: attachmentName,
    };

    await emailjs.send(
      "service_1v40vp6",
      "template_44sndzz",
      templateParams as Record<string, unknown>,
      "j1fNFxhbcJj2_JdQL"
    );

    toast.success("Report sent successfully!");
  } catch (error) {
    console.error("Failed to send email:", error);
    toast.error("Failed to send email. Please try again.");
    throw error;
  }
};
