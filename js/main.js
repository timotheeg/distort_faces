
var
	// tunables
	max_scale  = 2,
	max_radius = 100,
	easing     = 'linear',

	// Grab the Canvas and Drawing Context
	canvas = document.getElementById('stage'),
	ctx = canvas.getContext('2d'),
	listening = false, img, img2, last_pos = {x: canvas.width / 2, y: canvas.height / 2},
	blob_stack = [],
	file_name;

function start() {
	if (location.hash) {
		var img2 = new Image();
		img2.onload = function() {
			img = img2;
			make_stack();
		};
		file_name = 'image.jpg';
		img2.src = location.hash.slice(1);
	}
	else {
		reset();
	}

	// check params
	var m;

	if (m = location.search.match(/\bscale=([0-9.]+)/)) {
		scale_slider.slider('value', parseFloat(m[1]));
	}
	if (m = location.search.match(/\bradius=(\d+)/)) {
		radius_slider.slider('value', parseFloat(m[1]));
	}
	if (m = location.search.match(/\beasing=([a-z]+)/i)) {
		if (easings.indexOf(m[1]) >= 0) {
			easing = m[1];
			easing_sel.val(easing);
		}
	}

	setScale();
	setRadius();

	if (m = location.search.match(/\bxy=(\d+)(?:,|%2C)(\d+)/i)) {
		last_pos = {
			x: parseInt(m[1], 10),
			y: parseInt(m[2], 10)
		};
	}
	else {
		toggleFollowMouse();
	}
}

function reset() {
	img2 = new Image();
	img2.onload = function() {
		img = img2;
		make_stack();
	};
	file_name = $('#staffer').val();
	img2.src = 'img/' + file_name;
}

function toggleFollowMouse() {
	if (listening) {
		canvas.removeEventListener('mousemove', onMouseMove);
	}
	else {
		canvas.addEventListener('mousemove', onMouseMove);
	}

	listening = !listening;
}

function onMouseMove(evt) {
	last_pos = getMousePos(canvas, evt);
	make_stack();
}

function captureSettings() {
	return {
		x:          last_pos.x,
		y:          last_pos.y,
		max_scale:  max_scale,
		max_radius: max_radius,
		easing:     easing
	};
}

// this is where the drawing magic happens
function make_stack(no_stack) {
	if (!img) return;

	// images are center-cropped to the canvas
	var img_ratio = img.width / img.height;
	var canvas_ratio = canvas.width / canvas.height;
	var
		w = canvas.width,
		h = canvas.height,
		offset_x = 0,
		offset_y = 0;

	if (img_ratio > canvas_ratio) {
		// img width is too long
		w = canvas.height * img_ratio;
		offset_x = (canvas.width - w) / 2;
	}
	else if (img_ratio < canvas_ratio) {
		h = canvas.width / img_ratio;
		offset_y = (canvas.height - h) / 2;
	}

	ctx.clearRect(0,0, canvas.width, canvas.height);
	ctx.drawImage(img, offset_x, offset_y, w, h); // scale 1

	if (no_stack) return;

	blob_stack.concat([captureSettings()]).forEach(function(settings) {

		var
			easing_func = $.easing[settings.easing],
			start_scale = 1,
			end_scale   = settings.max_scale,
			max_radius  = settings.max_radius;

		for (var radius = max_radius; radius--; ) {
			scale = start_scale + (end_scale - start_scale) * easing_func((max_radius - radius + 1) / max_radius);

			ctx.save();
			ctx.beginPath();
			ctx.arc(settings.x, settings.y, radius, 0, Math.PI * 2);
			ctx.clip();
			ctx.drawImage(img
				, settings.x * (1 - scale) + offset_x * scale
				, settings.y * (1 - scale) + offset_y * scale
				, w * scale
				, h * scale
			);
			ctx.restore();
		}
	});
}

function getMousePos(canvas, evt) {
	var rect = canvas.getBoundingClientRect();
	return {
		x: evt.clientX - rect.left,
		y: evt.clientY - rect.top
	};
}

var staff_sel = $('#staffer').change(reset);

var
	jpegLink      = $('#jpegLnk'),
	pngLink       = $('#pngLnk'),
	scale_slider  = $('#scale_slider'),
	radius_slider = $('#radius_slider');

$(canvas).click(toggleFollowMouse);

// click on image will take snapshot and let it download locally
jpegLink.click(function() {
	jpegLink.attr('download', file_name.replace(/\.[^.]+$/, '.jpg'));
	jpegLink.attr('href', canvas.toDataURL('image/jpeg', 0.95));
});

pngLink.click(function() {
	pngLink.attr('download', file_name.replace(/\.[^.]+$/, '.png'));
	pngLink.attr('href', canvas.toDataURL('image/png'));
});

function setScale() {
	max_scale = scale_slider.slider('value');
	$('#scale_txt').text(max_scale);
	make_stack();
}

scale_slider.slider({
	min: 0.2,
	step: 0.05,
	max: 3.0,
	value: max_scale,
	slide: setScale
});

function setRadius() {
	max_radius = radius_slider.slider('value');
	$('#radius_txt').text(max_radius);
	make_stack();
}

radius_slider.slider({
	min: 1,
	max: 250,
	value: max_radius,
	slide: setRadius
});

// set the easing selector
var easings = [
	'linear',
	'swing',
	'easeInQuad',
	'easeInCubic',
	'easeInQuart',
	'easeInQuint',
	'easeInExpo',
	'easeInSine',
	'easeInCirc',
	'easeInElastic',
	'easeInBounce',
	'easeInBack',
	'---',
	'easeOutQuad',
	'easeOutCubic',
	'easeOutQuart',
	'easeOutQuint',
	'easeOutExpo',
	'easeOutSine',
	'easeOutCirc',
	'easeOutElastic',
	'easeOutBounce',
	'easeOutBack',
	'---',
	'easeInOutQuad',
	'easeInOutCubic',
	'easeInOutQuart',
	'easeInOutQuint',
	'easeInOutExpo',
	'easeInOutSine',
	'easeInOutCirc',
	'easeInOutElastic',
	'easeInOutBounce',
	'easeInOutBack'
];
var easing_sel = $('#easing');
for (var idx = 0; idx < easings.length; idx++) {
	$(document.createElement('option'))
		.text(easings[idx])
		.attr('value', easings[idx])
		.appendTo(easing_sel);
}
easing_sel
	.val(easing)
	.change(function() {
		easing = easing_sel.val();
		make_stack();
	});

$('#smoothing').change(function() {
	ctx.imageSmoothingEnabled = $('#smoothing').is(':checked');
	make_stack();
}).prop('checked', !!ctx.imageSmoothingEnabled);

// set up file upload 
$('#file').change(function (evt) {
	$('#file_sel_err').text('');

	if (!(evt && evt.target && evt.target.files && evt.target.files[0])) return;

	var selectedFile = evt.target.files[0];
	if (!selectedFile.type.match(/^image\//)) {
		$('#file_sel_err').text('Not an image!');
		return;
	}

	file_name = selectedFile.name;

	var reader = new FileReader();
	reader.onload = function(e) {
		img = new Image();
		img.src = e.target.result;
		make_stack();
	};
	reader.readAsDataURL(selectedFile);
});

// set up handler for multiple blobs (experimental)
$(document).keydown(function(evt) {
	function done() {
		evt.stopPropagation();
		evt.preventDefault();
	}

	switch(evt.which) {
		case 27: // escape - compare with original
			done();
			make_stack(true);
			return;
		case 13: // enter - clear blob_stack
			done();
			blob_stack = [];
			break;
		case 8: // backspace - remove last blob_stack element
			done();
			blob_stack.pop();
			break;
		case 32: // space - make another blob
			done();
			blob_stack.push(captureSettings());
			break;
	}

	make_stack();
});

$(document).keyup(function(evt) {
	function done() {
		evt.stopPropagation();
		evt.preventDefault();
	}

	switch(evt.which) {
		case 27:
			done();
			make_stack();
			return;
	}
});

// start on a random person
var num_staff = staff_sel.find('option').length;
staff_sel.get(0).selectedIndex = Math.floor(Math.random() * num_staff);

// start!
start();

