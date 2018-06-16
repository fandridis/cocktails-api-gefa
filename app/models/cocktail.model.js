const mongoose = require('mongoose');

const ObjectIdType = mongoose.Schema.Types.ObjectId;

let CocktailSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    //    minlength: 1,
    //    trim: true
  },
  description: String,
  howTo: String,
  isAlcoholic: Boolean,
  strength: String,
  time: String,
  baseSpirit: String,
  imageLink: String,          // Reference to blob
  otherImagesLinks: [String],
  ingredients: [{
    ingredientObjId: { type: ObjectIdType, ref: 'ingredients' },
    ingredientName: String,
    quantity: Number,
    quantityType: String    // ml, oz, grams, pieces
  }],
});

// Save new cocktail
CocktailSchema.statics.save = function (cocktail) {
  console.log('cocktailName @ save: ', cocktail.name);
  let cocktailToSave = new Cocktail(cocktail);

  return cocktailToSave.save();
};

// Get all cocktails
CocktailSchema.statics.getAll = function () {

  return Ingredient.find().sort({ name: 1 })
};

// Add a link to the blob image to cocktail
CocktailSchema.statics.addImageLink = function (cocktailId, imageLink) {
  console.log(`Adding the imageLink ${imageLink} to cocktail with id ${cocktailId}`);

  return Cocktail.findOneAndUpdate(
    { "_id": cocktailId },
    {  $set: { "imageLink": imageLink } },
    { new: true }
  );
};

let Cocktail = mongoose.model('cocktails', CocktailSchema);

module.exports = { Cocktail }

