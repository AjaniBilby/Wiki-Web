var prevMousePos = {
  x: null,
  y: null
};

function setup(){
  createCanvas(500, 500);
  pixelDensity(1);
}

function draw(){
  background(255);

  push();
  translate(
    100,
    canvas.height/2+50
  );
  DrawPoints();

  stroke(55);
  strokeWeight(3);
  textAlign('left', 'top');
  textSize(18);
  fill(255);
  text('Connections '+points.length, -90, -(canvas.height/2+40));
  text('Seperation '+seperation, -90, -(canvas.height/2+10));

  pop();

  noLoop();
}
