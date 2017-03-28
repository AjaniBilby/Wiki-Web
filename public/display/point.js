var points = [];
var startPoint = null;
var pointIds = [];
var largest = {
  x: 0,
  y: 0
};

var onlyDirectConnections = true;



class Point extends Vector2{
  constructor(name = 'unknown', important = false){
    super(0, 0);
    this.name = name.replace(/_/g, ' ');
    this.important = important;
    this._ = {
      c: [],
      b: []
    };

    var id = points.length;
    points.push(this);
    pointIds[id] = name;

    return this;
  }

  get connections(){
    return this._.c;
  }
  set connections(value){
    return this._.c;
  }
  get connectedTo(){
    return this._.b;
  }
  set connectedTo(value){
    return this._.b;
  }

  //Connections
  addConnection(point){
    this._.c.push(point);
    point._.b.push(this);

    return this;
  }
  removeConnection(point){
    var index = this._.c.indexOf(point);
    var myIndex = this._.c[index]._.b.indexOf(this);

    this._.c[index]._.b.splice(myIndex, 1);
    this._.c.splice(index, 1);

    return this;
  }

  destroy(){
    while (this._.c.length > 0){
      this.removeConnection(this._.c[0]);
    }

    while (this._.b.length > 0){
      this._.b[0].removeConnection(this);
    }

    var index = points.indexOf(this);
    if (index != -1){
      points.splice(index, 1);
    }
    pointIds.splice(pointIds.indexOf(this.name), 1);

    return undefined;
  }

  //Graphical
  draw(){
    if (this.important){
      fill(255, 0, 145); //rgb(255, 0, 145)
    }else{
      fill(0, 174, 255);
    }
    stroke(55);
    strokeWeight(4);

    ellipse(this.x, this.y, 30, 30);


    stroke(55);
    strokeWeight(3);
    textAlign('center', 'center');
    textSize(24);
    fill(255);

    text(this.name, this.x, this.y-5);

    return this;
  }
  drawConnections(){

    stroke(43, 127, 211);

    for (let other of this.connections){
      if (isNaN(other.x) || isNaN(other.y)){
        continue;
      }

      line(this.x, this.y, other.x, other.y);
    }

    return this;
  }
}




function BuildPoints(trace){
  points = [];
  pointIds = [];

  var startPoint = trace.start;
  largest.x = 0;
  largest.y = 0;

  //Make list of all points
  (function(){
    //Get all node points
    trace.all = [];
    if (trace.connections){
      trace.path = trace.connections;
    }
    for (let key in trace.connections){
      if (trace.all.indexOf(key) == -1){
        trace.all.push(key);
      }

      for (let item of trace.connections[key]){
        if (trace.all.indexOf(item) == -1){
          trace.all.push(item);
        }
      }
    }
  })();

  //Setup points
  (function(){
    for (let item of trace.all){
      new Point(
        item,
        (item == trace.start || item == trace.end)
      );
    }

    //Setup connections
    for (let key in trace.connections){
      var index = pointIds.indexOf(key);
      if (index === -1){
        continue;
      }

      for (let item of trace.connections[key]){
        var otherIndex = pointIds.indexOf(item);
        if (otherIndex == -1){
          continue;
        }

        points[index].addConnection(points[otherIndex]);
      }
    }
  })();

  //Remove disconnected points
  (function(){
    if (!onlyDirectConnections || !trace.end){
      return;
    }

    if (pointIds.indexOf(trace.end) == -1){
      return;
    }

    var checked = [];
    var stack = [
      points[pointIds.indexOf(trace.end)]
    ];

    while (stack.length > 0){
      var next = [];
      for (let item of stack){
        if (checked.indexOf(item.name) != -1){
          continue;
        }

        checked.push(item.name);
        for (let connected of item._.b){
          if (checked.indexOf(connected.name) == -1){
            next.push(connected);
          }
        }
      }

      stack = next;
    }

    for (let i=0; i<points.length; i++){
      if (checked.indexOf(points[i].name) == -1){
        points[i].destroy();

        /*The current index has been removed so we need to recheck
        this index because there is now a different item in it's place.*/
        i -=1;
      }
    }
  })();

  //Setup point's locations
  (function(){
    var drawn = [];
    var col = [points[pointIds.indexOf(startPoint)]];
    var colIndex = 0;

    while (col.length > 0){
      var i=0;
      var next = [];

      for (let item of col){
        drawn.push(item.name);

        var yPos = i-((col.length-1)/2);

        item.x = (colIndex*500) + ((Math.random()*300*2) - 150);
        item.y = (yPos*70) + ((Math.random()*25*2) - 25);

        //Update image constraints
        if (item.x > largest.x){
          largest.x = item.x;
        }
        if (item.y > largest.y){
          largest.y = item.y*2;
        }

        //Setup for next colume
        for (let connected of item._.c){
          if (
            drawn.indexOf(connected.name) == -1 && next.indexOf(connected) == -1 &&
            col.indexOf(connected) == -1
          ){
            next.push(connected);
          }
        }
        i++;
      }

      col = next;
      colIndex++;
    }

    var startIndex = pointIds.indexOf(trace.start);
    if (startIndex != -1){
      points[startIndex].x = 0;
      points[startIndex].y = 0;
    }
    var endIndex = pointIds.indexOf(trace.end);
    if (endIndex != -1){
      points[endIndex].x = (colIndex)*500;
      points[endIndex].y = 0;

      largest.x = points[endIndex].x;
    }
  })();

  resizeCanvas(largest.x + 150, largest.y * 2 + 250);

  draw();
}

function DrawPoints(){
  for (let point of points){
    point.drawConnections();
  }
  for (let point of points){
    point.draw();
  }
}
