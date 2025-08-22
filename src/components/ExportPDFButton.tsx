"use client";

import { jsPDF } from "jspdf";
import html2canvas from "html2canvas-pro";

export default function ExportPDFButton() {
  const handleExport = async () => {
    const element = document.getElementById("to-print");
    if (!element) return alert("Element not found");

    const canvas = await html2canvas(element, { scale: 2 });

    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF("p", "mm", "a4");

    // Logo AM Capital
    const logo = "/Logo_AM-Capital-02.png";
    pdf.addImage(logo, "SVG", 10, 0, 25, 25);

    // Add title
    pdf.setFontSize(18);
    pdf.setFont("helvetica", "bold");
    pdf.text("Résultats de la simulation", 40, 20);

    // Add canvas
    pdf.addImage(imgData, "PNG", 10, 25, 190, 0);
    pdf.save("Simulation-AM.pdf");
  };

  return (
    <button
      onClick={handleExport}
      className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition cursor-pointer"
    >
      📝 <span>Export PDF</span>
    </button>
  );
}
