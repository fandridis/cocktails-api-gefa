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

let Cocktail = mongoose.model('cocktails', CocktailSchema);

module.exports = {Cocktail}
    
