const Tracker = require('../models/tracker');
const Receipts = require('../models/receipts')
module.exports.receiptHome = function(req, res){
    return res.render('receiptHome')
}

module.exports.addNewReceipt = async function(req, res){
    let pd = await Tracker.findOne({});
    let ReceiptNo = Number(pd.ReceiptNo) + 1
    let receipt = await Receipts.create({
        Name:req.body.patient.Name,
        Age:req.body.patient.Age,
        Gender:req.body.patient.Gender,
        Address:req.body.patient.Address,
        Mobile:req.body.patient.Mobile,
        Items:req.body.items,
        PatientId:req.body.patient.id
    })
    console.log(receipt._id)
    return res.status(200).json({
        message:'Receipt created',
        receipt:receipt._id
    })
}

module.exports.getReceipt = async function(req, res){
    let receipt = await Receipts.findById(req.params.id);
    return res.render('receiptPDF',{receipt})
}