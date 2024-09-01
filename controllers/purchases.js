const Purchases = require('../models/purchases')
const Inventories = require('../models/inventory')
const Returns = require('../models/returns')
const PatientReturns = require('../models/patientReturns')
module.exports.purchaseHome =async function(req, res){
    if(req.user.role == 'Admin'){
        let inventory = await Inventories.find({}).distinct('Medicine');
        return res.render('purchases', {inventory,role:req.user.role});
    }else{
        return res.render('Error_403')
    }
    
}

module.exports.addPurchases = async function(req, res){
    if(req.user.role == 'Admin'){
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
                        Price:Number(item[3]),
                        PurchasePrice:Number(item[2])
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
    }else{
        return res.render('Error_403')
    }
      
}


module.exports.getMedInfoPrescriptions = async function(req, res){
    if(true){
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
            returnableInfo = new Array();
            isReturnValueSet = false;
            for(let i=0;i<medInfo.length;i++){
                if(medInfo[i].CurrentQty > 0){
                    returnableInfo.push(medInfo[i])
                    totalQty = totalQty + Number(medInfo[i].CurrentQty);
                }
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
    }else{
        return res.render('Error_403')
    }
    
}

module.exports.purchaseHistoryHome = async function(req, res){
    if(req.user.role == 'Admin'){
        return res.render('purchaseHistory',{role:req.user.role})
    }else{
        return res.render('Error_403')
    }
    
}

module.exports.allInventoriesHome = async function(req, res){
    if(req.user.role == 'Admin'){
        return res.render('allInventories',{role:req.user.role})
    }else{
        return res.render('Error_403')
    }
    
}
module.exports.returnsHome = async function(req, res){
    if(req.user.role == 'Admin'){
        return res.render('returnHistory',{role:req.user.role})
    }else{
        return res.render('Error_403')
    }
    
}

module.exports.getPurchaseHistory = async function (req, res){
    if(req.user.role == 'Admin'){
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
    }else{
        return res.render('Error_403')
    }
    
}
module.exports.getReturnsHistory = async function (req, res){
    console.log(req.query)
    if(req.user.role == 'Admin'){
        if(req.query.returnType == 'vendor'){
            try{
                let returnsData = await Returns.find({
                    $and: [
                        {createdAt:{$gte :new Date(req.query.startDate)}},
                        {createdAt: {$lte : new Date(req.query.endDate)}}
                    ]
                }).sort('createdAt');
                return res.status(200).json({
                    returnsData
                })
            }catch(err){
                console.log(err)
                return res.status(500).json({
                    message:'Unable to fetch returns history'
                })
            }
        }else{
            try{
                let returnsData = await PatientReturns.find({
                    $and: [
                        {createdAt:{$gte :new Date(req.query.startDate)}},
                        {createdAt: {$lte : new Date(req.query.endDate)}}
                    ]
                }).sort('createdAt');
                return res.status(200).json({
                    returnsData
                })
            }catch(err){
                console.log(err)
                return res.status(500).json({
                    message:'Unable to fetch returns history'
                })
            }
        }
        
    }else{
        return res.render('Error_403')
    }
    
    
}
module.exports.getActiveInventories = async function(req, res){
    if(req.user.role == 'Admin'){
        try{
            let inventories = await Inventories.find({
                $and: [
                    {ExpiryDate:{$gte :new Date(req.query.startDate)}},
                    {ExpiryDate: {$lte : new Date(req.query.endDate)}},
                    {CurrentQty : {$gt : 0}}
                ]
            }).sort('ExpiryDate');
            return res.status(200).json({
                inventories
            })
        }catch(err){
            console.log(err)
            return res.status(500).json({
                message:'Unable to fetch Inventories history'
            })
        }
    }else{
        return res.render('Error_403')
    }
    
}

module.exports.invertoryManagerHome = async function(req, res){
    if(req.user.role == 'Admin'){
        try{
            let inventory = await Inventories.find({}).distinct('Medicine');
            return res.render('invetoryManager',{inventory,role:req.user.role});
        }catch(err){
            console.log(err)
            return res.redirect('back')
        }
    }else{
        return res.render('Error_403')
    }
}

module.exports.getMedInfo = async function(req, res){
    if(req.user.role == 'Admin'){
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
    }else{
        return res.render('Error_403')
    }
    
}

module.exports.updateInventory = async function(req, res){
    if(req.user.role == 'Admin'){
        try{
            let newQty = Number(req.body.qty) + Number(req.body.addQty)
            let inventory = await Inventories.findById(req.body.id);
            await inventory.updateOne( {CurrentQty:newQty});
            await PatientReturns.create({
                Medicine:inventory.Medicine,
                Price:inventory.Price,
                Qty:req.body.addQty,
                ExpiryDate:inventory.ExpiryDate,
                Batch:inventory.Batch,
                AddedBy:req.user.full_name
            })
            return res.status(200).json({
                message:'Updated inventories'
            })
        }catch(err){
            return res.status(500).json({
                message:'Unable to update inventories'
            })
        }
    }else{
        return res.render('Error_403')
    }
    
}

module.exports.returnPurchases = async function(req, res){
    if(req.user.role == 'Admin'){
        let inventory;
        try{
            try{
                inventory = await Inventories.findById(req.body.id);
            }catch(err){
                return res.status(500).json({
                    message:'Error fetching stock'
                })
            }
        
            try{
                await Returns.create({
                    Medicine:inventory.Medicine,
                    Qty:inventory.CurrentQty,
                    ExpiryDate:inventory.ExpiryDate,
                    Batch:inventory.Batch,
                    Price:inventory.Price
                })
            }catch(err){
                return res.status(500).json({
                    message:'Error creating return'
                })
            }
            try{
                await inventory.updateOne({CurrentQty:0});
            }catch(err){
                return res.status(500).json({
                    message:'Error updating inventories'
                })
            }
        }catch(err){
            return res.status(500).json({
                message:'Unable to create return with this inventory'
            })
        }
        return res.status(200).json({
            message:'Return saved'
        })
    }else{
        return res.render('Error_403')
    }
    
}