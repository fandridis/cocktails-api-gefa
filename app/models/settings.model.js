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

let Setting = mongoose.model('settings', SettingsSchema);

module.exports = {Setting}
    
