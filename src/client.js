var xmlpath = "";

var selectedFile; // 선택된 파일을 저장할 변수
var xmlDoc; // XML 문서를 저장할 변수
var transformedData; // XML 문서를 변환한 데이터를 저장할 변수
document.getElementById("openXmlButton").addEventListener("click", function () {
  // 파일 탐색기 열기
  var input = document.createElement("input");
  input.type = "file";

  input.onchange = function (e) {
    // 선택한 파일의 경로 저장
    var file = e.target.files[0];
    var filePath = URL.createObjectURL(file);

    // 경로를 저장하거나 원하는 작업을 수행
    // 여기서는 경로를 변수에 저장합니다.
    var selectedFilePath = filePath;
    xmlpath = filePath;

    // 필요한 작업을 수행하도록 코드를 추가하세요.
    fetch(xmlpath)
      .then((response) => {
        return response.text();
      })
      .then((xmlString) => {
        let parser = new DOMParser();
        xmlDoc = parser.parseFromString(xmlString, "text/xml");
        return xmlDoc;
      })
      .then((xmlDoc) => {
        return Array.from(xmlDoc.querySelectorAll("symbol_object")).map(
          (row) => [
            row.querySelector("class").innerHTML,
            row.querySelector("degree").innerHTML,
            row.querySelector("xmin").innerHTML,
            row.querySelector("ymin").innerHTML,
            row.querySelector("xmax").innerHTML,
            row.querySelector("ymax").innerHTML,
          ]
        );
      })
      .then((xmlData) => {
        view.initXML(xmlData);

        this.transformedData = xmlData.map((row) => ({
          className: row[0],
          degree: row[1],
          xmin: row[2],
          ymin: row[3],
          xmax: row[4],
          ymax: row[5],
        }));

        createTable(transformedData);
        setWidthAndHeight("500px", "600px");
      });
  };

  input.click();
});
