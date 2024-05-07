const mongoose = require('mongoose');
const Purchase = new mongoose.Schema({
    Medicine:String,
    PurchasePrice:Number,
    SellingPrice:Number,
    ExpiryDate:Date,
    BoxSize:Number,
    BoxCount:Number,
    Batch:String,
},
{
    timestamps:true
});

const Purchases = mongoose.model('Purchase', Purchase);
module.exports = Purchases;