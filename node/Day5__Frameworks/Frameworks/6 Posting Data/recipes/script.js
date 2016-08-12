var express = require('express');

var app = express.createServer();
app.use(express.bodyParser());

var recipesm = require('./recipes.js');

app.get('/', function(req, res){
  res.render('index.ejs', {title: 'Clever Kitchens'});
});

app.get('/recipes', recipesm.list);

app.get('/recipes/suggestget', function(req, res) {
  res.render('suggest.ejs', {title: 'Suggest a Recipe'});
});

app.post('/recipes/suggest', recipesm.suggest);

app.get('/recipes/:title', recipesm.single);

app.get('/*', function(req, res) {
  res.status(404).render('error.ejs', {title: 'Error'});
});

app.listen(3000);