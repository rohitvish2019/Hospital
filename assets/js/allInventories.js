let pdata=[]
function getInventories(){
    let startDate = document.getElementById('startDate').value
    let endDate = document.getElementById('endDate').value
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
    let days = (new Date(endDate).getTime() - new Date(startDate).getTime())/(60*24*60*1000)
    if( days > 185){
        new Noty({
            theme: 'relax',
            text: 'Max 6 Months allowed',
            type: 'error',
            layout: 'topRight',
            timeout: 1500
        }).show();
        return
    }
    document.getElementById('loader').style.display='block'
    $.ajax({
        url:'/purchases/getInventories',
        type:'Get',
        data:{
            startDate,
            endDate
        },
        success:function(data){
            console.log('Calling success handler')
            document.getElementById('loader').style.display='none'
            if(data.inventories.length < 1){
                document.getElementById("medicines").innerHTML=
                `
                <tr>
                    <td rowspan="3" colspan="9" style="text-align: center;">No Data found</td>
                </tr>
                `
                document.getElementById('pagination').innerHTML=``
                document.getElementById('tprice').innerText='Total Amount : 0'
                pdata=[]
                return
            }
            showInventoriesOnUI(data.inventories);
        
        },
        error:function(err){
            document.getElementById('loader').style.display='none'
            console.log(err)}
    })
}


function showInventoriesOnUI(pdata) {
    var tableBody = document.getElementById("medicines");
    if(pdata.length == 0){
        tableBody.innerHTML=`
    <tr>
        <td rowspan="3" colspan="9" style="text-align: center;">No Data found</td>
    </tr>
    `
    }
    let totalValue = 0
    tableBody.innerHTML = ``;

    for (var i = 0; i < pdata.length ;i++) {
        var row = document.createElement("tr");
        row.id=pdata[i]._id
        row.innerHTML = `
            <td>${i+1}</td>
            <td>${pdata[i].Medicine}</td>
            <td>${pdata[i].Batch}</td>
            <td>${pdata[i].CurrentQty}</td>
            <td>${String(new Date(pdata[i].ExpiryDate)).substring(4,15).split(' ')[1]} ${String(new Date(pdata[i].ExpiryDate)).substring(4,15).split(' ')[0]} ${String(new Date(pdata[i].ExpiryDate)).substring(4,15).split(' ')[2]}</td>
            <td>${pdata[i].Price}</td>
            <td>${String(new Date(pdata[i].createdAt)).substring(4,15).split(' ')[1]} ${String(new Date(pdata[i].createdAt)).substring(4,15).split(' ')[0]} ${String(new Date(pdata[i].createdAt)).substring(4,15).split(' ')[2]}</td>
            <td>${pdata[i].CurrentQty * pdata[i].Price}</td>
            <td ><button class = 'btn btn-warning' onclick='returnMed("${pdata[i]._id}")'>Return</button></td>
        `
        totalValue = totalValue + (pdata[i].CurrentQty * pdata[i].Price)
        tableBody.appendChild(row);
    }
    document.getElementById('tprice').innerText='Total Value : '+totalValue
}

function returnMed(id){
    $.ajax({
        url:'/purchases/return/',
        type:'Post',
        data:{
            id
        },
        success:function(data){
            document.getElementById(id).remove()
            new Noty({
                theme: 'relax',
                text: data.message,
                type: 'success',
                layout: 'topRight',
                timeout: 1500
            }).show();
            return
        }
    })
}
// Function to populate pagination
function populatePagination() {
    var totalPages = Math.ceil(pdata.length / 10); // Assuming 5 items per page
    var pagination = document.getElementById("pagination");
    pagination.innerHTML = "";

    for (var i = 1; i <= totalPages; i++) {
        var li = document.createElement("li");
        var a = document.createElement("a");
        a.href = "#";
        a.textContent = i;
        a.onclick = function() {
            populateTable(parseInt(this.textContent));
        };
        li.appendChild(a);
        pagination.appendChild(li);
    }
}
