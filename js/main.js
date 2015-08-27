var max_scale = 2;
var max_radius = 100;

var m;
if (m = location.search.match(/\bscale=([0-9.]+)/)) {
	max_scale = parseFloat(m[1]);
}
if (m = location.search.match(/\bradius=(\d+)/)) {
	max_radius = parseFloat(m[1]);
}

// Grab the Canvas and Drawing Context
var canvas = document.getElementById('stage');
var ctx = canvas.getContext('2d');

var center_x = canvas.width / 2;
var center_y = canvas.height / 2;

var started = false, img, img2;

function reset() {
	img2 = new Image();
	img2.onload = function() {
		img = img2;
		make_stack(center_x, center_y);
		startListeningToMouse();
	};
	img2.src = 'img/' + $('#staffer').val();
}

function startListeningToMouse() {
	if (started) return;
	started = true;
	canvas.addEventListener('mousemove', function(evt) {
		var pos = getMousePos(canvas, evt);
		make_stack(pos.x, pos.y);
	}, false);
}

function make_stack(mx, my) {
	ctx.clearRect(0,0, canvas.width, canvas.height);
	ctx.drawImage(img, 0, 0, canvas.width, canvas.height); // scale 1

	var scale = 1;
	var scale_step = (max_scale - 1) / max_radius;

	for (var radius = max_radius; radius--; ) {
		scale += scale_step;
		ctx.save();
		ctx.beginPath();
		ctx.arc(mx, my, radius, 0, Math.PI * 2);
		ctx.clip();
		ctx.drawImage(img
			, mx * (1 - scale)
			, my * (1 - scale)
			, canvas.width * scale
			, canvas.height * scale
		);
		ctx.restore();
	}
}

function getMousePos(canvas, evt) {
	var rect = canvas.getBoundingClientRect();
	return {
		x: evt.clientX - rect.left,
		y: evt.clientY - rect.top
	};
}

var staff_sel = $('#staffer').change(reset);

// start on a random person
var num_staff = staff_sel.find('option').length;
staff_sel.get(0).selectedIndex = Math.floor(Math.random() * num_staff);

var downloadLink = $('#downloadLnk');

// click on image will take snapshot
/*
$('#stage').click(function() {
	window.open(canvas.toDataURL('png'), 'snapshot');
});
/**/
downloadLink.click(function() {
	var image_name = $('#staffer').val();
	var mime = 'image/' + (/\.jpe?g$/i.test(image_name) ? 'jpeg' : 'png');

	downloadLink.attr('download', image_name);
	downloadLink.attr('href', canvas.toDataURL(mime));
});

// start!
reset();
