const Purchases = require('../models/purchases')
const Inventories = require('../models/inventory')
module.exports.purchaseHome =async function(req, res){
    let inventory = await Inventories.find({}).distinct('Medicine');
    return res.render('purchases', {inventory});
}

module.exports.addPurchases = async function(req, res){
    let items = req.body.items;
    try{
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
            try{
                await Inventories.create({
                    Medicine:item[0],
                    Batch:item[1],
                    CurrentQty:Number(item[5]) * Number(item[6]),
                    AlertQty:30,
                    ExpiryDate:item[4],
                    Price:Number(item[3])
                })
            }catch(err){
                console.log('DB error : Unable to update inventories');
                console.log(err)
            }
            
        }
    }catch(err){
        return res.status(500).json({
            message:'Unable to add purchase'
        })
    }
    return res.status(200).json({
        message:'Purchase added'
    })  
}


module.exports.getMedInfoPrescriptions = async function(req, res){
    let medInfo, returnableInfo, isReturnValueSet, totalQty
    try{
        medInfo = await Inventories.find({Medicine:req.query.Medicine}).sort('ExpiryDate');
    }catch(err){
        return res.status(500).json({
            message:'Unable to find Medicine Info'
        })
    }
    try{
        totalQty = 0;
        returnableInfo;
        isReturnValueSet = false;
        for(let i=0;i<medInfo.length;i++){
            if(medInfo[i].CurrentQty > 0 && isReturnValueSet == false){
                returnableInfo = medInfo[i];
                isReturnValueSet = true
            }
            totalQty = totalQty + Number(medInfo[i].CurrentQty);
        }
    }catch(err){
        console.log(err)
        return res.status(500).json({
            message:'Unable to fetch Med Info'
        })
    }
    return res.status(200).json({
        medInfo:returnableInfo,
        totalQty
    })
}

module.exports.purchaseHistoryHome = async function(req, res){
    return res.render('purchaseHistory')
}


module.exports.getPurchaseHistory = async function (req, res){
    console.log(req.query)
    try{
        let purchases = await Purchases.find({
            $and: [
                {createdAt:{$gte :new Date(req.query.startDate)}},
                {createdAt: {$lte : new Date(req.query.endDate)}}
            ]
        }).sort('Medicine');
        return res.status(200).json({
            purchases
        })
    }catch(err){
        console.log(err)
        return res.status(500).json({
            message:'Unable to fetch purchase history'
        })
    }
    
}

module.exports.invertoryManagerHome = async function(req, res){
    try{
        let inventory = await Inventories.find({}).distinct('Medicine');
        return res.render('invetoryManager',{inventory});
    }catch(err){
        console.log(err)
        return res.redirect('back')
    }
    
    
}

module.exports.getMedInfo = async function(req, res){
    try{
        let meds = await Inventories.find({Medicine:req.query.Medicine, CurrentQty: {$gt : 0}});
        return res.status(200).json({
            meds
        })
    }catch(err){
        console.log(err);
        return res.status(500).json({
            message:'Unable to find med info'
        })
    }
}

module.exports.updateInventory = async function(req, res){
    try{
        await Inventories.findByIdAndUpdate(req.body.id, {CurrentQty:req.body.qty});
        return res.status(200).json({
            message:'Updated inventories'
        })
    }catch(err){
        return res.status(500).json({
            message:'Unable to update inventories'
        })
    }
}