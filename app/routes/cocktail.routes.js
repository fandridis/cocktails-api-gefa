var {authenticate} = require('./../middleware/authenticate');


module.exports = (app) => {

  const cocktails = require('../controllers/cocktail.controller');
  const ingredients = require('../controllers/ingredient.controller');

  // ======================== IMPORTANT ========================= //
  //  All /api/* routes are configured to redirect to backend     //
  //============================================================= //

  // Create a new cocktail
  app.post('/api/cocktails/create', cocktails.create);

  // Get all cocktails
  //app.get('/api/cocktails/getAll', cocktails.getAll);



  // ======================================== //
  //         Routes about ingredients         //
  //========================================= //

  // Create a new ingredient
  app.post('/api/ingredients/create', ingredients.create);

  // Get all ingredients
  app.get('/api/ingredients/getAll', ingredients.getAll);

}



  
