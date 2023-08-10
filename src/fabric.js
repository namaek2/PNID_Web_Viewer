const STATE_IDLE = "idle";
const STATE_PANNING = "panning";

// Create the canvas
var canvas = new fabric.Canvas("fabric");
canvas.backgroundColor = "#f1f1f1";
canvas.selection = false;

function getCanvas() {
  return canvas;
}

// 파일을 로드하고 캔버스의 배경으로 설정하는 함수
function loadFileToCanvas(input) {
  var file = input.files[0];
  var reader = new FileReader();

  reader.onload = function (e) {
    var fileExtension = file.name.split(".").pop().toLowerCase();

    //파일 확장자가 이미지일 경우
    if (["png", "jpg", "jpeg", "gif", "bmp"].includes(fileExtension)) {
      var img = new Image();

      img.onload = function () {
        var fabricImage = new fabric.Image(img, {
          selectable: false, // Make the image unselectable
        });

        fabricImage.set({
          left: 0,
          top: 0,
        });

        canvas.add(fabricImage);
        canvas.sendToBack(fabricImage);
      };

      img.src = e.target.result;
    }
    //다른 확장자일 경우
    else {
      alert("Unsupported file type");
    }
  };

  reader.readAsDataURL(file);
}

// 파일 탐색기 열기
function openFileExplorer() {
  fileInput.click();
}

//버튼을 클릭하면 파일 탐색기 열기
var loadButton = document.getElementById("openFileButton");
loadButton.addEventListener("click", function () {
  openFileExplorer();
});

// 파일 탐색기에서 이미지를 선택하면 loadImageToCanvas 함수 호출
var fileInput = document.getElementById("fileInput");
fileInput.addEventListener("change", function () {
  loadFileToCanvas(this);
});

var isDrawing = false;
var startDrawingPoint;
var rect;
var isPanning = false;
var lastPosX;
var lastPosY;

canvas.on("mouse:down", function (event) {
  if (!event.e.shiftKey) {
    isPanning = true;
    lastPosX = event.e.clientX;
    lastPosY = event.e.clientY;
  } else if (event.e.shiftKey) {
    isDrawing = true;
    var pointer = canvas.getPointer(event.e);
    startDrawingPoint = new fabric.Point(pointer.x, pointer.y);

    rect = new fabric.Rect({
      left: startDrawingPoint.x,
      top: startDrawingPoint.y,
      width: 0,
      height: 0,
      stroke: "red",
      strokeWidth: 2,
      fill: "transparent",
    });
    canvas.add(rect);
  }
});

canvas.on("mouse:move", function (event) {
  if (isPanning) {
    if (!canvas.getActiveObject()) {
      var dx = event.e.clientX - lastPosX;
      var dy = event.e.clientY - lastPosY;
      canvas.relativePan({ x: dx, y: dy });
      lastPosX = event.e.clientX;
      lastPosY = event.e.clientY;
    }
  } else if (isDrawing) {
    var endPoint = canvas.getPointer(event.e);
    var left = Math.min(startDrawingPoint.x, endPoint.x);
    var top = Math.min(startDrawingPoint.y, endPoint.y);
    var width = Math.abs(startDrawingPoint.x - endPoint.x);
    var height = Math.abs(startDrawingPoint.y - endPoint.y);

    rect.set({ left: left, top: top, width: width, height: height });
    canvas.renderAll();
  }
});

canvas.on("mouse:up", function (event) {
  if (isPanning) {
    isPanning = false;
  } else if (isDrawing) {
    isDrawing = false;
  }
});

canvas.on("mouse:wheel", function (event) {
  var zoom = canvas.getZoom();
  var zoomFactor = 1.1; // Adjust this factor for more or less aggressive zooming
  if (event.e.deltaY < 0) {
    zoom *= zoomFactor;
  } else {
    zoom /= zoomFactor;
  }
  canvas.zoomToPoint({ x: event.e.offsetX, y: event.e.offsetY }, zoom);
  event.e.preventDefault();
  event.e.stopPropagation();
});

export { getCanvas };
