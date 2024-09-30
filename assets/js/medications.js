let itemsCount = 0
let prescriptions = []
let total = 0
async function addMedications(isComingFromServer, data){
    let medicine,when,frequency,duration,notes,dosage,qty, CurrentQty, totalQty, alertQty=0;
    let price = new Array()
    let batch = new Array()
    let exp = new Array();
    let quantity = new Array();
    
    let medInfo;
    if(isComingFromServer == true){
        let thisPrescription = data.split(':');
        medicine = thisPrescription[0]
        when = thisPrescription[1],
        frequency = thisPrescription[2]
        duration = thisPrescription[3]
        dosage = thisPrescription[4]
        notes = thisPrescription[5]
        qty = thisPrescription[7]
        price.push(thisPrescription[6])
        batch.push(thisPrescription[8])
        exp.push(thisPrescription[9])

    }else{
        medicine = document.getElementById('Medicine').value
        when = document.getElementById('When').value
        frequency = document.getElementById('Frequency').value
        duration = document.getElementById('Duration').value
        notes = document.getElementById('Notes').value
        dosage = document.getElementById('Dosage').value
        qty = document.getElementById('Qty').value
        //price = document.getElementById('Price').value
        //batch = document.getElementById('Batch').value
        //exp = document.getElementById('Exp').value
        console.log('Getting q info')
        await $.ajax({
            url:'/purchases/getMeds',
            data:{
                Medicine:document.getElementById('Medicine').value
            },
            type:'GET',
            success:function(data){
                if(data.totalQty < qty){
                    new Noty({
                        theme: 'relax',
                        text: 'Stock unavailable',
                        type: 'error',
                        layout: 'topRight',
                        timeout: 1500
                    }).show();
                    return;
                }
                if(!data.medInfo || data.medInfo == null){
                    price = 'NA',
                    batch = 'NA'
                    exp = 'NA'
                }else{
                    totalQty = data.totalQty;
                    alertQty = data.alertQty
                    console.log("Medinfo length is "+data.medInfo.length)
                    for(let i=0;i<data.medInfo.length;i++){
                        console.log("Running loop for "+i)
                        price.push(data.medInfo[i].Price);
                        batch.push(data.medInfo[i].Batch);
                        exp.push(data.medInfo[i].ExpiryDate.split('T')[0]);
                        if(qty > data.medInfo[i].CurrentQty && qty > 0){
                            quantity.push(data.medInfo[i].CurrentQty)
                            qty = qty - data.medInfo[i].CurrentQty
                            
                        }else{
                            quantity.push(qty)
                            break;
                        }
                        
                    }
                }
                
                CurrentQty = Number(data.totalQty);
            },
            error:function(err){console.log(err.responseText)}
        })

    }
    let pname = document.getElementById('name').value
    let page = document.getElementById('age').value
    if(!duration || duration == '' ){
        duration = 'NA'
    }
    if(!pname || pname == ''){
        new Noty({
            theme: 'relax',
            text: ' Patient name is mandatory',
            type: 'error',
            layout: 'topRight',
            timeout: 1500
        }).show();
        return;
    }
    
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
    
    if(!qty || qty == ''){
        new Noty({
            theme: 'relax',
            text: 'Quantity is mandatory',
            type: 'error',
            layout: 'topRight',
            timeout: 1500
        }).show();
        return;
    }
    for(let i=0;i<price.length;i++){
        let child = document.createElement('tr');
        let parent = document.getElementById('prescriptionTableBody');
        if(totalQty <= alertQty){
            child.innerHTML=
        `
            <td>${++itemsCount}</td>
            <td>${medicine}</td>
            <td>${duration}</td>
            <td>${price[i]}</td>
            <td>${quantity[i]}</td>
            <td>${batch[i]}</td>
            <td>${exp[i]}</td>
            <td>${notes}</td>
            <td style='background-color: red;width:10%;color:white;font-weight:bold'>${totalQty}</td>
            <td class='delButton'><img width='25px' height='25px' src="/images/delete.png" onclick='deleteMed(${itemsCount},"${price[i]}",${quantity[i]})' alt=""></td>
        `
        }
        else{
            child.innerHTML=
        `
            <td>${++itemsCount}</td>
            <td>${medicine}</td>
            <td>${duration}</td>
            <td>${price[i]}</td>
            <td>${quantity[i]}</td>
            <td>${batch[i]}</td>
            <td>${exp[i]}</td>
            <td>${notes}</td>
            <td style='width:10%'>${totalQty}</td>
            <td class='delButton'><img width='25px' height='25px' src="/images/delete.png" onclick='deleteMed(${itemsCount},"${price[i]}",${quantity[i]})' alt=""></td>
        `
        }
        child.id='medRow_'+itemsCount
        console.log('Current quantity is '+CurrentQty+ ' and ordered is '+qty)
        if(CurrentQty < qty){
            child.style.backgroundColor='#f3cdcdde'
        }
        if(price[i] && price[i] != '' && price[i] != 'NA'){
            total = total + (price[i] * quantity[i]);
            
        }
        
        document.getElementById('total').innerText=total
        parent.appendChild(child);
        prescriptions.push(medicine+':'+when+':'+frequency+':'+duration+':'+dosage+':'+notes+':'+price[i]+':'+quantity[i]+':'+batch[i]+':'+exp[i]);
        document.getElementById('Medicine').value=''
    }
    
    
    
    
    //document.getElementById('Qty').value=''
}
 
function deleteMed(id, price, qty){
    document.getElementById('medRow_'+id).remove();
    prescriptions[id-1]=''
    if(price && price != '' && price != 'NA'){
        total = total - (price * qty)
    }
    
    document.getElementById('total').innerText=total
}

function savePrescriptions(){
    document.getElementById('savePrescriptions').setAttribute('disabled','disabled')
    document.getElementById('loader').style.display='block'
    let patientId = document.getElementById('patientId').innerText
    console.log(prescriptions)
    $.ajax({
        url:'/patients/add/Prescriptions/'+patientId,
        data:{
            prescriptions,
            discount:document.getElementById('discount').value
        },
        type:'POST',
        success:function(data){
            document.getElementById('loader').style.display='none'
            document.getElementById('savePrescriptions').removeAttribute('disabled')
            window.open('/visits/getMedicalBill/'+data.visitId)
            window.location.href='/appointments/show/today'
        },
        error:function(err){
            console.log(err.responseText);
            document.getElementById('loader').style.display='none'
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



function savePrescriptionsExternal(){
    document.getElementById('savePrescriptions').setAttribute('disabled','disabled')
    document.getElementById('loader').style.display='block'
    console.log(prescriptions)
    $.ajax({
        url:'/receipts/medbill/ext',
        data:{
            prescriptions,
            discount:document.getElementById('discount').value,
            patient:{
                Name:document.getElementById('name').value,
                Gender:document.getElementById('gender').value,
                Address:document.getElementById('address').value,
                Age:document.getElementById('age').value
            }
        },
        type:'POST',
        success:function(data){
            document.getElementById('loader').style.display='none'
            document.getElementById('savePrescriptions').removeAttribute('disabled')
            window.open('/receipts/extMedBill/'+data.receipt)
            window.location.href='/receipts/newMedBill'
        },
        error:function(err){
            console.log(err.responseText);
            document.getElementById('loader').style.display='none'
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