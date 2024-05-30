const Tracker = require('../models/tracker');
const Sales = require('../models/sales')
const Receipts = require('../models/receipts');
const patients = require('../models/patients');
const Inventories = require('../models/inventory')
module.exports.receiptHome = function(req, res){
    return res.render('receiptHome',{role:req.user.role})
}

module.exports.addNewReceipt = async function(req, res){
    let pd, ReceiptNo;
    try{
        pd = await Tracker.findOne({});
        ReceiptNo = Number(pd.ReceiptNo) + 1
    }catch(err){
        console.log(err);
    }
    
    try{
        let receipt = await Receipts.create({
            ReceiptNo: ReceiptNo,
            Name:req.body.patient.Name,
            Age:req.body.patient.Age,
            Gender:req.body.patient.Gender,
            Address:req.body.patient.Address,
            Mobile:req.body.patient.Mobile,
            Items:req.body.items,
            PatientId:req.body.patient.id
        })
        await pd.updateOne({ReceiptNo:ReceiptNo})
        let itemsList = req.body.items
        console.log(req.body)
        let patient = await patients.findOne({PatientId:req.body.patient.id});
        let billAmount = 0
        for(let i=0;i<itemsList.length;i++){
            let splittedArray = itemsList[i].split(':');
            billAmount = billAmount + Number(splittedArray[1] * splittedArray[2])
        }
        await Sales.create({
            BillAmount:billAmount,
            BillType:'Generated Receipt',
            PatientId:patient._id,
            BillLink:'/receipts/gerenate/'+receipt._id,
            SaleDate:new Date().getFullYear() +'-'+ String((Number(new Date().getMonth()) + 1)).padStart(2,'0') +'-'+ String(new Date().getDate()).padStart(2,'0'),
      })
        return res.status(200).json({
            message:'Receipt created',
            receipt:receipt._id
        })
    }catch(err){
        console.log(err)
        return res.status(500).json({
            message:'Unable to create Receipt'
        })
    }
    
}

module.exports.getReceipt = async function(req, res){
    try{
        let receipt = await Receipts.findById(req.params.id);
        return res.render('receiptPDF',{receipt,role:req.user.role})
    }catch(err){
        console.log(err)
        return res.redirect('back')
    }
}


module.exports.getExtMedBill = async function(req, res){
    try{
        let receipt = await Receipts.findById(req.params.id);
        return res.render('extMedBill',{receipt,role:req.user.role})
    }catch(err){
        console.log(err)
        return res.redirect('back')
    }
}

module.exports.finReceiptHome = function(req, res){
    return res.render('findReceipt',{role:req.user.role})
}

module.exports.findReceiptById = async function(req, res){
    try{
        let receipt = await Receipts.find({ReceiptNo:req.query.ReceiptNo});
        return res.status(200).json({
            receipt
        })
    }catch(err){
        return res.status(500).json({
            message:'Unable to find receipts'
        })
    }
}

module.exports.findReceiptByName = async function(req, res){
    console.log(req.query)
    try{
        let receipts = await Receipts.find({
            $and: [
                {createdAt:{$gte :new Date(req.query.startDate)}},
                {createdAt: {$lte : new Date(req.query.endDate)}},
            ]
        });
        return res.status(200).json({
            receipts
        })
    }catch(err){
        console.log(err)
        return res.status(500).json({
            message:'Unable to find receipts'
        })
    }
}

module.exports.newMedSales = async function(req, res){
    let inventory = await Inventories.find({}).distinct('Medicine');
    return res.render('medications_ext', {inventory,role:req.user.role})
}

module.exports.addMedBill = async function(req, res){
    console.log('We are here...')
    let pd, ReceiptNo;
    try{
        pd = await Tracker.findOne({});
        ReceiptNo = Number(pd.ReceiptNo) + 1
    }catch(err){
        console.log(err);
    }
    try{
        let receipt = await Receipts.create({
            ReceiptNo: ReceiptNo,
            Name:req.body.patient.Name,
            Age:req.body.patient.Age,
            Gender:req.body.patient.Gender,
            Address:req.body.patient.Address,
            Mobile:req.body.patient.Mobile,
            Items:req.body.prescriptions,
        })
        await pd.updateOne({ReceiptNo:ReceiptNo})
        let itemsList = req.body.prescriptions
        console.log(req.body)
        let patient = 'NA'
        try{
            patient = await patients.findOne({PatientId:req.body.patient.id});
        }catch(err){
            console.log(err)
        }
        let totalAmount = 0
        let preparedPres = []
        try{
            for(let i=0;i<itemsList.length;i++){
                if(itemsList[i].length > 0){
                    preparedPres.push(itemsList[i])
                    splittedArray = itemsList[i].split(':');
                    totalAmount = totalAmount + (Number(splittedArray[6]) * Number(splittedArray[7]));
                    let deductableQty = Number(splittedArray[7]);
                    let inventory = await Inventories.find({Medicine:splittedArray[0]}).sort('ExpiryDate');
                    let totalAvailableQty = 0
                    for(let i=0;i<inventory.length;i++){
                        totalAvailableQty = totalAvailableQty + Number(inventory[i].CurrentQty);
                    }
                    if(totalAvailableQty >= deductableQty){
                        for(let i=0;i<inventory.length;i++){
                            if(inventory[i].CurrentQty >= deductableQty){
                                    let newQty = inventory[i].CurrentQty - deductableQty
                                    await inventory[i].updateOne({CurrentQty:newQty})
                                    break
                            }else{
                                    deductableQty = deductableQty - inventory[i].CurrentQty
                                    await inventory[i].updateOne({CurrentQty:0});
                            }
                        }
                    }else{
                        return res.status(200).json({
                            message:'Quantity over',
                        })
                    }
                }
            }
            try{
                await Sales.create({
                    BillAmount:totalAmount,
                    BillType:'Medical Bill Ext',
                    PatientName:req.body.patient.Name,
                    BillLink:'/receipts/extMedBill/'+receipt._id,
                    SaleDate:new Date().getFullYear() +'-'+ String((Number(new Date().getMonth()) + 1)).padStart(2,'0') +'-'+ String(new Date().getDate()).padStart(2,'0'),
                })
            }catch(err){
                console.log(err)
                console.log("Unable to add in sales")
            }
        }catch(err){
            console.log("Unable to update inventoreis")
        }
        return res.status(200).json({
            message:'Receipt created',
            receipt:receipt._id
        })
    }catch(err){
        console.log(err)
        return res.status(500).json({
            message:'Unable to create Receipt'
        })
    }
}