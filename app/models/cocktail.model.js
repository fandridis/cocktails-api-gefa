const mongoose = require('mongoose');

const ObjectIdType = mongoose.Schema.Types.ObjectId;

let CocktailSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    //    minlength: 1,
    //    trim: true
    },

    ingredients: [{
        ingredientObjId: { type: ObjectIdType, ref: 'ingredients' },
        quantity: Number,
        quantityType: String    // ml, oz, grams, pieces
    }],    
    isAlcoholic: {
        type: Boolean       
    },
    howTo: String
  });


// Find tournament by code and add user
CocktailSchema.statics.findByCodeAndAddParticipant = function (code, userId) {
    console.log('code @ findByIdAndComplete: ', code);
    let Tournament = this;
  
    return Tournament.findOneAndUpdate(
        { 'code': code },
        {  $push: { "participants": userId } },
        { new: true }
    );
};

// Find tournament by code and add user
CocktailSchema.statics.updateLuckyTeam = function (tournamentId, luckyTeam) {
    console.log('Updating @ updateLuckyTeam: ');
    let Tournament = this;
  
    return Tournament.findOneAndUpdate(
        { _id: tournamentId },
        {  $set: { "luckyTeam": luckyTeam } },
        { new: true }
    );
};


let Cocktail = mongoose.model('cocktails', CocktailSchema);

module.exports = {Cocktail}
    
