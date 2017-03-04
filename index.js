var request = require('request');
var http = require('http');
var fs = require('fs');

var passer = require('passer');

passer.publicFolder = './public';
passer.listen(8080);

passer.get('/data/*', function(req, res){
  let path = req.url.substr(6)+'.dat';

  if (fs.existsSync('./data/'+path)){
    passer.parseFile('./data/'+path, req, res, false);
  }else{
    res.statusCode = 400;
    res.end('Bad Request\n\n'+'./data/'+path);
    return;
  }
});
passer.post('/data/*', function(req, res){
  var path = req.url.substr(6);

  if (!req.forms.data || !req.forms.data.lines || req.forms.data.lines.length < 1){
    res.statusCode = 400;
    res.end('Bad Input');
    return;
  }

  fs.writeFile('./data/'+path+'.dat', req.forms.data.lines.join('\n'), 'utf8', function(){});

  res.end('saved');
});

passer.get('/wiki/*', function(req, res){
  var path = req.url.substr(6);

  request('https://en.wikipedia.org/wiki/'+path, function(error, response, body){
    if (error){
      res.end(''+error);
      return;
    }
    res.end(body);
  });
});
