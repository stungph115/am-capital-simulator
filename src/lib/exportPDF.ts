import jsPDF from "jspdf";
import html2canvas from "html2canvas";

export const exportPDF = async (elementId: string, logoSrc?: string) => {
  const input = document.getElementById(elementId);
  if (!input) return;

  const canvas = await html2canvas(input);
  const imgData = canvas.toDataURL("image/png");

  const pdf = new jsPDF("p", "mm", "a4");
  pdf.addImage(imgData, "PNG", 10, 20, 190, 0);

  if (logoSrc) {
    pdf.addImage(logoSrc, "PNG", 10, 10, 50, 15);
  }

  pdf.save("simulation.pdf");
};
