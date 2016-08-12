var express = require('express');
var url = require('url') ;

var app = express.createServer();

app.get('/recipes', function(req, res){
  res.send('<h1>All Recipes</h1>');
});



app.get('/recipes/:title', function(req, res) {
 res.send('<h1>' + req.params.title + '</h1>');
});

//Checking QueryString
app.get('/check',function(req,res){
	var queryObject = url.parse(req.url,true).query;
	  console.log(queryObject.name);
	res.send('<h1>' +queryObject.name + '</h1>');
});


app.get('/*', function(req, res) {
	 res.send('if all else fails, we hit this page');
	});


app.listen(3000);
















//url:http://webapplog.com/intro-to-express-js-parameters-error-handling-and-other-middleware/



/*app.get('/api/v1/stories/:id', function(req,res, next) {
	  //do authorization
	  //if not authorized or there is an error 
	  // return next(error);
	  //if authorized and no errors
	  return next();
	}), function(req,res, next) {
	  //extract id and fetch the object from the database
	  //assuming no errors, save story in the request object
	  req.story = story;
	  return next();
	}), function(req,res) {
	  //output the result of the database search
	  res.send(res.story);
	});*/