var request = require('request');
var http = require('http');
var fs = require('fs');

var passer = require('passer');

passer.publicFolder = './public';
passer.listen(8080);

passer.get('/data/*', function(req, res){
  let path = req.url.substr(6)+'.dat';

  passer.parseFile('/data/'+path, req, res, false);
});
passer.post('/data/*', function(req, res){
  console.log('form', req.forms);

  let input = req.forms.data;

  try {
    var data = JSON.parse(input);
    fs.writeFile(data.line.join('\n'), '/data/'+path+'.dat');
    res.end('saved');
  } catch (e) {
    res.end('Bad Input');
  }
});

passer.get('/wiki/*', function(req, res){
  var path = req.url.substr(6);

  console.log('https://en.wikipedia.org/wiki/'+path);

  request('https://en.wikipedia.org/wiki/'+path, function(error, response, body){
    if (error){
      res.end(''+error);
      return;
    }
    res.end(body);
  });
});
