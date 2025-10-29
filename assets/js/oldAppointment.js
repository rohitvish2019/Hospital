function getAppointments(){
    document.getElementById('loader').style.display='block'
    $.ajax({
        url:'/appointments/getByDate/',
        type:'Get',
        data:{
            selectedDate:document.getElementById('selectedDate').value,
        },
        success:function(data){console.log(data.appointments)
            document.getElementById('loader').style.display='none'
            setAppointmentsOnUi(data.appointments)
            
        },
        error:function(data){console.log
            document.getElementById('loader').style.display='none'
        }
    })
    
}

function setAppointmentsOnUi(appointments){
    let date = document.getElementById('selectedDate').value
    let parent = document.getElementById('table-body');
    parent.innerHTML=``;
    for(let i=0;i<appointments.length;i++){
        let child = document.createElement('tr');
        child.innerHTML=
        `
            <th scope="row">${i+1}</th>
            <td>${appointments[i].PatientId.Name}</td>
            <td>${appointments[i].PatientId.Age}</td>
            <td>${appointments[i].PatientId.Gender}</td>
            <td>${appointments[i].PatientId.Mobile}</td>
            <td>${appointments[i].PatientId.Address}</td>
            <td>${appointments[i].Fees}</td>
            <td><a target="_blank" href="/patients/getOldPrescription/${appointments[i].PatientId._id}?date=${date}">Prescription</a></td>
            <td><a target="_blank" href="/visits/oldMedBill/${appointments[i].PatientId._id}?date=${date}">Medical Bill</a></td>
        `
        parent.appendChild(child);
    }
}