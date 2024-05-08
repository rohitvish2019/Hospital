const Purchases = require('../models/purchases')
const Inventories = require('../models/inventory')
module.exports.purchaseHome =async function(req, res){
    let inventory = await Inventories.find({}).distinct('Medicine');
    return res.render('purchases', {inventory});
}

module.exports.addPurchases = async function(req, res){
    let items = req.body.items;
    console.log(items.length);
    for(let i=0;i<items.length;i++){
        let item = items[i].split(':');
        await Purchases.create({
            Medicine:item[0],
            Batch:item[1],
            PurchasePrice:Number(item[2]),
            SellingPrice:Number(item[3]),
            ExpiryDate:item[4],
            BoxSize:Number(item[5]),
            BoxCount:Number(item[6])
        });
        await Inventories.create({
            Medicine:item[0],
            Batch:item[1],
            CurrentQty:Number(item[5]) * Number(item[6]),
            AlertQty:30,
            ExpiryDate:item[4],
            Price:Number(item[3])
        })
    }
    return res.status(200).json({
        message:'Purchase added'
    })  
}


module.exports.getMedInfoPrescriptions = async function(req, res){
    let medInfo = await Inventories.find({Medicine:req.query.Medicine}).sort('ExpiryDate');
    let totalQty = 0;
    let returnableInfo;
    let isReturnValueSet = false;
    for(let i=0;i<medInfo.length;i++){
        if(medInfo[i].CurrentQty > 0 && isReturnValueSet == false){
            returnableInfo = medInfo[i];
            isReturnValueSet = true
        }
        totalQty = totalQty + Number(medInfo[i].CurrentQty);
    }
    return res.status(200).json({
        medInfo:returnableInfo,
        totalQty
    })
}

module.exports.purchaseHistoryHome = async function(req, res){
    let purchases = await Purchases.find({});
    return res.render('purchaseHistory', {purchases})
}


module.exports.getPurchaseHistory = async function (req, res){
    let purchases = await Purchases.find({createdAt :{$gte : req.query.startDate}, createdAt:{$lte : req.query.endDate}}).sort('Medicine');
    return res.status(200).json({
        purchases
    })
}

module.exports.invertoryManagerHome = async function(req, res){
    let inventory = await Inventories.find({}).distinct('Medicine');
    return res.render('invetoryManager',{inventory});
}

module.exports.getMedInfo = async function(req, res){
    let meds = await Inventories.find({Medicine:req.query.Medicine, CurrentQty: {$gt : 0}});
    return res.status(200).json({
        meds
    })
}

module.exports.updateInventory = async function(req, res){
    await Inventories.findByIdAndUpdate(req.body.id, {CurrentQty:req.body.qty});
    return res.status(200).json({
        message:'Updated inventories'
    })
}