
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
        if (!isNaN(Number(cellValue)) && cellValue.trim() !== "") {
          excelCell.value = Number(cellValue);
        } else {
          excelCell.value = cellValue;
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