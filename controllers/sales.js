const Sales = require('../models/sales')
const propertiesReader = require('properties-reader')
const properties = propertiesReader('./configs/domain.properties')
const hostname = properties.get('host')
const port = properties.get('port')
const protocol = properties.get('protocol')
module.exports.salesHistoryHome = function(req, res){
    return res.render('salesHistory')
}

module.exports.getSalesHistoryRange = async function (req, res){
    console.log(req.query)
    try{
        let sales = await Sales.find({
            $and: [
                {createdAt:{$gte :new Date(req.query.startDate)}},
                {createdAt: {$lte : new Date(req.query.endDate)}}
            ]
        }).populate('PatientId').sort('createdAt');
        return res.status(200).json({
            sales,hostname,port,protocol
        })
    }catch(err){
        console.log(err)
        return res.status(500).json({
            message:'Unable to fetch purchase history'
        })
    }
}

module.exports.getSalesHistoryDate = async function (req, res){
    console.log(req.query.selectedDate);
    try{
        let sales = await Sales.find({SaleDate:req.query.selectedDate}).populate('PatientId','Name').sort('createdAt');
        return res.status(200).json({
            sales,hostname,port,protocol
        })
    }catch(err){
        console.log(err)
        return res.status(500).json({
            message:'Unable to fetch purchase history'
        })
    }
}