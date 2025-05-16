// ExportButtons.jsx
import { jsPDF } from "jspdf"; // ← named import, NOT default
import "jspdf-autotable"; // ← must come AFTER the line above
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { FaFilePdf, FaFileExcel } from "react-icons/fa";

export const ExportButtons = ({
  tableData,
  filename = "Exported Data",
  orientation = "landscape",
}) => {
  const columns = tableData.length ? Object.keys(tableData[0]) : [];

  const downloadExcel = () => {
    const ws = XLSX.utils.json_to_sheet(tableData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
    const buf = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const data = new Blob([buf], { type: "application/octet-stream" });
    saveAs(data, `${filename}.xlsx`);
  };

  const downloadPDF = () => {
    const doc = new jsPDF({
      orientation: `${orientation}`,
    });
    doc.text(`${filename} Report`, 14, 10);
    doc.autoTable({
      head: [columns],
      body: tableData.map((r) => columns.map((c) => r[c])),
      margin: { top: 18 },
    });
    doc.save(`${filename}.pdf`);
  };

  return (
    <div className="flex gap-2 mt-3">
      <button onClick={downloadExcel}>
        <FaFileExcel className="text-xl" />
      </button>
      <button onClick={downloadPDF}>
        <FaFilePdf className="text-xl" />
      </button>
    </div>
  );
};
