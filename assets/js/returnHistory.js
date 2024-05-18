let pdata=[]
function getReturnsHistory(){
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
        url:'/purchases/getReturnsHistory',
        type:'Get',
        data:{
            startDate,
            endDate
        },
        success:function(data){
            document.getElementById('loader').style.display='none'
            if(data.returnsData.length < 1){
                document.getElementById("medicines").innerHTML=
                `
                <tr>
                    <td rowspan="3" colspan="9" style="text-align: center;">No Data found</td>
                </tr>
                `
                document.getElementById('pagination').innerHTML=``
                pdata=[]
                return
            }
            for(let i=0;i<data.returnsData.length;i++){
                pdata[i] = data.returnsData[i]
            }
            populateTable(1);
            populatePagination();
        
        },
        error:function(err){
            document.getElementById('loader').style.display='none'
            console.log(err)}
    })
}


function populateTable(pageNumber) {
    var pageSize = 10; // Number of items per page
    var startIndex = (pageNumber - 1) * pageSize;
    var endIndex = startIndex + pageSize;
    var tableBody = document.getElementById("medicines");
    tableBody.innerHTML = ``;
    let totalValue = 0
    for (var i = startIndex; i < endIndex && i < pdata.length; i++) {
        var row = document.createElement("tr");
        row.id=pdata[i]._id
        row.innerHTML = `
            <td>${i+1}</td>
            <td>${pdata[i].Medicine}</td>
            <td>${pdata[i].Batch}</td>
            <td>${pdata[i].Qty}</td>
            <td>${String(new Date(pdata[i].ExpiryDate)).substring(4,15).split(' ')[1]} ${String(new Date(pdata[i].ExpiryDate)).substring(4,15).split(' ')[0]} ${String(new Date(pdata[i].ExpiryDate)).substring(4,15).split(' ')[2]}</td>
            <td>${pdata[i].Qty * pdata[i].Price}</td>
            <td>${pdata[i].Price}</td>
            <td>${String(new Date(pdata[i].createdAt)).substring(4,15).split(' ')[1]} ${String(new Date(pdata[i].createdAt)).substring(4,15).split(' ')[0]} ${String(new Date(pdata[i].createdAt)).substring(4,15).split(' ')[2]}</td>
            
        `;
        totalValue = totalValue + (pdata[i].Qty * pdata[i].Price)
        tableBody.appendChild(row);
    }
    document.getElementById('tvalue').innerText='Total Value : '+totalValue
}

// Function to populate pagination
function populatePagination() {
    var totalPages = Math.ceil(pdata.length / 10); // Assuming 10 items per page
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
