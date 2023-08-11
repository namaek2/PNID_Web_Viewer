import canvas from "./fabric.js";

const loadedFiles = [];
const loadedObjects = [];

document.addEventListener("DOMContentLoaded", function () {
  const xmlFileInput = document.getElementById("xmlFileInput");
  const loadButton = document.getElementById("openXmlButton");
  const xmlTable = document.getElementById("xmlTable");
  const fileTable = document.getElementById("fileTable");
  let contextMenu = null;

  loadButton.addEventListener("click", () => xmlFileInput.click());

  xmlFileInput.addEventListener("change", (e) => loadFileToTable(e.target));

  function loadFileToTable(input) {
    const file = input.files[0];
    var fileExtension = file.name.split(".").pop().toLowerCase();

    if (file && fileExtension === "xml") {
      const reader = new FileReader();
      reader.onload = (e) => handleFileLoad(e, file.name); // 파일 이름을 전달

      reader.readAsText(file);
    } else {
      alert("지원되지 않는 파일 형식입니다.");
    }
  }
  function handleFileLoad(e, fileName) {
    if (loadedFiles.includes(fileName)) {
      alert("이미 로드된 파일입니다.");
      return;
    }

    const xmlText = e.target.result;
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlText, "text/xml");
    const symbolObjects = xmlDoc.getElementsByTagName("symbol_object");

    loadedObjects.push(...symbolObjects);

    addTable(fileName, symbolObjects);

    const filetBody = fileTable.querySelector("tbody");
    const row = document.createElement("tr");
    row.innerHTML = `
        <td>${"null"}</td>
        <td>${fileName}</td>
      `;
    filetBody.appendChild(row);
    loadedFiles.push(fileName);
  }

  function addTable(fileName, symbolObjects) {
    const tableBody = xmlTable.querySelector("tbody");
    Array.from(symbolObjects).forEach((symbolObject, i) => {
      const getValue = (tagName) =>
        symbolObject.querySelector(tagName).textContent;
      const row = document.createElement("tr");
      row.innerHTML = ` 
        <td>${"null"}</td>
        <td>${fileName}</td>
        <td>${getValue("type")}</td>
        <td>${getValue("class")}</td>
        <td>${getValue("xmin")}</td>
        <td>${getValue("ymin")}</td>
        <td>${getValue("xmax")}</td>
        <td>${getValue("ymax")}</td>
        <td>${getValue("degree")}</td>
      `;
      tableBody.appendChild(row);
    });
  }

  function addxmlTRowNumbers() {
    const rows = xmlTable.querySelectorAll("tbody tr");
    rows.forEach((row, index) => {
      const numberCell = row.querySelector("td:first-child");
      numberCell.textContent = index;
    });
  }
  function addfileTRowNumbers() {
    const rows = fileTable.querySelectorAll("tbody tr");
    rows.forEach((row, index) => {
      const numberCell = row.querySelector("td:first-child");
      numberCell.textContent = index;
    });
  }

  /*
  function removeAllRectangles() {
    const rectangles = canvas
      .getObjects()
      .filter((obj) => obj instanceof fabric.Rect);
    canvas.remove(...rectangles);
  }*/

  xmlTable.addEventListener("DOMSubtreeModified", () => {
    addxmlTRowNumbers();

    /*
    removeAllRectangles;
    const rows = xmlTable.querySelectorAll("tbody tr");
    rows.forEach((row) => {
      const cells = row.querySelectorAll("td");
      const type = cells[2].textContent;
      const className = cells[3].textContent;
      const left = cells[4].textContent;
      const top = cells[5].textContent;
      const width =
        parseInt(cells[6].textContent) - parseInt(cells[4].textContent);
      const height =
        parseInt(cells[7].textContent) - parseInt(cells[5].textContent);
      const angle = cells[8].textContent;

      if (type === "rect") {
        const rect = new fabric.Rect({
          id: className,
          left: parseInt(left),
          top: parseInt(top),
          width: parseInt(width),
          height: parseInt(height),
          angle: parseInt(angle),
          fill: "transparent",
          stroke: "red",
          strokeWidth: 3,
        });
        canvas.add(rect);
      }
    });
    */
  });

  fileTable.addEventListener("DOMSubtreeModified", () => {
    addfileTRowNumbers();
  });
  //파일 테이블 우클릭시 상호작용
  fileTable.addEventListener("contextmenu", (event) => {
    event.preventDefault(); // 기본 컨텍스트 메뉴 표시 방지

    if (contextMenu) {
      contextMenu.remove();
    }

    contextMenu = document.createElement("div");
    contextMenu.className = "context-menu";
    contextMenu.innerHTML = `
      <ul style={{color : "gray"}}>
        <li>View File</li>
        <li>UnView File</li>
        <li>Delete File</li>
      </ul>
    `;

    contextMenu.style.position = "absolute";
    contextMenu.style.left = `${event.clientX}px`;
    contextMenu.style.top = `${event.clientY}px`;

    document.body.appendChild(contextMenu);

    contextMenu.addEventListener("click", (e) => {
      if (e.target.textContent === "Delete File") {
        const row = event.target.closest("tr");
        if (row) {
          removeRowsWithValue(row.cells[1].textContent);
          loadedObjects.splice(row.cells[0].textContent, 1);
          loadedFiles.splice(row.cells[0].textContent, 1);
          row.remove();
        }
      } else if (e.target.textContent === "UnView File") {
        const row = event.target.closest("tr");
        if (row) {
          removeRowsWithValue(row.cells[1].textContent);
        }
      } else if (e.target.textContent === "View File") {
        /*
        const row = event.target.closest("tr");
        if (row) {
          addTable(
            row.cells[1].textContent,
            loadedObjects[row.cells[0].textContent]
          );
        }*/
      }
      contextMenu.remove();
    });

    // 컨텍스트 메뉴가 사라질 때 이벤트 처리
    window.addEventListener("click", () => {
      contextMenu.remove();
    });
  });

  //xml테이블 우클릭시 상호작용
  xmlTable.addEventListener("contextmenu", (event) => {
    event.preventDefault(); // 기본 컨텍스트 메뉴 표시 방지

    if (contextMenu) {
      contextMenu.remove();
    }

    contextMenu = document.createElement("div");
    contextMenu.className = "context-menu";
    contextMenu.innerHTML = `
      <ul style={{color : "gray"}}>
        <li>Delete Row</li>
        <li>Edit Row</li>
      </ul>
    `;

    contextMenu.style.position = "absolute";
    contextMenu.style.left = `${event.clientX}px`;
    contextMenu.style.top = `${event.clientY}px`;

    document.body.appendChild(contextMenu);

    contextMenu.addEventListener("click", (e) => {
      if (e.target.textContent === "Delete Row") {
        const row = event.target.closest("tr");
        if (row) {
          row.remove();
        }
      } else if (e.target.textContent === "Edit Row") {
        const row = event.target.closest("tr");
        if (row) {
          editRow(row);
        }
      }
      contextMenu.remove();
    });

    // 컨텍스트 메뉴가 사라질 때 이벤트 처리
    window.addEventListener("click", () => {
      contextMenu.remove();
    });
  });

  function editRow(row) {
    const cells = row.querySelectorAll("td");
    const inputFields = Array.from(cells).map((cell) => {
      const input = document.createElement("input");
      input.value = cell.textContent;
      return input;
    });

    cells.forEach((cell, index) => {
      cell.textContent = "";
      cell.appendChild(inputFields[index]);
    });

    const saveButton = document.createElement("button");
    saveButton.textContent = "Save";
    row.appendChild(saveButton);

    saveButton.addEventListener("click", () => {
      inputFields.forEach((input, index) => {
        cells[index].textContent = input.value;
      });
      row.removeChild(saveButton);
    });
  }

  function removeRowsWithValue(targetValue) {
    const table = document.getElementById("xmlTable");
    const rows = table.querySelectorAll("tbody tr");

    rows.forEach((row) => {
      const cell = row.cells[1];
      if (cell.textContent == targetValue) {
        row.remove();
      }
    });
  }
});
