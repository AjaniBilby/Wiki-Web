var points = [];
var startPoint = null;
var pointIds = [];
var seperation = 0;
var largest = {
  x: 0,
  y: 0
};
var colors = [
  '#e21400', //Red
  '#d300e7', //Violet
  '#8c4f00', //Chocolate Brown
  '#3824aa', //Deep Purple
  '#4ae8c4', //Cyan
  '#00b322', //Deep Green
  '#f8a700', //Orangy Brown
  '#bb0e3d', //Rose
  '#3b88eb', //Cool Blue
  '#58dc00', //Vibrant Green
  '#f78b00', //Orange
  '#a700ff', //Purple
];

var onlyDirectConnections = true;



class Point extends Vector2{
  constructor(name, important = false){
    super(0, 0);
    if (typeof(name) != "string"){
      name = "unknown";
    }
    this.name = name.replace(/_/g, ' ');
    this.color = colors[0];
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
    fill(this.color);
    noStroke();

    ellipse(this.x, this.y, 30, 30);


    stroke(55);
    strokeWeight(4);
    textAlign('center', 'center');
    textSize(24);
    fill(255);

    text(this.name, this.x, this.y-5);

    return this;
  }
  drawConnections(){

    stroke(this.color);

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
  var goal = {
    start: undefined,
    end: undefined
  };

  var startPoint = trace.start;
  largest.x = 0;
  largest.y = 0;

  //Make title
  title = "Degrees of Seperation Between "+ (trace.start[0].toUpperCase()+trace.start.slice(1)) + ' & ' + (trace.end[0].toUpperCase()+trace.end.slice(1));

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
        item
      );
      if (item == trace.start){
        goal.start = points[points.length-1];
      }
      if (item == trace.end){
        goal.end = points[points.length-1];
      }
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

    var checked = [trace.start]; //Makes sure that it doesn't go through start
    var stack = [
      points[pointIds.indexOf(trace.end)]
    ];
    var i=1;

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
          }else if (connected.name == trace.start && trace.shortestPath === undefined){
            trace.shortestPath = i;
          }
        }
      }

      stack = next;
      i++;
    }

    for (let i=0; i<points.length; i++){
      //If the item was not hit during the back track, or the point has no connections
      if (checked.indexOf(points[i].name) == -1 || (points[i]._.c.length <= 0 && points[i]._.b.length <= 0)){
        points[i].destroy();

        /*The current index has been removed so we need to recheck
        this index because there is now a different item in it's place.*/
        i -=1;
      }
    }

    seperation = trace.shortestPath;
  })();

  //Setup point's locations
  (function(){
    var drawn = [];
    var col = [points[pointIds.indexOf(startPoint)]];
    var colIndex = 0;
    var colorId = 0;

    while (col.length > 0){
      var i=0;
      var next = [];

      for (let item of col){
        colorId += 1;
        if (colorId >= colors.length){
          colorId = 1;
        }
        drawn.push(item.name);

        var yPos = i-((col.length-1)/2);

        item.x = (colIndex*500) + ((Math.random()*250*2) - 250);
        item.y = (yPos*100) + ((Math.random()*40*2) - 40);
        item.color = colors[colorId];

        //Update image constraints
        if (item.x > largest.x){
          largest.x = item.x;
        }
        if (item.y > largest.y){
          largest.y = item.y*2;
        }

        //Setup for next colume
        for (let connected of item._.c){
          if (drawn.indexOf(connected.name) == -1 && next.indexOf(connected) == -1 && col.indexOf(connected) == -1){
            next.push(connected);
          }
        }
        i++;
      }



      //Sort and setup for next loop
      var beginning = true;
      colIndex++;
      col = [];
      next = next.sort(function(a,b){
        if (a._.c.length > b._.c.length){
          return -1;
        }else if (a._.c.length < b._.c.length){
          return 1;
        }else{
          return 0;
        }
      });
      while (next.length > 0){
        if (beginning){
          col.unshift(next[0]);
        }else{
          col.push(next[0]);
        }
        beginning = !beginning;
        next.splice(0,1);
      }
    }

    if (goal.start){
      goal.start.x = 0;
      goal.start.y = 0;
      goal.start.color = colors[0];
    }
    if (goal.end){
      goal.end.x = colIndex*500;
      goal.end.y = 0;
      goal.end.color = colors[0];

      largest.x = goal.end.x;
    }
  })();

  resizeCanvas(largest.x + 250, Math.max(largest.y * 2 + 200, window.innerHeight-45));

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
