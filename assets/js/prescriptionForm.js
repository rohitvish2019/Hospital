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
    let Oescontainer = document.getElementById('OEs');
    Oescontainer.innerHTML = `<h5 style="border-bottom:1px dotted blue;margin-bottom:2%;padding-bottom:2%">O/Es</h5>`;
    for(let i=0;i<OEs.length;i++){
        let child = document.createElement('div');
        let testName = OEs[i].split(':')[0]
        let value = OEs[i].split(':')[1]
        child.innerHTML=
        `
            <label>${testName} :</label>
            <label>${value}</label>
        `
        child.style.marginTop='1%'
        Oescontainer.appendChild(child);
    }
    let Testscontainer = document.getElementById('tests');
    Testscontainer.innerHTML = `<h5 style="border-bottom:1px dotted blue;margin-bottom:2%;padding-bottom:2%">Requested Tests</h5>`;
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

    document.getElementById('complaint').innerHTML=
    `
        <h5>Complaint</h5>
        <label>${data.Complaint}</label>
    `
}

getSavedData();