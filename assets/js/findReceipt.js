document.getElementById('searchValue').setAttribute('disabled','true')
function changeInputs(){
    if(document.getElementById('search_id').checked){
        document.getElementById('startDate').setAttribute('disabled','true')
        document.getElementById('endDate').setAttribute('disabled','true')
        document.getElementById('searchValue').removeAttribute('disabled')
    }else{
        document.getElementById('startDate').removeAttribute('disabled')
        document.getElementById('endDate').removeAttribute('disabled')
        document.getElementById('searchValue').setAttribute('disabled','true')
    }
}
function getReceipts(){
    if(document.getElementById('search_id').checked){
        console.log('Searching by id')
        getReceiptsById()
    }
    if(document.getElementById('search_name').checked){
        console.log('Searching by name')
        getReceiptsByName()
    }
}

function getReceiptsByName(){
    let name, startDate, endDate
    name = document.getElementById('searchValue').value
    startDate = document.getElementById('startDate').value
    endDate = document.getElementById('endDate').value
    let days = (new Date(endDate).getTime() - new Date(startDate).getTime())/(60*24*60*1000)
    if(!startDate || startDate == null || startDate == ''){
        new Noty({
            theme: 'relax',
            text: 'Start date is mandatory',
            type: 'error',
            layout: 'topRight',
            timeout: 1500
        }).show();
        return
    }
    if(!endDate || endDate == null || endDate == ''){
        new Noty({
            theme: 'relax',
            text: 'End date is mandatory',
            type: 'error',
            layout: 'topRight',
            timeout: 1500
        }).show();
        return
    }
    if(startDate > endDate){
        new Noty({
            theme: 'relax',
            text: 'Start date is greater',
            type: 'error',
            layout: 'topRight',
            timeout: 1500
        }).show();
        return
    }

    if( days > 31){
        new Noty({
            theme: 'relax',
            text: 'Max 1 Month allowed',
            type: 'error',
            layout: 'topRight',
            timeout: 1500
        }).show();
        return
    }
    document.getElementById('loader').style.display='block'
    $.ajax({
        url:'/receipts/findByName',
        type:'Get',
        data:{
            name,
            startDate,
            endDate
        },
        success:function(data){
            console.log(data)
            document.getElementById('loader').style.display='none'
            showReceiptonUI(data.receipts)
        },
        error: function(err){
            document.getElementById('loader').style.display='none'
            console.log(err.responseText)
        }
    })
}

function getReceiptsById(){
    let ReceiptNo = document.getElementById('searchValue').value
    if( !ReceiptNo || ReceiptNo == ''){
        new Noty({
            theme: 'relax',
            text: 'Please fill receipt number',
            type: 'error',
            layout: 'topRight',
            timeout: 1500
        }).show();
        return
    }
    document.getElementById('loader').style.display='block'
    $.ajax({
        url:'/receipts/findById',
        type:'Get',
        success:function(data){
            console.log(data)
            document.getElementById('loader').style.display='none'
            showReceiptonUI(data.receipt)
        },
        data:{
            ReceiptNo
        },
        error: function(err){
            console.log(err.responseText)
            document.getElementById('loader').style.display='none'
        }
    })
}

function showReceiptonUI(receiptList){
    let container = document.getElementById('receiptsTableBody');
    container.innerHTML=``
    for(let i=0;i<receiptList.length;i++){
        let rowItem = document.createElement('tr');
        let date = String(receiptList[i].createdAt).split('T');
        let d = date[0].split('-')
        let modDate = d[2].padStart(2,'0')+'-'+d[1]+'-'+d[0].padStart(2,'0')
        rowItem.innerHTML=
        `
            <td>${i+1}</td>
            <td>${receiptList[i].Name}</td>
            <td>${modDate}</td>
            <td>${receiptList[i].Address}</td>
            <td><a target='_blank' href='/receipts/gerenate/${receiptList[i]._id}'>View</a></td>
        `
        container.appendChild(rowItem)
    }
}