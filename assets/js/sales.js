function getSalesHistoryRange(){
    let startDate = document.getElementById('startDate').value
    let endDate = document.getElementById('endDate').value
    let BillType = document.getElementById('billType').value
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
            text: 'Start date is greater than end date',
            type: 'error',
            layout: 'topRight',
            timeout: 1500
        }).show();
        return
    }
    let days = (new Date(endDate).getTime() - new Date(startDate).getTime())/(60*24*60*1000)
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
        url:'/sales/getHistoryByRange',
        type:'Get',
        data:{
            startDate,
            endDate,
            BillType
        },
        success:function(data){
            document.getElementById('loader').style.display='none'
            if(data.sales.length < 1){
                document.getElementById("historyBody").innerHTML=
                `
                <tr>
                    <td rowspan="3" colspan="9" style="text-align: center;">No Data found</td>
                </tr>
                `
                document.getElementById('pagination').innerHTML=``
                return
            }
            if(BillType == 'Medical Bill Ext'){
                setHistoryOnUiExtMed(data.sales)
            }else if(BillType == 'Medical Bill'){
                setHistoryOnUiIntMed(data.sales,data.hostname, data.port, data.protocol)
            }
            else{
                setHistoryOnUi(data.sales,data.hostname, data.port, data.protocol)
            }
        },
        error:function(err){
            document.getElementById('loader').style.display='none'
            console.log(err)}
    })
}
function getSalesHistoryDate(){
    let selectedDate = document.getElementById('selectedDate').value
    let BillType = document.getElementById('billType').value
    if(!selectedDate || selectedDate == null || selectedDate == ''){
        new Noty({
            theme: 'relax',
            text: 'Date is mandatory',
            type: 'error',
            layout: 'topRight',
            timeout: 1500
        }).show();
        return
    }
    document.getElementById('loader').style.display='block'
    $.ajax({
        url:'/sales/getHistoryByDate',
        type:'Get',
        data:{
            selectedDate,
            BillType
        },
        success:function(data){
            document.getElementById('loader').style.display='none'
            if(data.sales.length < 1){
                document.getElementById("historyBody").innerHTML=
                `
                <tr>
                    <td rowspan="3" colspan="9" style="text-align: center;">No Data found</td>
                </tr>
                `
                document.getElementById('tvalue').innerText='Total Amount : 0'
                document.getElementById('pagination').innerHTML=``
                return
            }
            if(BillType == 'Medical Bill Ext'){
                setHistoryOnUiExtMed(data.sales)
            }else if(BillType == 'Medical Bill'){
                setHistoryOnUiIntMed(data.sales,data.hostname, data.port, data.protocol)
            }
            else{
                setHistoryOnUi(data.sales,data.hostname, data.port, data.protocol)
            }
            
        },
        error:function(err){
            document.getElementById('loader').style.display='none'
            console.log(err)}
    })
}

function getSalesHistory(){
    let value = document.getElementById('filterType').value
    if(value == 'byDate'){
        getSalesHistoryDate()
    }else if (value == 'byDateRange'){
        getSalesHistoryRange()
    }
}
function changeInputs(){
    let value = document.getElementById('filterType').value
    if(value == 'byDate'){
        document.getElementById('dateRangeInputs').style.display='none'
        document.getElementById('dateInput').style.display='block'
    }else if (value == 'byDateRange'){
        document.getElementById('dateInput').style.display='none'
        document.getElementById('dateRangeInputs').style.display='block'
    }
}
changeInputs()

function setHistoryOnUiIntMed(history,host,port,protocol){
    console.log(host, port)
    let totalAmount = 0
    let container = document.getElementById('historyBody');
    container.innerHTML=``
    for(let i=0;i<history.length;i++){
        let rowItem = document.createElement('tr');
        if(history[i] && history[i].PatientId){
            rowItem.innerHTML=
            `
                <td>${i+1}</td>
                <td>${history[i].PatientId.Name}</td>
                <td>${history[i].BillType}</td>
                <td>${history[i].BillAmount}</td>
                <td>${history[i].SaleDate}</td>
                <td><a target='_blank' href='${history[i].BillLink}'>View</a></td>
                <td><button onclick='openPopup("${history[i].BillLink}")'>Return</button></td>
            `
        }else{
            rowItem.innerHTML=
        `
            <td>${i+1}</td>
            <td>Not Available</td>
            <td>${history[i].BillType}</td>
            <td>${history[i].BillAmount}</td>
            <td>${history[i].SaleDate}</td>
            <td><a target='_blank' href='${history[i].BillLink}'>View</a></td>
            <td><button onclick='openPopup("${history[i].BillLink}")'>Return</button></td>
        `
        }
        totalAmount = totalAmount + Number(history[i].BillAmount)
        container.appendChild(rowItem)
    }
    totalAmount = Math.floor(totalAmount)
    document.getElementById('tvalue').innerText='Total Amount : '+totalAmount 
}

function setHistoryOnUi(history,host,port,protocol){
    console.log(host, port)
    let totalAmount = 0
    let container = document.getElementById('historyBody');
    container.innerHTML=``
    for(let i=0;i<history.length;i++){
        let rowItem = document.createElement('tr');
        if(history[i] && history[i].PatientId){
            rowItem.innerHTML=
            `
                <td>${i+1}</td>
                <td>${history[i].PatientId.Name}</td>
                <td>${history[i].BillType}</td>
                <td>${history[i].BillAmount}</td>
                <td>${history[i].SaleDate}</td>
                <td><a target='_blank' href='${history[i].BillLink}'>View</a></td>
            `
        }else{
            rowItem.innerHTML=
        `
            <td>${i+1}</td>
            <td>Not Available</td>
            <td>${history[i].BillType}</td>
            <td>${history[i].BillAmount}</td>
            <td>${history[i].SaleDate}</td>
            <td><a target='_blank' href='${history[i].BillLink}'>View</a></td>
        `
        }
        totalAmount = totalAmount + Number(history[i].BillAmount)
        container.appendChild(rowItem)
    }
    totalAmount = Math.floor(totalAmount)
    document.getElementById('tvalue').innerText='Total Amount : '+totalAmount   
}

function setHistoryOnUiExtMed(history){
    let totalAmount = 0
    let container = document.getElementById('historyBody');
    container.innerHTML=``
    for(let i=0;i<history.length;i++){
        let rowItem = document.createElement('tr');
        if(history[i] && history[i].PatientName){
            rowItem.innerHTML=
            `
                <td>${i+1}</td>
                <td>${history[i].PatientName}</td>
                <td>${history[i].BillType}</td>
                <td>${history[i].BillAmount}</td>
                <td>${history[i].SaleDate}</td>
                <td><a target='_blank' href='${history[i].BillLink}'>View</a></td>
                <td><button onclick='openPopup("${history[i].BillLink}")'>Return</button></td>
            `
        }else{
            rowItem.innerHTML=
        `
            <td>${i+1}</td>
            <td>Not Available</td>
            <td>${history[i].BillType}</td>
            <td>${history[i].BillAmount}</td>
            <td>${history[i].SaleDate}</td>
            <td><a target='_blank' href='${history[i].BillLink}'>View</a></td>
            <td><button onclick='openPopup("${history[i].BillLink}")'>Return</button></td>
        `
        }
        totalAmount = totalAmount + Number(history[i].BillAmount)
        container.appendChild(rowItem)
    }
    totalAmount = Math.floor(totalAmount)
    document.getElementById('tvalue').innerText='Total Amount : '+totalAmount 
}

function openPopup(link){
    console.log(link)
    getmedsbylink(link)
    document.getElementById('returnsPopup').style.display='block'
}

function closePopup(){
    document.getElementById('returnsPopup').style.display='none'
}

function getmedsbylink(link){
    $.ajax({
        url:'/receipts/getMedsListLink',
        data:{link},
        type:'Get',
        success:function(data){
            let container = document.getElementById('returnsTable');
            container.innerHTML=``
            for(let i=0;i<data.items.length;i++){
                let rowItem = document.createElement('tr');
                let item = data.items[i].split(':')
                rowItem.innerHTML=
                `
                    <td>${item[0]}</td>
                    <td>${item[6]}</td>
                    <td>${item[7]}</td>
                    <td><input type='number'></td>
                `
                container.appendChild(rowItem)
            }
        },
        error:function(err){console.log(err.responseText)}
    })
}