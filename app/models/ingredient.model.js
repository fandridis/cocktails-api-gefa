const mongoose = require('mongoose');

let IngredientSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    //    minlength: 1,
    //    trim: true
    },
    alcoholPercentage: {
        type: Number,           // Tournament status: 'draft', 'running', 'completed'   
        default: 0
    },
    type: {
        type: String,       // Spirit, Juice, Food, Other
        default: null
    }
  });


// Find tournament by code and add user
IngredientSchema.statics.getAll = function () {
    console.log('code @ findByIdAndComplete: ', code);
    let Ingredient = this;
  
    return Ingredient.find();
};

// Find tournament by code and add user
IngredientSchema.statics.updateLuckyTeam = function (tournamentId, luckyTeam) {
    console.log('Updating @ updateLuckyTeam: ');
    let Tournament = this;
  
    return Tournament.findOneAndUpdate(
        { _id: tournamentId },
        {  $set: { "luckyTeam": luckyTeam } },
        { new: true }
    );
};


let Ingredient = mongoose.model('ingredients', IngredientSchema);

module.exports = {Ingredient}
    
