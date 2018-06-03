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
    
