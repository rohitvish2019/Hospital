const Tracker = require('../models/tracker');
const Receipts = require('../models/receipts')
module.exports.receiptHome = function(req, res){
    return res.render('receiptHome')
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
        return res.status(200).json({
            message:'Receipt created',
            receipt:receipt._id
        })
    }catch(err){
        return res.status(500).json({
            message:'Unable to create Receipt'
        })
    }
    
}

module.exports.getReceipt = async function(req, res){
    try{
        let receipt = await Receipts.findById(req.params.id);
        return res.render('receiptPDF',{receipt})
    }catch(err){
        console.log(err)
        return res.redirect('back')
    }
}

module.exports.finReceiptHome = function(req, res){
    return res.render('findReceipt')
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