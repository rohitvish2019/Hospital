function makePatientInputsDisabled(){
    document.getElementById('Pname').setAttribute('readonly','true')
    document.getElementById('Age').setAttribute('readonly','true')
    document.getElementById('Gender').setAttribute('readonly','true')
    document.getElementById('Address').setAttribute('readonly','true')
    document.getElementById('mob').setAttribute('readonly','true')
}
function makeSerachIdDisabled(){
    document.getElementById('idToSearch').setAttribute('disabled', 'true')
    document.getElementById('searchButton').setAttribute('disabled', 'true')
}
function makePatientInputsEnabled(){
    document.getElementById('Pname').removeAttribute('readonly')
    document.getElementById('Age').removeAttribute('readonly')
    document.getElementById('Gender').removeAttribute('readonly')
    document.getElementById('Address').removeAttribute('readonly')
    document.getElementById('mob').removeAttribute('readonly')
}

function makeSerachIdEnabled(){
    document.getElementById('idToSearch').removeAttribute('disabled')
    document.getElementById('searchButton').removeAttribute('disabled')
}
function changePatientDataInputs(){
    if(document.getElementById('searchType_id').checked){
        makePatientInputsDisabled()
        makeSerachIdEnabled()
    }else{
        makeSerachIdDisabled()
        makePatientInputsEnabled()
    }
}
let itemsCount = 0;
let items =[]
function addItem(){
    let Item, Price,Qty,Pdate,Edate
    Item = document.getElementById('Item').value
    Price = document.getElementById('price').value
    Qty = document.getElementById('Qty').value
    Pdate = document.getElementById('Pdate').value
    Edate = document.getElementById('Edate').value
    if(!Item || Item == ''){
        new Noty({
            theme: 'relax',
            text: 'Item name is mandatory',
            type: 'error',
            layout: 'topRight',
            timeout: 1500
        }).show();
        return
    }
    if(!Price || Price == ''){
        new Noty({
            theme: 'relax',
            text: 'Price is mandatory',
            type: 'error',
            layout: 'topRight',
            timeout: 1500
        }).show();
        return
    }
    if(!Qty || Qty == ''){
        new Noty({
            theme: 'relax',
            text: 'Quantity is mandatory',
            type: 'error',
            layout: 'topRight',
            timeout: 1500
        }).show();
        return
    }
    let container = document.getElementById('itemsTableBody');
    let rowItem = document.createElement('tr');
    rowItem.id = 
    rowItem.innerHTML=
    `
        <td>${++itemsCount}</td>
        <td>${Item}</td>
        <td>${Price}</td>
        <td>${Qty}</td>
        <td>${Pdate}</td>
        <td>${Edate}</td>
        <td>${Price*Qty}</td>
    `
    container.appendChild(rowItem);
    let item = Item+':'+Price+':'+Qty+':'+Pdate+':'+Edate;
    items.push(item)
}

function deleteItem(){

}
function searchById(){
    let id = document.getElementById('idToSearch').value;
    $.ajax({
        url:'/patients/get/'+id,
        type:'Get',
        success:function(data){
            console.log(data.patient[0].PatientId.Name);
            new Noty({
                theme: 'relax',
                text: 'Patient data setup done',
                type: 'success',
                layout: 'topRight',
                timeout: 1500
            }).show();
            document.getElementById('Pname').value=data.patient[0].PatientId.Name
            document.getElementById('Age').value = data.patient[0].PatientId.Age
            document.getElementById('Gender').value = data.patient[0].PatientId.Gender
            document.getElementById('Address').value = data.patient[0].PatientId.Address
            document.getElementById('mob').value = data.patient[0].PatientId.Mobile
            
        },
        error:function(err){
            new Noty({
                theme: 'relax',
                text: 'No pateint found, Please check again or register new',
                type: 'warning',
                layout: 'topRight',
                timeout: 1500
            }).show();
            for(let i=0;i<inputData.length;i++){
                if(document.getElementById(inputData[i])){
                    document.getElementById(inputData[i]).value = '';
                }
            }
            document.getElementById('bookAppointment').setAttribute('disabled','true');
            document.getElementById('register').removeAttribute('disabled');
        }
    })
}
changePatientDataInputs()

function saveReceiptData(){
    let id, Name, Age, Gender, Address, Mobile
    id = document.getElementById('idToSearch').value
    Name = document.getElementById('Pname').value
    Age = document.getElementById('Age').value
    Gender = document.getElementById('Gender').value
    Address = document.getElementById('Address').value
    Mobile = document.getElementById('mob').value
    if(!Name || Name == ''){
        new Noty({
            theme: 'relax',
            text: 'Patient name is mandatory',
            type: 'error',
            layout: 'topRight',
            timeout: 1500
        }).show();
        return
    }
    if( !Age || Age == ''){
        new Noty({
            theme: 'relax',
            text: 'Age is mandatory',
            type: 'error',
            layout: 'topRight',
            timeout: 1500
        }).show();
        return
    }
    if(!Gender || Gender == ''){
        new Noty({
            theme: 'relax',
            text: 'Gender is mandatory',
            type: 'error',
            layout: 'topRight',
            timeout: 1500
        }).show();
        return
    }
    if(!items || items.length < 1){
        new Noty({
            theme: 'relax',
            text: 'No items to generate bill',
            type: 'error',
            layout: 'topRight',
            timeout: 1500
        }).show();
        return
    }
    document.getElementById('loader').style.display='block'
    $.ajax({
        url:'/receipts/save',
        type:'Post',
        data:{
            patient:{
                id, 
                Name, 
                Age, 
                Gender, 
                Address, 
                Mobile
            },
            items
        },
        success:function(data){
            document.getElementById('loader').style.display='none'
            console.log(data)
            setTimeout(function(err){
                window.open('/receipts/gerenate/'+data.receipt)
                window.location.href='/receipts/home'
            }, 1000)

        },
        error:function(err){console.log(err.responseText)}
    })
}