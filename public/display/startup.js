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

  noStroke();
  textAlign('center', 'top');
  fill(0,38,150);

  //Path title
  textSize(28);
  text(title, canvas.width/2, -(canvas.height/2-10));

  //Path Description
  stroke(255);
  fill(10,120,249);
  strokeWeight(2);
  rect(
    -100, (canvas.height/2-70),
    300, (canvas.height/2)
  );

  noStroke();
  textSize(18);
  fill(255);
  textAlign('left', 'top');
  text('Connections: '+(points.length-2), -90, (canvas.height/2-60));
  text('Degrees of Seperation: '+seperation, -90, (canvas.height/2-30));

  pop();

  noLoop();
}
