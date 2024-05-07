let itemsCount = 0
let prescriptions = []
async function addMedications(isComingFromServer, data){
    let medicine,when,frequency,duration,notes,dosage,price,qty,batch,exp, CurrentQty;
    let medInfo;
    if(isComingFromServer == true){
        let thisPrescription = data.split(':');
        medicine = thisPrescription[0]
        when = thisPrescription[1],
        frequency = thisPrescription[2]
        duration = thisPrescription[3]
        dosage = thisPrescription[4]
        notes = thisPrescription[5]
        price = thisPrescription[6]
        qty = thisPrescription[7]
        batch = thisPrescription[8]
        exp = thisPrescription[9]
    }else{
        medicine = document.getElementById('Medicine').value
        when = document.getElementById('When').value
        frequency = document.getElementById('Frequency').value
        duration = document.getElementById('Duration').value
        notes = document.getElementById('Notes').value
        dosage = document.getElementById('Dosage').value
        //price = document.getElementById('Price').value
        qty = document.getElementById('Qty').value
        //batch = document.getElementById('Batch').value
        //exp = document.getElementById('Exp').value
        console.log('Getting q info')
        await $.ajax({
            url:'/purchases/getMedInfo',
            data:{
                Medicine:document.getElementById('Medicine').value
            },
            type:'GET',
            success:function(data){
                console.log("QTY!"+data.totalQty)
                price = data.medInfo.Price,
                batch = data.medInfo.Batch
                exp = data.medInfo.ExpiryDate.split('T')[0]
                CurrentQty = Number(data.totalQty);
            },
            error:function(err){console.log(err.responseText)}
        })

    }
    console.log
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
        <td>${price}</td>
        <td>${qty}</td>
        <td>${batch}</td>
        <td>${exp}</td>
        <td>${notes}</td>
        <td class='delButton'><img width='25px' height='25px' src="/images/delete.png" onclick="deleteMed(${itemsCount})" alt=""></td>
    `
    child.id='medRow_'+itemsCount
    if(CurrentQty < qty){
        child.style.backgroundColor='#f3cdcdde'
    }
    parent.appendChild(child);
    prescriptions.push(medicine+':'+when+':'+frequency+':'+duration+':'+dosage+':'+notes+':'+price+':'+qty+':'+batch+':'+exp);
}
 
function deleteMed(id){
    document.getElementById('medRow_'+id).remove();
    prescriptions[id-1]=''
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
        error:function(err){
            console.log(err.responseText);
            new Noty({
                theme: 'relax',
                text: JSON.parse(err.responseText).message,
                type: 'error',
                layout: 'topRight',
                timeout: 1500
            }).show();
            return;
        }
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