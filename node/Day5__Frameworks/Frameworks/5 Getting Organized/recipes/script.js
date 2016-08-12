  var express = require("express");
  var app = express();


var mod = require('./recipes');

app.get('/', function(req, res){
  res.render('index.ejs', {title: 'Clever Kitchens'});
});

app.get('/recipes', mod.list);
app.get('/recipes/:title', mod.single);

app.get('/*', function(req, res) {
  res.status(404).render('error.ejs', {title: 'Error'});
});

app.listen(3000);