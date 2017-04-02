var title = 'Start - End';

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

  if (points.length <= 0){
    return;
  }

  push();
  translate(
    100,
    canvas.height/2
  );
  DrawPoints();

  stroke(55);
  strokeWeight(3);
  textAlign('left', 'top');
  fill(255);

  //Path title
  textSize(28);
  text(title, canvas.width/2, -(canvas.height/2-10));

  //Path Description
  textSize(18);
  text('Connections '+points.length, -90, (canvas.height/2-60));
  text('Seperation '+seperation, -90, (canvas.height/2-30));

  pop();

  noLoop();
}
