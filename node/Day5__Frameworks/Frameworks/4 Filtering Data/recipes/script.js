var express = require('express');

//var app = express.createServer();
var app = express();
var recipes = require('./data/recipes').data;

app.get('/', function(req, res){
  res.render('index.ejs', {title: 'Clever Kitchens'});
});

app.get('/recipes', function(req, res){
  res.render('recipes.ejs', {
    title: 'Clever Kitchens - Recipe List',
    recipesparam: recipes
  });
});

app.get('/recipes/:title', function(req, res) {
	
	var data = recipes.filter(function  (recipe) {
    return (recipe.url === req.params.title);
  });
console.log('filter data '+data[0]);
  if (data.length > 0) {
    data = data[0];
    data.title = 'Clever Kitchens - >Recipe';
console.log(data);
    res.render('recipe.ejs', data);
  } else {
    res.status(404).render('error.ejs', {title: 'Recipe Not Found'});
  }
});

app.get('/*', function(req, res) {
  res.status(404).render('error.ejs', {title: 'Error'});
});

app.listen(3000);