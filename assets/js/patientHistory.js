function getPatientHistory(){
    let patientId = document.getElementById('patientId').innerText
    $.ajax({
        url:'/patients/getHistory/'+patientId,
        type:'Get',
        success:function(data){
            console.log(data)
            setPatientHistoryOnUI(data.history)
        },
        error: function(err){console.log(err.responseText)}
    })
}

function setPatientHistoryOnUI(history){
    let container = document.getElementById('patient-history');
    container.innerHTML=``;
    for(let i=0;i<history.length;i++){
        let item = document.createElement('div');
        item.classList.add('one-history');
        item.innerHTML=
        `
        <div class="history-heading">
            <div style="width: 20%;">Complaint</div>
            <div style="width: 20%;"> O/Es</div>
            <div style="width: 20%;">Tests</div>
            <div style="width: 40%;">Prescription (${String(history[i].Date.split('-')[2]).padStart(2,'0')}-${String(history[i].Date.split('-')[1]).padStart(2,'0')}-${history[i].Date.split('-')[0]})</div>
        </div>
        <div class="history-info">
            <div class="complaint">
                <label>${history[i].Complaint}</label>
            </div>
            <div id='oes_${i}' class="oes">
            </div>
            <div class="tests" id='tests_${i}'></div>
            <div class="prescriptions" id='pres_${i}'></div>
        </div>
        `
        container.appendChild(item)
        document.getElementById('oes_'+i).innerHTML=``
        document.getElementById('tests_'+i).innerHTML=``
        document.getElementById('pres_'+i).innerHTML=``
        let OEs = history[i].OEs
        let Tests = history[i].Tests
        let Prescriptions = history[i].Prescriptions
        console.log(document.getElementById('oes_'+i))
        for(let j=0;j<OEs.length;j++){
            let oeItem = document.createElement('div');
            oeItem.innerHTML=`<label style="display:block">${OEs[j]}</label>`
            document.getElementById('oes_'+i).appendChild(oeItem)
        }

        for(let j=0;j<Tests.length;j++){
            let testItem = document.createElement('div');
            testItem.innerHTML=`<label style="display:block">${Tests[j]}</label>`
            document.getElementById('tests_'+i).appendChild(testItem)
        }

        for(let j=0;j<Prescriptions.length;j++){
            let presItem = document.createElement('div');
            presItem.innerHTML=`<label style="display:block">${Prescriptions[j]}</label>`
            document.getElementById('pres_'+i).appendChild(presItem)
        }


        
    }
}
getPatientHistory()