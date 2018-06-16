
module.exports = (app) => {

  const cocktails = require('../controllers/cocktail.controller');
  const ingredients = require('../controllers/ingredient.controller');

  var multer  = require('multer')
  var upload = multer({ dest: 'uploads/' })

  // ================================== IMPORTANT ===================================== //
  //   All /api/* routes are configured to redirect to backend (proxy @ package.json)   //
  //=================================================================================== //

  // Create a new cocktail
  app.post('/api/cocktails/create', cocktails.create);

  // Get all cocktails
  app.post('/api/cocktails/getall', cocktails.getall);

  // Upload a cocktail image
  app.post('/api/cocktails/uploadimage', upload.single('file'), cocktails.uploadImage);

  // ======================================== //
  //         Routes about ingredients         //
  //========================================= //

  // Create a new ingredient
  app.post('/api/ingredients/create', ingredients.create);

  // Get all ingredients
  app.get('/api/ingredients/getall', ingredients.getAll);

}



  
