

var
	// tunables
	max_scale  = 2,
	max_radius = 100,
	easing     = 'linear',

	// Grab the Canvas and Drawing Context
	canvas = document.getElementById('stage'),
	ctx = canvas.getContext('2d'),
	listening = false, img, img2, last_pos = {x: canvas.width / 2, y: canvas.height / 2};

function reset() {
	img2 = new Image();
	img2.onload = function() {
		img = img2;
		make_stack(last_pos.x, last_pos.y);
	};
	img2.src = 'img/' + $('#staffer').val();
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

	make_stack(last_pos.x, last_pos.y);
}

// this is where the drawing magic happens
function make_stack(mx, my) {
	if (!img) return;

	ctx.clearRect(0,0, canvas.width, canvas.height);
	ctx.drawImage(img, 0, 0, canvas.width, canvas.height); // scale 1

	var easing_func = $.easing[easing];
	var start_scale = 1, end_scale = max_scale;

	for (var radius = max_radius; radius--; ) {
		scale = start_scale + (end_scale - start_scale) * easing_func((max_radius - radius + 1) / max_radius);

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

var
	downloadLink  = $('#downloadLnk'),
	scale_slider  = $( "#scale_slider"),
	radius_slider = $( "#radius_slider");

$(canvas).click(toggleFollowMouse);

// click on image will take snapshot and let it download locally
downloadLink.click(function() {
	var image_name = $('#staffer').val();

	downloadLink.attr('download', image_name.replace(/\.[^.]+$/, '.jpg'));
	downloadLink.attr('href', canvas.toDataURL('image/jpeg', 0.95));
});

function setScale() {
	max_scale = scale_slider.slider('value');
	$('#scale_txt').text(max_scale);
	make_stack(last_pos.x, last_pos.y);
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
	make_stack(last_pos.x, last_pos.y);
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

	'easeOutQuad',
	'easeOutCubic',
	'easeOutQuart',
	'easeOutQuint',
	'easeOutExpo',
	'easeOutSine',
	'easeOutCirc',
	'easeOutElastic',
	'easeOutBounce',

	'easeInOutQuad',
	'easeInOutCubic',
	'easeInOutQuart',
	'easeInOutQuint',
	'easeInOutExpo',
	'easeInOutSine',
	'easeInOutCirc',
	'easeInOutElastic',
	'easeInOutBounce'
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
		make_stack(last_pos.x, last_pos.y);
	});

// start on a random person
var num_staff = staff_sel.find('option').length;
staff_sel.get(0).selectedIndex = Math.floor(Math.random() * num_staff);

// start!
reset();
setScale();
setRadius();
toggleFollowMouse();

