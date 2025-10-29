const Sales = require('../models/sales');
const Appointments = require('../models/appointments');
const Inventories = require('../models/inventory') 
const propertiesReader = require('properties-reader')
const properties = propertiesReader('./configs/domain.properties')
const hostname = properties.get('host')
const port = properties.get('port')
const protocol = properties.get('protocol')
module.exports.salesHistoryHome = function(req, res){
    return res.render('salesHistory',{role:req.user.role})
}

module.exports.getSalesHistoryRange = async function (req, res){
    if(req.user.role == 'Admin'){
        try{
            let sales = await Sales.find({
                $and: [
                    {createdAt:{$gte :new Date(req.query.startDate)}},
                    {createdAt: {$lte : new Date(req.query.endDate)}},
                    {BillType:req.query.BillType, isValid:true}
                ]
            }).populate('PatientId').sort("createdAt");
            return res.status(200).json({
                sales,hostname,port,protocol
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

module.exports.getSalesHistoryDate = async function (req, res){
    if(req.user.role == 'Admin'){
        try{
            let sales = await Sales.find({SaleDate:req.query.selectedDate, BillType:req.query.BillType,isValid:true}).populate('PatientId').sort("createdAt");
            return res.status(200).json({
                sales,hostname,port,protocol
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

module.exports.cancelSalesB = async function(req, res){
    try{
        await Sales.findByIdAndUpdate(req.body.id,{isValid:false,cancellationReason:req.body.reason});
        let sale = await Sales.findById(req.body.id);
        
        if(sale.BillType == 'Registration Fees'){
            console.log("Id is : "+ sale.BillLink)
            if(sale.BillLink[0] == '/'){
                await Appointments.findByIdAndUpdate((sale.BillLink.split('/'))[3],{isCancelled:true});
            }else{
                await Appointments.findByIdAndUpdate((sale.BillLink.split('/'))[2],{isCancelled:true});
            }
            
        }
        return res.status(200).json({
            message:'Sales record cancelled'
        })
    }catch(err){
        console.log(err)
        return res.status(500).json({
            message:'Internal server error'
        })
    }
}
///Record maintinence and data clear apis
module.exports.clearOldSales = async function(req,res){
    try{
        let olderThan = req.body.olderThan
        await Sales.deleteMany({createdAt:{$lt:olderThan}});
        return res.status(200).json({
            message:'Old sales records deleted successfully'
        })
    }catch(err){
        console.log(err)
        return res.status(500).json({
            message:'Unable to delete sales records'
        })
    }
}

module.exports.deleteEmptyInventories = async function(req,res){
    try{
        if(req.user.role =='Admin'){
            try{
                await Inventories.deleteMany({CurrentQty:{$lt:1}});
                return res.status(200).json({
                    message:'Deleted empty inventories'
                });
            }catch(err){
                console.log(err);
                return res.status(500).json({
                    message:'Unable to clear inventories'
                });
            }
        }else{
            return res.status(403).json({
                message:'You are not authorized'
            })
        }
    }catch(err){
        console.log(err);
        return res.status(500).json({
            message:'Internal Server Error'
        })
    }
}