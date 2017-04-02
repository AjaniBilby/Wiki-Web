if (!Get){
  var Get = function(url, callback){
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function(){
      if (this.readyState == 4){
        callback(this);
      }
    };
    xhttp.open("GET", url, true);
    xhttp.send();

    return xhttp;
  };
}

var traceStreams = 15;

function Trace(start, end, callback){
  start = start.toLowerCase();
  end = end.toLowerCase();

  var search = [start];
  var found = false;
  var threads = 0;
  var next = [];
  var all = [];
  var connections = {};
  var ended = false;

  var loop = function(){
    var term = search[0];
    search.splice(0, 1); //Remove the searching item

    Get('/data/'+term, function(response){
      if (response.status == 200){
        var body = response.responseText.replace(/\r\n/g, '\n').split('\n');

        if (!connections[term]){
          connections[term] = [];
        }
        connections[term] = connections[term].concat(body);
        all = all.concat(body);

        //If the end is in the results, and don't change found it false
        found = body.indexOf(end) != -1 || found;

        //Push new links for the next set
        if (found !== true){
          next = next.concat(body);
        }
      }

      attemptEnd(term);
    });

    threads += 1;
  };
  var attemptEnd = function(term){
    threads -= 1;

    if (!found && search.length <= 0){
      search = next;
      next = [];
    }
    var result = {
      start: start,
      end: end,
      success: found,
      connections: connections,
      all: all
    };

    if (term !== undefined){
      new logger.message('<b>Searched</b> '+term);
    }

    if (!found && search.length > 0){
      var num = Math.min(traceStreams-threads, search.length);
      for (let i=0; i<num; i++){
        loop();
      }
    }else if ((found && threads <= 0) || search.length <= 0){
      new logger.message('<b>Hit '+end+'</b>');

      callback(result);
      ended = true;//Check that another thread is not trying to finish the task
    }
  };

  attemptEnd();
}
