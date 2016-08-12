var recipes = require('./data/record').data;

exports.list = function(req, res){
	console.log(req.params.test);
  res.render('recipes.ejs', {title: 'Clever Kitchens - Recipe List',recipes: recipes });
                                 };

exports.single = function(req, res) {
	var data = recipes.filter(function  (recipe) {
		
    return (recipe.url === req.params.title);
  });
	console.log(data);
	
  if (data.length > 0) {
    data = data[0];
    data.title = 'Clever Kitchens - Recipe';

    res.render('recipe.ejs', data);
  } else {
    res.status(404).render('error.ejs', {title: 'Recipe Not Found'});
  }
};