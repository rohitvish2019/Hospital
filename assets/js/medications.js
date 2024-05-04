let itemsCount = 0
let prescriptions = []
function addMedications(isComingFromServer, data){
    let medicine,when,frequency,duration,notes,dosage;
    if(isComingFromServer == true){
        let thisPrescription = data.split(':');
        medicine = thisPrescription[0]
        when = thisPrescription[1],
        frequency = thisPrescription[2]
        duration = thisPrescription[3]
        dosage = thisPrescription[4]
        notes = thisPrescription[5]
    }else{
        medicine = document.getElementById('Medicine').value
        when = document.getElementById('When').value
        frequency = document.getElementById('Frequency').value
        duration = document.getElementById('Duration').value
        notes = document.getElementById('Notes').value
        dosage = document.getElementById('Dosage').value
    }
    
    let child = document.createElement('tr');
    let parent = document.getElementById('prescriptionTableBody');
    
    if(!medicine || medicine == ''){
        new Noty({
            theme: 'relax',
            text: 'Medicine name is mandatory',
            type: 'error',
            layout: 'topRight',
            timeout: 1500
        }).show();
        return;
    }
    if(!dosage || dosage == ''){
        new Noty({
            theme: 'relax',
            text: 'Medicine dosage is mandatory',
            type: 'error',
            layout: 'topRight',
            timeout: 1500
        }).show();
        return;
    }
    if(!when || when == ''){
        new Noty({
            theme: 'relax',
            text: 'Medicine time is mandatory',
            type: 'error',
            layout: 'topRight',
            timeout: 1500
        }).show();
        return;
    }
    if(!frequency || frequency == ''){
        new Noty({
            theme: 'relax',
            text: 'Frequency is mandatory',
            type: 'error',
            layout: 'topRight',
            timeout: 1500
        }).show();
        return;
    }
    if(!duration || duration == ''){
        new Noty({
            theme: 'relax',
            text: 'Duration is mandatory',
            type: 'error',
            layout: 'topRight',
            timeout: 1500
        }).show();
        return;
    }
    
    child.innerHTML=
    `
        <td>${++itemsCount}</td>
        <td>${medicine}</td>
        <td>${dosage}</td>
        <td>${when}</td>
        <td>${frequency}</td>
        <td>${duration}</td>
        <td>${notes}</td>
        
    `
    parent.appendChild(child);
    prescriptions.push(medicine+':'+when+':'+frequency+':'+duration+':'+dosage+':'+notes);
}

function savePrescriptions(){
    let patientId = document.getElementById('patientId').innerText
    console.log(prescriptions)
    $.ajax({
        url:'/patients/add/Prescriptions/'+patientId,
        data:{
            prescriptions,
        },
        type:'POST',
        success:function(data){
            window.location.href='/visits/getMedicalBill/'+data.visitId
        },
        error:function(err){console.log(err.responseText)}
    })
}

function getPrescriptions(){
    $.ajax({
        url:'/patients/getPrescriptions',
        type:'Get',
        data:{
            patientId:document.getElementById('patientId').innerText,
        },
        success:function(data){setSavedPrescriptionsOnUI(data.savedData)},
        error:function(err){
            new Noty({
                theme: 'relax',
                text: JSON.parse(err.responseText).message,
                type: 'error',
                layout: 'topRight',
                timeout: 1500
            }).show();
        }
    })
}

function setSavedPrescriptionsOnUI(data){
    for(let i=0;i<data.length;i++){
        addMedications(true, data[i]);
    }
}

getPrescriptions()