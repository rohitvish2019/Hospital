function openExamminationsBox(){
    console.log("Got here")
    document.getElementById('examinationsBox').style.display='block'
}

function closeExamminationsBox(){
    document.getElementById('examinationsBox').style.display='none';
    document.removeEventListener('keydown',)
}
let examinationsInputs = ['Swelling','Tenderness','Bony-Crepts','DNV','ROM','PO2%','BP','XRAY'];
function addNewExaminations(isComingfromServer, title, text){
    console.log(isComingfromServer);
    let pholder, textValue, bgColor;
    let child = document.createElement('div');
    if(isComingfromServer != true){
        pholder = document.getElementById('newExamination').value;
        textValue = document.getElementById('newExaminationsValue').value;
        bgColor = '#fd84561c'
    }else{
        pholder = title;
        textValue = text;
        bgColor = '#71fbaf1c'
    }
    child.innerHTML=
    `
        <input style="background-color:${bgColor};" type="email" class="form-control" id="${pholder}" value="${textValue}" placeholder=''>
        <label for="${pholder}">${pholder}</label>
    `
    child.classList.add("form-floating")
    child.classList.add("test-data")
    child.classList.add("mb2");
    child.style.marginBottom = '1.2%'
    let parent = document.getElementById('examintionsList');
    parent.insertBefore(child, parent.children[0]);
    examinationsInputs.push(pholder);
    document.getElementById('examinationsBox').style.display='none'
}


function opentestsBox(){
    console.log("Got here")
    document.getElementById('testsBox').style.display='block';
    
}

function closetestsBox(){
    document.getElementById('testsBox').style.display='none'
}
let testInputs = [];
function addNewtests(isComingfromServer, label, value){
    let child = document.createElement('div');
    let title, result, bgColor;
    if(isComingfromServer != true){
        title = document.getElementById('newTest').value
        result = document.getElementById('newTestValue').value
        bgColor = '#fd84561c'
    }else{
        title = label
        result = value
        bgColor = '#71fbaf1c'
    }
    
    child.innerHTML=
    `
        <span style="width: 35%; background-color:${bgColor};" class="input-group-text" id="basic-addon3">${title}</span>
        <input style="background-color:${bgColor};" type="text" class="form-control" id="${title}" aria-describedby="basic-addon3 basic-addon4" value="${result}">
    `
    child.classList.add('input-group');
    child.style.marginTop='2%'
    let parent = document.getElementById('testsList')
    parent.insertBefore(child, parent.children[0]);
    testInputs.push(title);
    document.getElementById('testsBox').style.display='none'
}

function addNewPrescription(){
    let child = document.createElement('div');
    child.innerHTML=
    `
        <input style="width: 30%;" type="text" value="Drug name">
        <select name="" id="">
            <option value="">Once</option>
            <option value="">Twice</option>
            <option value="">Thrice</option>
            <option value="">Four times</option>
        </select>
        <select name="" id="">
            <option value="">one</option>
            <option value="">half</option>
            <option value="">quarter</option>
            <option value="">2</option>
            <option value="">3</option>
            <option value="">4</option>
            <option value="">5</option>
        </select>
        <input style="width: 15%;" type="number">
    `
    document.getElementById('prescriptionsList').appendChild(child);
}
document.onkeydown = function(evt) {
    if (!evt) evt = event;
    if (evt.altKey && evt.key === 'o') {
        openExamminationsBox()
    }
    if (evt.altKey && evt.key === 'p') {
        console.log('Alt + P pressed');
        // Your custom logic here...
    }
    if (evt.altKey && evt.key === 't') {
        opentestsBox()
    }
}

function saveExaminations(){
    let data = {};
    let patientId = document.getElementById('patientId').innerText;
    for(let i=0;i<examinationsInputs.length;i++){
        if(document.getElementById(examinationsInputs[i])){
            data[examinationsInputs[i]] = document.getElementById(examinationsInputs[i]).value
        }
    }
    $.ajax({
        type:'POST',
        url:'/patients/add/Examinations/'+patientId,
        data:data,
        success:function(data){
            new Noty({
                theme: 'relax',
                text: data.message,
                type: 'success',
                layout: 'topRight',
                timeout: 1500
            }).show();
            getSavedData();
        },
        error: function(err){
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

function saveComplaint(){
    let patientId = document.getElementById('patientId').innerText;
    $.ajax({
        type:'POST',
        url:'/patients/add/Complaint/'+patientId,
        data:{Complaint:document.getElementById('complaintBox').value},
        success:function(data){
            new Noty({
                theme: 'relax',
                text: data.message,
                type: 'success',
                layout: 'topRight',
                timeout: 1500
            }).show();
            getSavedData();
        },
        error: function(err){
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

function saveTests(){
    let data = {};
    let patientId = document.getElementById('patientId').innerText;
    for(let i=0;i<testInputs.length;i++){
        if(document.getElementById(testInputs[i])){
            data[testInputs[i]] = document.getElementById(testInputs[i]).value
        }
    }
    $.ajax({
        type:'POST',
        url:'/patients/add/Tests/'+patientId,
        data:data,
        success:function(data){
            new Noty({
                theme: 'relax',
                text: data.message,
                type: 'success',
                layout: 'topRight',
                timeout: 1500
            }).show();
            getSavedData();
        },
        error: function(err){
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


function setSavedDataOnUI(data){
    if(data.OEs.length > 0){
        document.getElementById('examintionsList').innerHTML = ``;
        for(let i=0;i<data.OEs.length;i++){
            let title = data.OEs[i].split(':')[0]
            let value = data.OEs[i].split(':')[1]
            addNewExaminations(true, title, value);
        }
    }

    if(data.Tests.length > 0){
        document.getElementById('testsList').innerHTML = ``;
        for(let i=0;i<data.Tests.length;i++){
            let title = data.Tests[i].split(':')[0]
            let value = data.Tests[i].split(':')[1]
            addNewtests(true, title, value);
        }
    } 
    document.getElementById('complaintBox').innerText= data.Complaint; 
}
function getSavedData(){
    $.ajax({
        url:'/patients/getSavedData',
        type:'Get',
        data:{
            patientId:document.getElementById('patientId').innerText,
        },
        success:function(data){setSavedDataOnUI(data.savedData)},
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
getSavedData();


async function saveAll(patientId){
    await saveComplaint();
    await saveExaminations();
    await saveTests();
    setTimeout(function(){window.location.href='/patients/getPrescriptionForm/'+patientId;}, 2000)
    
}
let prescriptions=[]
let medIds = 15
function addPrescriptions(){
    let medname = document.getElementById('medname').value;
    let container = document.getElementById('medsList');
    let item = document.createElement('tr');
    item.id=medIds+'_row'
    item.style.marginTop='1%'
    item.innerHTML=
    `
        <td style="width: 47%;"><label id=${medIds} style="width: 100%;" type="text" value=''>${medname}</label></td>
        <td style="width: 47%;"><input id ='${medIds}_dosage'></td>
        <td><img src='/images/delete.png' height='100%' width='100%' onclick='deletePres("${medIds}")'></td>
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

function savePres(){
    let items=[]
    for(let i=0;i<prescriptions.length;i++){
        console.log("Id is "+prescriptions[i])
        let item = document.getElementById(prescriptions[i]).innerText +" "+ document.getElementById(prescriptions[i]+'_dosage').value;
        items.push(item)
    }
    let pid = document.getElementById('patientId').innerText;
    console.log("Almost here")
    $.ajax({
        url:'/patients/save/Prescriptions/'+pid,
        data:{items},
        type:'Post',
        success:function(data){
            new Noty({
                theme: 'relax',
                text: data.message,
                type: 'success',
                layout: 'topRight',
                timeout: 1500
            }).show();
        },
        error:function(err){
            new Noty({
                theme: 'relax',
                text: 'Unable to update prescriptions',
                type: 'error',
                layout: 'topRight',
                timeout: 1500
            }).show();
        }
    })
    console.log("Saveing below items");
    console.log(items)
}