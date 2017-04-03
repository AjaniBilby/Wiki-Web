var wiki = require('./wiki.js');
var fs = require('fs');
var traceStreams = 10;

//Get wikipedia pages
var Get = function(path, callback){
  let validFilePath = path.indexOf('/') == -1 && path.indexOf('\\') == -1 && path.indexOf('*') == -1;

  if (validFilePath && fs.existsSync('./data/'+path+'.dat')){
    var result = fs.readFileSync('./data/'+path+'.dat', 'utf8');
    if (result !== null){
      result = result.split('\n');
    }
    callback(result);
    return;
  }

  wiki(path, function(links){
    callback(links);

    if (validFilePath && links.length >= 1){
      fs.writeFileSync('./data/'+path+'.dat', links.join('\n'));
    }
  });
};

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

    Get(term, function(links){
      if (links !== null){

        if (!connections[term]){
          connections[term] = [];
        }
        connections[term] = connections[term].concat(links);
        all = all.concat(links);

        //If the end is in the results, and don't change found it false
        found = links.indexOf(end) != -1 || found;

        //Push new links for the next set
        if (found !== true){
          next = next.concat(links);
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



if (!fs.existsSync('./data/')){
  fs.mkdirSync('./data/');
}
