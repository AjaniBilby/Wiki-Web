var request = require('request');

function Scan(string){
  //Remove headers, and convert to a standard \n format
  string = string.replace(/\r\n/g, '\n');
  string = string.substr(string.indexOf('\n\n'));

  //Remove references
  while (string.indexOf('<ref') != -1){
    var start = string.indexOf('<ref');
    var end = string.indexOf('</ref>');

    if (start == -1 || end == -1){
      break;
    }

    string = string.slice(0, start) + string.slice(end+6);
  }

  //Pull all links from the page
  var links = [];
  while (string.indexOf('[[') != -1){
    string = string.slice(string.indexOf('[[')+2);
    let end = string.indexOf(']]');

    let part = string.slice(0, end).split('|');
    if (part[0].indexOf(':') != -1 || part.length>2){
      continue;
    }

    let link = (part[1] || part[0]).replace(/ /g, '_');

    links.push(link.toLowerCase());
  }

  return links;
}

module.exports = function(term, callback){
  request('http://en.wikipedia.org/wiki/'+term+'?action=raw', function(error, response, body){
    if (error){
      callback([]);
      return;
    }

    if (body.indexOf('#REDIRECT') === 0){
      var next = body.replace(/\r\n/g, '\n').split('\n')[0];
      next = next.slice(11, -2);
      module.exports(next, callback);
    }else{
      callback(Scan(body));
    }
  });
};
