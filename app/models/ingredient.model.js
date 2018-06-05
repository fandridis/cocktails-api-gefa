const mongoose = require('mongoose');

let IngredientSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    //    minlength: 1,
    //    trim: true
    },
    description: {
        type: String
    },
    alcoholPercentage: {
        type: Number,             
        default: 0
    },
    type: {
        type: String,       // spirit, juice, herb, other
    }
  });

let Ingredient = mongoose.model('ingredients', IngredientSchema);

module.exports = {Ingredient}
    
