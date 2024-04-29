const mongoose = require('mongoose');
const Tracker = new mongoose.Schema({
    PatientId : {
        type:Number
    }
},
{
    timestamps:true
});

const Trackers = mongoose.model('Tracker', Tracker);
module.exports = Trackers;