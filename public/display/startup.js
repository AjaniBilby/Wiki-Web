var prevMousePos = {
  x: null,
  y: null
};

function setup(){
  createCanvas(500, 500);
  pixelDensity(1);

  BuildPoints(trace);
}

function draw(){
  background(55);

  push();

  translate(
    100,
    canvas.height/2+50
  );

  //ellipse(0,0, 10, 10);
  DrawPoints();


  pop();

  noLoop();
}
