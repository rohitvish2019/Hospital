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
            showReceiptonUI(data.receipts)
        },
        error: function(err){
            console.log(err.responseText)
        }
    })
}

function getReceiptsById(){
    let ReceiptNo = document.getElementById('searchValue').value
    $.ajax({
        url:'/receipts/findById',
        type:'Get',
        success:function(data){
            console.log(data)
            showReceiptonUI(data.receipt)
        },
        data:{
            ReceiptNo
        },
        error: function(err){
            console.log(err.responseText)
        }
    })
}

function showReceiptonUI(receiptList){
    let container = document.getElementById('receiptsTableBody');
    container.innerHTML=``
    for(let i=0;i<receiptList.length;i++){
        let rowItem = document.createElement('tr');
        rowItem.innerHTML=
        `
            <td>${i+1}</td>
            <td>${receiptList[i].Name}</td>
            <td>${receiptList[i].createdAt}</td>
            <td>${receiptList[i].Address}</td>
            <td>${receiptList[i]._id}</td>
        `
        container.appendChild(rowItem)
    }
}