var connect = require('connect');

var app = connect()
     .use(connect.bodyParser()) //order matters
   .use(connect.static('public'))
   .use(function (req, res) {
		
	    if (req.url === '/process') {
			res.end(req.body.name + ' would repeat ' + req.body.repeat + ' times.');
		} else {
			res.end("Invalid Request");
		}
	})

	.listen(3000);
