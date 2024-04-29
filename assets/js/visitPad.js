
function openExamminationsBox(){
    console.log("Got here")
    document.getElementById('examinationsBox').style.display='block'
}

function closeExamminationsBox(){
    document.getElementById('examinationsBox').style.display='none';
    document.removeEventListener('keydown',)
}
let examinationsInputs = ['Swelling','Tenderness','Bony-Crepts','DNV','ROM','PO2%','BP','XRAY'];
function addNewExaminations(){
    let child = document.createElement('div');
    let pholder = document.getElementById('newExamination').value
    let textValue = document.getElementById('newExaminationsValue').value
    child.innerHTML=
    `
        <input type="email" class="form-control" id="${pholder}" value="${textValue}" placeholder=''>
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

function addNewtests(){
    let child = document.createElement('div');
    let title = document.getElementById('newTest').value
    let result = document.getElementById('newTestValue').value
    child.innerHTML=
    `
        <span style="width: 35%;" class="input-group-text" id="basic-addon3">${title}</span>
        <input type="text" class="form-control" id="basic-url" aria-describedby="basic-addon3 basic-addon4" value="${result}">
    `
    child.classList.add('input-group');
    child.style.marginTop='2%'
    let parent = document.getElementById('testsList')
    parent.insertBefore(child, parent.children[0]);
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
    })
    console.log(data)
}


