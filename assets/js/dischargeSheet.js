let medIds = 15
let prescriptions=[]
function addPrescriptions(){
    let medname = document.getElementById('medname').value;
    let container = document.getElementById('medsList');
    let item = document.createElement('tr');
    item.id=medIds+'_row'
    item.style.marginTop='.3%'
    item.style.marginLeft='2%'

    item.innerHTML=
    `   
        <td style="width: 47%;"><label id=${medIds} style="width: 100%;" type="text" value=''>${medname}</label></td>
        <td style="width: 47%;"><input id ='${medIds}_dosage'></td>
        <td><img src='/images/delete.png' height='70%' width='70%' onclick='deletePres("${medIds}")'></td>
    `
    prescriptions.push(String(medIds))
    medIds++
    container.appendChild(item)
    document.getElementById('medname').value=''
}
function deletePres(id){
    document.getElementById(id+'_row').remove();
    console.log("Id is "+id)
    let index = prescriptions.indexOf(id,0);
    console.log("Index is  "+index)
    prescriptions.splice(index,1)
}
let id = document.getElementById('patientId').innerText
function saveAdmissionDate(){
    console.log("Sending Id "+id)
    $.ajax({
        url:'/patients/admittedPatients/saveData',
        data:{
            id,
            element:'AdmissionDate',
            AdmissionDate:document.getElementById('AdmissionDate').value,
        },
        type:'Post',
        success:function(data){console.log(data.message)},
        error:function(err){console.log(err.responseText)}
    })
}

function saveOperationDate(){
    $.ajax({
        url:'/patients/admittedPatients/saveData',
        data:{
            id,
            element:'OperationDate',
            OperationDate:document.getElementById('OperationDate').value,
        },
        type:'Post',
        success:function(data){console.log(data.message)},
        error:function(err){console.log(err.responseText)}
    })
}

function saveDischargeDate(){
    $.ajax({
        url:'/patients/admittedPatients/saveData',
        data:{
            id,
            element:'DischargeDate',
            DischargeDate:document.getElementById('DischargeDate').value,
        },
        type:'Post',
        success:function(data){console.log(data.message)},
        error:function(err){console.log(err.responseText)}
    })
}

function saveAllegedHistory(){
    $.ajax({
        url:'/patients/admittedPatients/saveData',
        data:{
            id,
            element:'AllegedHistory',
            AllegedHistory:document.getElementById('AllegedHistory').value,
        },
        type:'Post',
        success:function(data){console.log(data.message)},
        error:function(err){console.log(err.responseText)}
    })
}

function savePrimaryTreatment(){
    $.ajax({
        url:'/patients/admittedPatients/saveData',
        data:{
            id,
            element:'PrimaryTreatment',
            PrimaryTreatment:document.getElementById('PrimaryTreatment').value,
        },
        type:'Post',
        success:function(data){console.log(data.message)},
        error:function(err){console.log(err.responseText)}
    })
}



function saveXrayFindings(){
    $.ajax({
        url:'/patients/admittedPatients/saveData',
        data:{
            id,
            element:'XrayFindings',
            XrayFindings:document.getElementById('XrayFindings').value,
        },
        type:'Post',
        success:function(data){console.log(data.message)},
        error:function(err){console.log(err.responseText)}
    })
}

function saveAdmissionNotes(){
    $.ajax({
        url:'/patients/admittedPatients/saveData',
        data:{
            id,
            element:'AdmissionNotes',
            AdmissionNotes:document.getElementById('AdmissionNotes').value,
        },
        type:'Post',
        success:function(data){console.log(data.message)},
        error:function(err){console.log(err.responseText)}
    })
}

function saveComplications(){
    $.ajax({
        url:'/patients/admittedPatients/saveData',
        data:{
            id,
            element:'Complications',
            Complications:document.getElementById('Complications').value,
        },
        type:'Post',
        success:function(data){console.log(data.message)},
        error:function(err){console.log(err.responseText)}
    })
}

function saveOtherData(){
    let OEs={
        "Swelling":document.getElementById("Swelling").value,
        "Tenderness":document.getElementById("Tenderness").value,
        "BodyCrepts":document.getElementById("Body-Crepts").value,
        "DNV":document.getElementById("DNV").value,
        "ROM":document.getElementById("ROM").value,
        "PO2":document.getElementById("PO2").value,
        "BP":document.getElementById("BP").value,
        "Others":document.getElementById("Others").value
    }
    let preparedPres = new Array();
    console.log(prescriptions.length)
    for(let i=0;i<prescriptions.length;i++){
        preparedPres.push(document.getElementById(prescriptions[i]).innerText+":"+ document.getElementById(prescriptions[i]+'_dosage').value);
    }
    console.log(preparedPres)
    $.ajax({
        url:'/patients/admittedPatients/saveData',
        data:{
            id,
            element:'others',
            OEs,
            prescriptions:preparedPres
        },
        type:'Post',
        success:function(data){console.log(data.message)},
        error:function(err){console.log(err.responseText)}
    })
    disableEditing()
}

function enableEditing(){
    document.getElementById('CancelButton').style.display='block'
    document.getElementById('SaveButton').style.display='block'
    
    document.getElementById('AdmissionDate').style.display='inline'
    document.getElementById('DischargeDate').style.display='inline'
    document.getElementById('OperationDate').style.display='inline'

    document.getElementById('AdmissionDateLabel').style.display='none'
    document.getElementById('DischargeDateLabel').style.display='none'
    document.getElementById('OperationDateLabel').style.display='none'
    
    document.getElementById('AllegedHistory').style.height='100px'
    document.getElementById('AllegedHistory').removeAttribute('readonly')
    document.getElementById('PrimaryTreatment').style.height='100px'
    document.getElementById('PrimaryTreatment').removeAttribute('readonly')

    document.getElementById('XrayFindings').style.height='100px'
    document.getElementById('XrayFindings').removeAttribute('readonly')

    document.getElementById('PrimaryTreatment').style.height='90px'
    document.getElementById('PrimaryTreatment').removeAttribute('readonly')

    document.getElementById('AdmissionNotes').style.height='90px'
    document.getElementById('AdmissionNotes').removeAttribute('readonly')

    document.getElementById('Complications').style.height='90px'
    document.getElementById('Complications').removeAttribute('readonly')

    document.getElementById('medInputs').style.display='flex'
    
}

function disableEditing(){
    document.getElementById('CancelButton').style.display='none'
    document.getElementById('SaveButton').style.display='none'

    document.getElementById('AdmissionDate').style.display='none'
    document.getElementById('DischargeDate').style.display='none'
    document.getElementById('OperationDate').style.display='none'

    document.getElementById('AdmissionDateLabel').style.display='inline'
    document.getElementById('DischargeDateLabel').style.display='inline'
    document.getElementById('OperationDateLabel').style.display='inline'

    document.getElementById('AllegedHistory').style.height='160px'
    document.getElementById('AllegedHistory').setAttribute('readonly','readonly')

    document.getElementById('PrimaryTreatment').style.height='160px'
    document.getElementById('PrimaryTreatment').setAttribute('readonly','readonly')

    document.getElementById('XrayFindings').style.height='160px'
    document.getElementById('XrayFindings').setAttribute('readonly','readonly')

    document.getElementById('AdmissionNotes').style.height='160px'
    document.getElementById('AdmissionNotes').setAttribute('readonly','readonly')

    document.getElementById('Complications').style.height='160px'
    document.getElementById('Complications').setAttribute('readonly','readonly')

    document.getElementById('medInputs').style.display='none'
    
    
    
}

document.addEventListener('keyup',function(event){
    if(event.code=='Slash'){
        enableEditing()
    }
})