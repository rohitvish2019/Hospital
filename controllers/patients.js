const propertiesReader = require('properties-reader');
module.exports.addNewPatient = function(req, res){

}

module.exports.linkPatients = function(req, res){

}

module.exports.updatePatientData = function(req, res){
    
}

module.exports.newVisit =  function(req, res){
      let properties = propertiesReader('./properties/UIdata.properties');
      let OE = properties.get('OnExaminations').split(',');
      return res.render('visitPad',{OE})
}