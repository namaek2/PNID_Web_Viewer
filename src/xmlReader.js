document.addEventListener("DOMContentLoaded", function () {
  const xmlFileInput = document.getElementById("xmlFileInput");
  const loadButton = document.getElementById("openXmlButton");
  const xmlTable = document.getElementById("xmlTable");

  loadButton.addEventListener("click", function () {
    xmlFileInput.click();
  });

  xmlFileInput.addEventListener("change", function (e) {
    loadFileToTable(e.target);
  });

  function loadFileToTable(input) {
    var file = input.files[0];
    var reader = new FileReader();

    reader.onload = function (e) {
      var fileExtension = file.name.split(".").pop().toLowerCase();

      if (fileExtension === "xml") {
        const xmlText = e.target.result;
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(xmlText, "text/xml");

        const symbolObjects = xmlDoc.getElementsByTagName("symbol_object");
        const tableBody = xmlTable.querySelector("tbody");
        tableBody.innerHTML = "";

        for (let i = 0; i < symbolObjects.length; i++) {
          const symbolObject = symbolObjects[i];
          const type = symbolObject.querySelector("type").textContent;
          const classValue = symbolObject.querySelector("class").textContent;
          const xmin = symbolObject.querySelector("xmin").textContent;
          const ymin = symbolObject.querySelector("ymin").textContent;
          const xmax = symbolObject.querySelector("xmax").textContent;
          const ymax = symbolObject.querySelector("ymax").textContent;
          const degree = symbolObject.querySelector("degree").textContent;

          const row = document.createElement("tr");
          row.innerHTML = `
              <td>${i}</td>
              <td>${type}</td>
              <td>${classValue}</td>
              <td>${xmin}</td>
              <td>${ymin}</td>
              <td>${xmax}</td>
              <td>${ymax}</td>
              <td>${degree}</td>
            `;

          tableBody.appendChild(row);
        }
      } else {
        alert("Unsupported file type");
      }
    };

    reader.readAsText(file);
  }
});
