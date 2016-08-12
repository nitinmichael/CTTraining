var express = require('express');

var app = express();

var recipes = require('./data/recipes').data;

app.get('/', function(req, res){
  res.render('index.ejs', {title: 'Clever Kitchens'});
});

app.get('/recipes', function(req, res){
  res.render('recipes.ejs', {title: 'Clever Kitchens ->Recipe List',recipesparam: recipes});
});

app.get('/recipes/:title', function(req, res) {
	res.send('<h1>' + req.params.title + '</h1>');
});

app.get('/*', function(req, res) {
  res.status(404).render('error.ejs', {title: 'Error'});
});

app.listen(3000);