var argv = require('optimist').argv;


for (var i=0; i < argv.times; i++) {
	
	console.log(argv._[0] + ' on loop number ' + (i + 1));
	
	console.log(argv._[1] + ' on loop number ' + (i + 1));
}

//--times  8 Echoing