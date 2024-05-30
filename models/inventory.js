const mongoose = require('mongoose');
const Inventory = new mongoose.Schema({
    Medicine:String,
    CurrentQty:Number,
    AlertQty:Number,
    ExpiryDate:Date,
    Batch:String,
    Price:Number,
    PurchasePrice:Number
},
{
    timestamps:true
});

const Inventories = mongoose.model('Inventory', Inventory);
module.exports = Inventories;