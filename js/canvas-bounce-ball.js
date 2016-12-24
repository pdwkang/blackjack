
//////////////////
//////////////////
// canvas
//////////////////
// $(document).ready(function(){
// var canvas = document.getElementById('the-canvas');
// var context = canvas.getContext('2d');
// var r = 0;
// var g = 0;
// var b = 0;
// var x = 30;
// var y = 30;
// var radius = 30;
// var endArc = 0;
// var xDirection = 1
// var yDirection = 1
// var xBallSpeed = 15
// var yBallSpeed = 16
// var rectCounter = 0

// function draw(){
// if(startDrawing){
// 	if(rectCounter===10){
// 	// context.clearRect(0,0,500,500);
// 	rectCounter = 0
// 	radius = 0}
// 	context.fillStyle = '#' + r + g + b;
// 	context.beginPath();
// 	context.arc(x, y, radius, 0*Math.PI, Math.PI*endArc);
// 	context.fill();
// 	x += xBallSpeed*xDirection
// 	y += yBallSpeed*yDirection
	
// 	if(x >= 780){
// 	xDirection = -1;
// 	changeColor2();
// 	xBallSpeed = 19;
// 	}
	
// 	if(x <= 10){
// 	xDirection = +1;
// 	changeColor2();
// 	xBallSpeed = 7}
	
// 	if(y >= 450){
// 	yDirection = -1;
// 	changeColor2();
// 	yBallSpeed = 22}
	
// 	if(y <= 10){
// 	yDirection = +1;
// 	changeColor2();
// 	yBallSpeed = 12}
// 	endArc += 1;
// 	rectCounter++
// 	radius = (rectCounter);
// 	}
// }
// var ballInterval = setInterval(draw, 45);

// function changeColor2(){
// 	r = Math.floor(Math.random()*200)
// 	g = Math.floor(Math.random()*22)*Math.floor(Math.random()*10)
// 	b = Math.floor(Math.random()*150)
// }

// $('.arrow').hide();
// })