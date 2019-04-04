const passer = require('passer');
const http = require('follow-redirects').http;
const fs = require('fs');

if (!fs.existsSync('./data')){
	fs.mkdirSync('./data');
}



//Setup passer
passer.listen(process.env.PORT || 5000);
passer.publicFolder = './public/';
passer.noSession = true;

passer.get('/wikipedia/*', (req, res)=>{
	let article = req.url.slice(11);

	// If the result is cached don't download it
	const filepath = './data/'+article+".dat";
	if (fs.existsSync(filepath)){
		console.log('Loading from cache:', article);

		fs.readFile(filepath, (err, data)=>{
			if (err){
				res.end('');
				return;
			}

			res.end(data);
		});
	}else{
		console.log('Loading from internet:', article);

		http.get('http://en.wikipedia.org/wiki/'+article+'?action=raw', (response) => {

			const { statusCode } = response;

			response.setEncoding('utf8');
			let data = '';
			response.on('data', (chunk)=>{ data += chunk; });
			response.on('end', () => {
				if (statusCode !== 200){
					res.statusCode = statusCode;
					res.end(statusCode.toString());
					return;
				}

				references = InterpWikiPage(data, article);
				references = references.join('\n');

				// Cache result for later
				fs.writeFile(filepath, references, ()=>{});

				res.end(references);
			});
		}).on('error', (e) => {
			res.end('');
		});
	}
});





var maxStringLength = 134217727;
function InterpWikiPage(string, term){
	//Remove headers, and convert to a standard \n format
	string = string.replace(/\r\n/g, '\n');
	string = string.substr(string.indexOf('\n\n')).toLowerCase();

	var broken = null;

	//Remove references
	while (string.indexOf('<ref') != -1){
		var start = string.indexOf('<ref');
		var end = string.indexOf('</ref>');

		if (start == -1 || end == -1){
			broken = 1;
			break;
		}
		var a = string.slice(0, start);
		var b = string.slice(end+6);
		if (a.length+b.length >= maxStringLength){
			broken = 2;
			break;
		}

		string =  a+b ;
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
		if (links.indexOf(link) == -1 && link.indexOf('>') == -1 && link.indexOf('<') == -1){
			links.push(link.toLowerCase());
		}
	}

	if (broken == 1){
		console.error('Reference tags miss match ('+term+') ' + links.length);
	}else if (broken == 2){
		console.error('String Length Fail ('+term+') ' + links.length);
	}

	return links;
}
