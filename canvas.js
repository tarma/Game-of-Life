var width = 100;
var height = 100;
var c = document.getElementById("main_canvas");
var cxt = c.getContext("2d");
cxt.fillStyle = "#000000";
var interval = 5;
var condition = [];
for (var i = 0; i < width; i++) {
    condition[i] = [];
}
var after_condition = [];
for (var i = 0; i < width; i++) {
    after_condition[i] = [];
}
var interval_id;
var interval_time = 300;
var running_status = false;

function init_canvas() {    
    for (var i = 0; i < width; i++) {
	for (var j = 0; j < height; j++) {
	    cxt.clearRect(i * interval, j * interval, interval, interval);
	    cxt.strokeRect(i * interval, j * interval, interval, interval);
	    condition[i][j] = 0;
	}
    }
    return true;
}

// Generate a random status and show it
function rand_canvas() {
    for (var i = 0; i < width; i++) {
	for (var j = 0; j < height; j++) {
	    if (Math.random() < 0.5) {
		condition[i][j] = 0;
		cxt.clearRect(i * interval, j * interval, interval, interval);
		cxt.strokeRect(i * interval, j * interval, interval, interval);
	    } else {
		condition[i][j] = 1;
		cxt.fillRect(i * interval, j * interval, interval, interval);
	    }
	}
    }
    return true;
}

function update_cell(x, y) {
    var x1 = (x + width - 1) % width;
    var x2 = (x + 1) % width;
    var y1 = (y + height - 1) % height;
    var y2 = (y + 1) % height;
    var sum = condition[x1][y1] + condition[x][y1] + condition[x2][y1] + condition[x1][y] + condition[x2][y] + condition[x1][y2] + condition[x][y2] + condition[x2][y2];
    switch (sum) {
    case 3:
	after_condition[x][y] = 1;
	break;
    case 2:
	after_condition[x][y] = condition[x][y];
	break;
    default:
	after_condition[x][y] = 0;
	break;
    }
    return after_condition[x][y];
}

function update_canvas() {
    cxt.clearRect(0, 0, c.width, c.height);
    for (var i = 0; i < width; i++) {
	for (var j = 0; j < height; j++) {
	    update_cell(i, j);
	    if (after_condition[i][j]) {
		cxt.fillRect(i * interval, j * interval, interval, interval);
	    } else {
		cxt.strokeRect(i * interval, j * interval, interval, interval);
	    }
	}
    }
    for (var i = 0; i < width; i++) {
	for (var j = 0; j < height; j++) {
	    condition[i][j] = after_condition[i][j];
	}
    }
}

// Modify the size of canvas and the changing time.
function change_size() {
    var temp;
    temp = parseInt(document.getElementById("height").value);
    if (temp > 0 && temp <= 100) {
	height = temp;
    } else {
	height = 100;
    }
    temp = parseInt(document.getElementById("width").value);
    if (temp > 0 && temp <= 100) {
	width = temp;
    } else {
	width = 100;
    }
    temp = parseInt(document.getElementById("interval").value);
    if (temp > 0) {
	if (temp <= 20) {
	    interval = temp;
	} else {
	    interval = 20;
	}
    } else {
	interval = 5;
    }
    temp = parseInt(document.getElementById("interval_time").value);
    if (temp > 0) {
	interval_time = temp;
    } else {
	interval_time = 500;
    }
    c.height = height * interval;
    c.width = width * interval;
    init_canvas();
    stop_update();
    return true;
}

function start_update() {
    if (!running_status) {
	interval_id = setInterval(update_canvas, interval_time);
	running_status = true;
    }
    return true;
}

function stop_update() {
    if (running_status) {
	clearInterval(interval_id);
	running_status = false;
    }
}

function clear_update(){
    stop_update();    
    init_canvas();
    return true;
}

// Process the event of clicking the canvas.
function click_canvas(e) {
    if (!running_status) {
	var canvas_rect = c.getBoundingClientRect();
	var body_rect = document.body.getBoundingClientRect();
	var x = parseInt((e.pageX - 8 - canvas_rect.left + body_rect.left) / interval);
	var y = parseInt((e.pageY - 8 - canvas_rect.top + body_rect.top) / interval);
	if (condition[x][y]) {
	    condition[x][y] = 0;
	    cxt.clearRect(x * interval, y * interval, interval, interval);
	    cxt.strokeRect(x * interval, y * interval, interval, interval);
	} else {
	    condition[x][y] = 1;
	    cxt.fillRect(x * interval, y * interval, interval, interval);
	}
    }
}
