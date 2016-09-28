var canvas,
	canvasWidth,
	canvasHeight,
	context,
	previousX,
	previousY,
	currentX,
	currentY;
var shouldDraw = false;
var strokeColor = "black";
var	strokeWidth = 4;
var redoList = [], undoList = [];

function init(){
	var imageLoader = document.getElementById('imagePicker');
    imageLoader.addEventListener('change', importImage, false);
	canvas = document.getElementById('canvas');
	context = canvas.getContext("2d");
	canvasWidth = canvas.width;
	canvasHeight = canvas.height;
	canvas.addEventListener("mouseup", function(evnt){
		drawHelper('up', evnt)
	}, false);
	canvas.addEventListener("mousedown", function(evnt){
		drawHelper('down', evnt)
	}, false);
	canvas.addEventListener("mousemove", function(evnt){
		drawHelper('move', evnt)
	}, false);
	canvas.addEventListener("mouseout", function(evnt){
		drawHelper('out', evnt)
	}, false);
}

function color(obj){
	strokeColor = obj.id;
}

function changeStrokeWidth(value){
	strokeWidth = value;
}

function draw(){
	context.beginPath();
	context.moveTo(previousX, previousY);
	context.lineTo(currentX, currentY);
	context.strokeStyle = strokeColor;
	context.lineJoin = 'round';
	context.lineCap = 'round';
	context.lineWidth = strokeWidth;
	context.stroke();
	context.closePath();
}

function undo(){
	if(undoList.length){
        var canvasPic = new Image();
        canvasPic.src = undoList.pop();
        redoList.push(canvas.toDataURL());
        context.clearRect(0, 0, canvasWidth, canvasHeight);
        context.drawImage(canvasPic, 0, 0);
	}
}

function redo(){
	if(redoList.length){
        var canvasPic = new Image();
        canvasPic.src = redoList.pop();
        undoList.push(canvas.toDataURL());
        context.clearRect(0, 0, canvasWidth, canvasHeight);
        context.drawImage(canvasPic, 0, 0);
	}	
}

function importImage(e){
	redoList = [];
	undoList = [];
    var reader = new FileReader();
    reader.onload = function(event){
        var img = new Image();
        img.onload = function(){
            context.drawImage(img,0,0);
        }
        img.src = event.target.result;
    }
    reader.readAsDataURL(e.target.files[0]);     
}

function download() {
    var a = document.createElement("a");
    a.target = "_blank";
    a.href = canvas.toDataURL();
    a.click();
};

function drawHelper(eventName, evnt){
	if(eventName == 'down'){
		shouldDraw = true;
		previousX = currentX;
		previousY = currentY;
		currentX = evnt.clientX - canvas.offsetLeft;
		currentY = evnt.clientY - canvas.offsetTop;
		undoList.push(document.getElementById('canvas').toDataURL());
		redoList = [];
	}else if(eventName == 'up' || eventName == 'out'){
		shouldDraw = false;
	}else if (eventName == 'move' && shouldDraw){
		previousX = currentX;
		previousY = currentY;
		currentX = evnt.clientX - canvas.offsetLeft;
		currentY = evnt.clientY - canvas.offsetTop;
		draw();
	}
}