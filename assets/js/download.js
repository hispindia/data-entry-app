
function downloadTablesAsExcel(sheetList, fileName) {
  const tables = document.querySelectorAll("table"); // Select all tables
  const workbook = new ExcelJS.Workbook(); // Create a new workbook

  tables.forEach((table, index) => {
    const sheet = workbook.addWorksheet(`${sheetList[index]}`); // Create a sheet for each table
    const rows = table.querySelectorAll("tr");
    const mergeMap = new Map(); // Map to track merged cells by [row, col]

    rows.forEach((row, rowIndex) => {
      const cells = row.querySelectorAll("td, th");
      let colIndex = 1; // Column index starts at 1 for ExcelJS
      cells.forEach((cell) => {
        // Skip merged cells
        while (mergeMap.has(`${rowIndex + 1},${colIndex}`)) {
          colIndex++;
        }
      
        const cellValue = cell.textContent.trim(); // Get the text content
        const excelCell = sheet.getCell(rowIndex + 1, colIndex);
      
        // Set the value as a number if it is numeric, otherwise as a string
        const rawText = cell.textContent.trim();
        const numericValue = Number(rawText.replace(/,/g, ""));

        if (!isNaN(numericValue) && rawText !== "") {
          excelCell.value = numericValue;
          // Format as number with commas (e.g., 1,000)
          excelCell.numFmt = "#,##0"; // or "#,##0.00" for 2 decimal places
        } else {
          excelCell.value = rawText;
        }

        // Apply inline styles
        const computedStyle = window.getComputedStyle(cell);
        excelCell.font = {
          bold: computedStyle.fontWeight === "bold" || computedStyle.fontWeight === "700",
          color: { argb: rgbToHex(computedStyle.color) },
          size: parseInt(computedStyle.fontSize) || 12,
        };
        excelCell.alignment = {
          horizontal: computedStyle.textAlign || "left",
          vertical: "middle",
        };
        if (computedStyle.backgroundColor !== "rgba(0, 0, 0, 0)") {
          excelCell.fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: rgbToHex(computedStyle.backgroundColor) },
          };
        }
      
        // Handle colspan and rowspan
        const colspan = parseInt(cell.getAttribute("colspan")) || 1;
        const rowspan = parseInt(cell.getAttribute("rowspan")) || 1;
      
        if (colspan > 1 || rowspan > 1) {
          const startCell = sheet.getCell(rowIndex + 1, colIndex);
          const endCell = sheet.getCell(rowIndex + rowspan, colIndex + colspan - 1);
          sheet.mergeCells(startCell.address, endCell.address);
      
          // Mark merged cells in mergeMap
          for (let r = rowIndex + 1; r < rowIndex + 1 + rowspan; r++) {
            for (let c = colIndex; c < colIndex + colspan; c++) {
              mergeMap.set(`${r},${c}`, true);
            }
          }
        }
      
        colIndex += colspan; // Move to the next cell considering colspan
      });
    });

    // Auto-width for columns
    sheet.columns.forEach((column, index) => {
      const maxLength = column.values
        .filter((v) => v)
        .map((v) => v.toString().length);
    
      column.width = maxLength.length > 0 ? Math.max(...maxLength) + 2 : 10;
    
      console.log(`Column ${index + 1} width: ${column.width}`); // Debugging
    });
  });

  // Save the Excel file
  workbook.xlsx.writeBuffer().then((buffer) => {
    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `${fileName}.xlsx`;
    link.click();
  });
}

// Utility to convert RGB color to Hex
function rgbToHex(rgb) {
  const match = rgb.match(/\d+/g);
  if (!match) return "FFFFFFFF"; // Default to white
  return (
    "FF" +
    ((1 << 24) + (parseInt(match[0]) << 16) + (parseInt(match[1]) << 8) + parseInt(match[2]))
      .toString(16)
      .slice(1)
      .toUpperCase()
  );
}


// async function downloadTablesAsPDF() {
  
//   const orgUnit = document.getElementById('headerOrgName')?.value;
//   const year = document.getElementById('year-update')?.value;
//   const periodicity = document.getElementById('reporting-periodicity')?.value;

//     const { jsPDF } = window.jspdf;
//     const doc = new jsPDF('p', 'mm', 'a4'); // Set orientation to 'landscape'
    
//     const tables = document.querySelectorAll('table'); // Get all tables
    
// for (let i = 0; i < tables.length; i++) {
//   const canvas = await html2canvas(tables[i]);
//   const imgData = canvas.toDataURL('image/png');

//   if (i > 0) {
//     doc.addPage(); // Add a new page for each table after the first one
//   }

//   // Get the dimensions of the page
//   const pageWidth = doc.internal.pageSize.getWidth();
//   const pageHeight = doc.internal.pageSize.getHeight();

//   // Calculate the image dimensions to fit the page while maintaining aspect ratio
//   let imgWidth = pageWidth - 20;  // Set width to fit the page, considering some margins
//   let imgHeight = (canvas.height * imgWidth) / canvas.width;  // Maintain the aspect ratio

//   // If the image height exceeds the page height, scale it down
//   if (imgHeight > pageHeight - 20) {
//     const scaleFactor = (pageHeight - 20) / imgHeight;
//     imgWidth *= scaleFactor;
//     imgHeight = pageHeight - 20;
//   }

//   doc.addImage(imgData, 'PNG', 10, 10, imgWidth, imgHeight);  // Add image to the PDF
// }

//     doc.save(`${orgUnit}-${year}-${periodicity ? periodicity: ''}.pdf`);
    
// }

async function downloadTablesAsPDF() {
  const orgUnit = document.getElementById('headerOrgName')?.value || 'Report';
  const year = document.getElementById('year-update')?.value || '';
  const periodicity = document.getElementById('reporting-periodicity')?.value || '';

  const { jsPDF } = window.jspdf;
  const doc = new jsPDF('p', 'mm', 'a4'); // Portrait A4

  const tables = document.querySelectorAll('table');

  let y = 20;

  for (let i = 0; i < tables.length; i++) {
    const table = tables[i];
    const tableId = table.id || `Table ${i + 1}`;
    const title = table.querySelector('th[colspan]') 
      ? table.querySelector('th[colspan]').innerText.trim()
      : tableId;

    if (i > 0) {
      doc.addPage();
      y = 20;
    }

    // Add table title
    doc.setFontSize(12);
    doc.text(title, 14, y);
    y += 5;

    // Use AutoTable to convert HTML table to structured PDF table
    await doc.autoTable({
      html: `#${tableId}`,
      startY: y + 5,
      theme: 'grid',
      styles: {
        fontSize: 8,
        cellPadding: 2,
        overflow: 'linebreak',
      },
      headStyles: { fillColor: [240, 240, 240], textColor: 20, halign: 'center' },
      columnStyles: { 0: { cellWidth: 'auto' } },
      didDrawPage: (data) => {
        // Footer on every page
        const pageCount = doc.internal.getNumberOfPages();
        doc.setFontSize(8);
        doc.text(`Page ${pageCount}`, doc.internal.pageSize.getWidth() - 30, doc.internal.pageSize.getHeight() - 10);
      },
    });

    y = doc.lastAutoTable.finalY + 10;
  }

  const filename = `${orgUnit}-${year}-${periodicity ? periodicity : ''}.pdf`;
  doc.save(filename);
}
