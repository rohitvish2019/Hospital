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

function setSavedDataOnUI(data){
    let OEs = data.OEs
    let Tests = data.Tests
    let prescriptions = data.Prescriptions
    console.log("lengt is "+prescriptions.length)
    let Oescontainer = document.getElementById('OEs');
    Oescontainer.innerHTML = `<h6 style="border-bottom:1px dotted blue;margin-bottom:2%;padding-bottom:2%">O/Es</h6>`;
    for(let i=0;i<OEs.length;i++){
        let child = document.createElement('div');
        let testName = OEs[i].split(':')[0]
        let value = OEs[i].split(':')[1]
        if(!value || value == ''){
            continue;
        }else{
            child.innerHTML=
        `
            <label>${testName} :</label>
            <label>${value}</label>
        `
        child.style.marginTop='1%'
        Oescontainer.appendChild(child);
        }
        
    }
    let Testscontainer = document.getElementById('tests');
    Testscontainer.innerHTML = `<h6 style="border-bottom:1px dotted blue;margin-bottom:2%;padding-bottom:2%">Requested Tests</h6>`;
    for(let i=0;i<Tests.length;i++){
        let child = document.createElement('div');
        let testName = Tests[i].split(':')[0]
        let value = Tests[i].split(':')[1]
        child.innerHTML=
        `
            <label>${testName} :</label>
            <label>${value}</label>
        `
        child.style.marginTop='1%'
        Testscontainer.appendChild(child);
    }
    let prescriptionsContainer = document.getElementById('prescriptions');
    prescriptionsContainer.style.marginLeft='2%'
    prescriptionsContainer.style.marginRight='2%'
    prescriptionsContainer.innerHTML=`<h4 style="text-align: center; border-bottom: 2px dotted black; font-weight: bold;">Prescriptions</h4>`
    for(let i=0;i<prescriptions.length;i++){
        let item = prescriptions[i].split(':');
        let child = document.createElement('label');
        child.style.fontSize='medium'
        child.style.marginBottom='2%'
        child.innerHTML=`${i+1} .<b>  ${item[0]} </b> ${item[4]} ${item[2]} for next ${item[3]}`;
        prescriptionsContainer.appendChild(child)
    }
    

    document.getElementById('complaint').innerHTML=
    `
        <h6>Complaint & History</h6>
        <label>${data.Complaint}</label>
    `
}

getSavedData();