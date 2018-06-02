const mongoose = require('mongoose');

const ObjectIdType = mongoose.Schema.Types.ObjectId;

let SettingsSchema = new mongoose.Schema({
    name: { type: String, required: true },
    values: Array,
    reference: {
        type: {type: String},
        objId: {type: ObjectIdType}
    },
  });




// Find tournament by code and add user
SettingsSchema.statics.findByCodeAndAddParticipant = function (code, userId) {
    console.log('code @ findByIdAndComplete: ', code);
    let Tournament = this;
  
    return Tournament.findOneAndUpdate(
        { 'code': code },
        {  $push: { "participants": userId } },
        { new: true }
    );
};

// Find tournament by code and add user
SettingsSchema.statics.updateLuckyTeam = function (tournamentId, luckyTeam) {
    console.log('Updating @ updateLuckyTeam: ');
    let Tournament = this;
  
    return Tournament.findOneAndUpdate(
        { _id: tournamentId },
        {  $set: { "luckyTeam": luckyTeam } },
        { new: true }
    );
};


let Setting = mongoose.model('settings', SettingsSchema);

module.exports = {Setting}
    
