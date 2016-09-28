var canvas,
	canvasWidth,
	canvasHeight,
	context,
	previousX,
	previousY,
	currentX,
	currentY,
	shouldDraw = false,
	strokeColor = "black",
	strokeWidth = 4,
	redoList = [], 
	undoList = [];

var init = function() {
	var imageLoader = document.getElementById('imagePicker');
	
	imageLoader.addEventListener('change', importImage, false);
	canvas = document.getElementById('canvas');
	context = canvas.getContext("2d");
	// context.scale(0.5, 0.5);
	canvasWidth = canvas.width;
	canvasHeight = canvas.height;
	
	canvas.addEventListener(
		"mouseup", 
		function(evnt) {
			drawHelper('up', evnt);
		}, 
		false
		);
	
	canvas.addEventListener(
		"mousedown", 
		function(evnt) {
			drawHelper('down', evnt);
		}, 
		false
		);
	
	canvas.addEventListener(
		"mousemove", 
		function(evnt) {
			drawHelper('move', evnt);
		}, 
		false
		);
	
	canvas.addEventListener(
		"mouseout", 
		function(evnt) {
			drawHelper('out', evnt);
		}, 
		false
		);
}

var color = function(obj) {
	strokeColor = obj.id;
}

var changeStrokeWidth = function(value) {
	strokeWidth = value;
}

var draw = function() {
	context.beginPath();
	context.moveTo(previousX, previousY);
	context.lineTo(currentX, currentY);
	context.strokeStyle = strokeColor;
	context.lineJoin = 'round';
	context.lineCap = 'round';
	context.lineWidth = strokeWidth;
	context.stroke();
	context.closePath();

	console.log("X: " + currentX + " Y: " + currentY);
}

var undo = function() {
	if (undoList.length) {
		var canvasPic = new Image();
		
		canvasPic.src = undoList.pop();
		redoList.push(canvas.toDataURL());
		context.clearRect(0, 0, canvasWidth, canvasHeight);
		context.drawImage(canvasPic, 0, 0);
	}
}

var redo = function() {
	if (redoList.length) {
		var canvasPic = new Image();
		
		canvasPic.src = redoList.pop();
		undoList.push(canvas.toDataURL());
		context.clearRect(0, 0, canvasWidth, canvasHeight);
		context.drawImage(canvasPic, 0, 0);
	}	
}

var importImage = function(e) {
	redoList = [];
	undoList = [];

	var reader = new FileReader();
	
	reader.onload = function(event) {
		var img = new Image();

		img.onload = function() {
			context.drawImage(img,0,0);
		};

		img.src = event.target.result;
	};

	reader.readAsDataURL(e.target.files[0]);     
}

var download = function() {
	var a = document.createElement("a");

	a.target = "_blank";
	a.href = canvas.toDataURL();
	a.click();
}

var drawHelper = function(eventName, evnt) {
	if (eventName == 'down') {
		shouldDraw = true;
		previousX = currentX;
		previousY = currentY;
		currentX = evnt.clientX - canvas.offsetLeft - canvas.parentElement.offsetLeft;
		currentY = evnt.clientY - canvas.offsetTop - canvas.parentElement.offsetTop;
		undoList.push(document.getElementById('canvas').toDataURL());
		redoList = [];
	} else if (eventName == 'up' || eventName == 'out') {
		shouldDraw = false;
	} else if (eventName == 'move' && shouldDraw) {
		previousX = currentX;
		previousY = currentY;
		currentX = evnt.clientX - canvas.offsetLeft - canvas.parentElement.offsetLeft;
		currentY = evnt.clientY - canvas.offsetTop - canvas.parentElement.offsetTop;
		draw();
	}
}
