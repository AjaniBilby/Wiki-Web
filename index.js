var request = require('request');
var http = require('http');
var fs = require('fs');

var wiki = require('./wiki.js');

var passer = require('passer');

passer.publicFolder = './public';
passer.listen(8080);

passer.get('/data/*', function(req, res){
  let path = req.url.substr(6).toLowerCase();
  let validFilePath = path.indexOf('/') == -1 && path.indexOf('\\') == -1;

  if (validFilePath && fs.existsSync('./data/'+path+'.dat')){
    res.end(fs.readFileSync('./data/'+path+'.dat'));
    return;
  }

  wiki(path, function(links){
    var result;
    try {
      result = links.join('\n');
    } catch (e) {
      res.end();
    }
    res.end(result);

    if (validFilePath){
      fs.writeFileSync('./data/'+path+'.dat', result);
    }
  });
});
