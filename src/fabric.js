const STATE_IDLE = "idle";
const STATE_PANNING = "panning";

// Create the canvas
let canvas = new fabric.Canvas("fabric");
canvas.backgroundColor = "#f1f1f1";
canvas.selection = false;

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
      };

      img.src = e.target.result;
    }
    //파일 확장자가 xml일 경우
    else if (fileExtension === "xml") {
      reader.onload = function (e) {
        alert(reader.result); // Show the content of the XML file in an alert
      };
      reader.readAsText(file);
    } else {
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

//zoom
canvas.on("mouse:wheel", function (opt) {
  var delta = opt.e.deltaY;
  var zoom = canvas.getZoom();
  zoom *= 0.999 ** delta; // Zoom factor
  if (zoom > 5) zoom = 5; // Max zoom limit
  if (zoom < 0.000001) zoom = 0.000001; // Min zoom limit
  canvas.zoomToPoint({ x: opt.e.offsetX, y: opt.e.offsetY }, zoom);
  opt.e.preventDefault();
  opt.e.stopPropagation();
});

//panning
fabric.Canvas.prototype.toggleDragMode = function (dragMode) {
  // Remember the previous X and Y coordinates for delta calculations
  let lastClientX;
  let lastClientY;
  // Keep track of the state
  let state = STATE_IDLE;
  // We're entering dragmode
  if (dragMode) {
    // Discard any active object
    this.discardActiveObject();
    // Set the cursor to 'move'
    this.defaultCursor = "move";
    // Loop over all objects and disable events / selectable. We remember its value in a temp variable stored on each object
    this.forEachObject(function (object) {
      object.prevEvented = object.evented;
      object.prevSelectable = object.selectable;
      object.evented = false;
      object.selectable = false;
    });
    // Remove selection ability on the canvas
    this.selection = false;
    // When MouseUp fires, we set the state to idle
    this.on("mouse:up", function (e) {
      state = STATE_IDLE;
    });
    // When MouseDown fires, we set the state to panning
    this.on("mouse:down", (e) => {
      state = STATE_PANNING;
      lastClientX = e.e.clientX;
      lastClientY = e.e.clientY;
    });
    // When the mouse moves, and we're panning (mouse down), we continue
    this.on("mouse:move", (e) => {
      if (state === STATE_PANNING && e && e.e) {
        // let delta = new fabric.Point(e.e.movementX, e.e.movementY); // No Safari support for movementX and movementY
        // For cross-browser compatibility, I had to manually keep track of the delta

        // Calculate deltas
        let deltaX = 0;
        let deltaY = 0;
        if (lastClientX) {
          deltaX = e.e.clientX - lastClientX;
        }
        if (lastClientY) {
          deltaY = e.e.clientY - lastClientY;
        }
        // Update the last X and Y values
        lastClientX = e.e.clientX;
        lastClientY = e.e.clientY;

        let delta = new fabric.Point(deltaX, deltaY);
        this.relativePan(delta);
        this.trigger("moved");
      }
    });
  } else {
    // When we exit dragmode, we restore the previous values on all objects
    this.forEachObject(function (object) {
      object.evented =
        object.prevEvented !== undefined ? object.prevEvented : object.evented;
      object.selectable =
        object.prevSelectable !== undefined
          ? object.prevSelectable
          : object.selectable;
    });
    // Reset the cursor
    this.defaultCursor = "default";
    // Remove the event listeners
    this.off("mouse:up");
    this.off("mouse:down");
    this.off("mouse:move");
    // Restore selection ability on the canvas
    this.selection = true;
  }
};

let dragMode = false;
$("#dragmode").change((_) => {
  dragMode = !dragMode;
  canvas.toggleDragMode(dragMode);
});
