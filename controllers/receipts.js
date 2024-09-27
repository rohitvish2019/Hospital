const Tracker = require('../models/tracker');
const Sales = require('../models/sales');
const Visits = require('../models/visits')
const Appointments = require('../models/appointments')
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
        let patient = await patients.findOne({PatientId:req.body.patient.id})
        let receipt;
        if(patient){
            receipt = await Receipts.create({
                ReceiptNo: ReceiptNo,
                Name:req.body.patient.Name,
                Age:req.body.patient.Age,
                Gender:req.body.patient.Gender,
                Address:req.body.patient.Address,
                Mobile:req.body.patient.Mobile,
                Items:req.body.items,
                PatientId:req.body.patient.id
            })
        }else{
            let newPid = Number(pd.PatientId) + 1
            patient = await patients.create({
                Name:req.body.patient.Name,
                Age:req.body.patient.Age,
                Gender:req.body.patient.Gender,
                Address:req.body.patient.Address,
                Mobile:req.body.patient.Mobile,
                PatientId:newPid
            })
            receipt = await Receipts.create({
                ReceiptNo: ReceiptNo,
                Name:req.body.patient.Name,
                Age:req.body.patient.Age,
                Gender:req.body.patient.Gender,
                Address:req.body.patient.Address,
                Mobile:req.body.patient.Mobile,
                Items:req.body.items,
                PatientId:newPid
            })
            await pd.updateOne({PatientId:newPid})

        }
        await pd.updateOne({ReceiptNo:ReceiptNo})
        let itemsList = req.body.items
        console.log(req.body)
        
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
        let patient = 'NA'
        try{
            patient = await patients.findOne({PatientId:req.body.patient.id});
        }catch(err){
            console.log(err)
        }
        let totalAmount = 0
        let preparedPres = []
        console.log("Total prescriptions count: "+itemsList.length)
        try{
            for(let i=0;i<itemsList.length;i++){
                if(itemsList[i].length > 0){
                    preparedPres.push(itemsList[i])
                    splittedArray = itemsList[i].split(':');
                    totalAmount = totalAmount + (Number(splittedArray[6]) * Number(splittedArray[7]));
                    let deductableQty = Number(splittedArray[7]);
                    let inventory = await Inventories.findOne({Medicine:splittedArray[0], Batch:splittedArray[8], CurrentQty:{$gt:0}}).sort('ExpiryDate');
                    let totalAvailableQty = inventory.CurrentQty;
                    await inventory.updateOne({CurrentQty:totalAvailableQty-deductableQty})
                }
            }
            try{
                console.log("Creating sales")
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
            console.log(err);
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


module.exports.getMedsByLink = async function(req, res){
    try{
        let linkItems = String(req.query.link).split('/');
        let items, items2
        console.log(linkItems)
        console.log("id is "+linkItems[2])
        if(linkItems[2] == 'getMedicalBill'){
            console.log(1)
            items = await Visits.findById(linkItems[3]);
            items2 = items.Prescriptions
        }else if(linkItems[2] == 'receipt'){
            //items = await Appointments.findById(req.params.id).populate('PatientId');
            items2 = null
            console.log(2)
        }else if(linkItems[2] == 'gerenate'){
            items = await Receipts.findById(linkItems[3])
            items2 = items.Items
            console.log(3)
        }else if(linkItems[2] == 'extMedBill'){
            items = await Receipts.findById(linkItems[3])
            items2 = items.Items
            console.log(4)
        }else{
            items = null
            console.log(5)
        }
        return res.status(200).json({
            items:items2
        })
    }catch(err){
        console.log(err)
        return res.status(500).json({
            message:'Unable to fetch items'
        })
    }
}