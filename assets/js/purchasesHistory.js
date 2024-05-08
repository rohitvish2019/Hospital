// Sample data for demonstration
let pdata=[];
function getPurchaseHistory(){
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
    
    $.ajax({
        url:'/purchases/getHistory',
        type:'Get',
        data:{
            startDate,
            endDate
        },
        success:function(data){
            console.log(data.purchases);
            if(data.purchases.length < 1){
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
            for(let i=0;i<data.purchases.length;i++){
                pdata[i] = data.purchases[i]
            }
            populateTable(1);
            populatePagination();
        
        },
        error:function(err){console.log(err)}
    })
}
/*
var data = [
    { medicine: "Medicine A", batchNo: "12345", purchasePrice: "$10.00", sellingPrice: "$20.00", expiryDate: "2024-12-31", boxSize: "20 pills", boxCount: 100, entryDate: "2024-05-01" },
    { medicine: "Medicine B", batchNo: "54321", purchasePrice: "$15.00", sellingPrice: "$25.00", expiryDate: "2024-11-30", boxSize: "30 pills", boxCount: 80, entryDate: "2024-05-02" },
    { medicine: "Medicine C", batchNo: "98765", purchasePrice: "$20.00", sellingPrice: "$30.00", expiryDate: "2024-10-31", boxSize: "25 pills", boxCount: 120, entryDate: "2024-05-03" },
    // Add more sample data as needed
];
*/
// Function to populate table rows
function populateTable(pageNumber) {
    var pageSize = 10; // Number of items per page
    var startIndex = (pageNumber - 1) * pageSize;
    var endIndex = startIndex + pageSize;
    var tableBody = document.getElementById("medicines");
    tableBody.innerHTML = "";

    for (var i = startIndex; i < endIndex && i < pdata.length; i++) {
        var row = document.createElement("tr");
        row.innerHTML = `
            <td>${i+1}</td>
            <td>${pdata[i].Medicine}</td>
            <td>${pdata[i].Batch}</td>
            <td>${pdata[i].PurchasePrice}</td>
            <td>${pdata[i].SellingPrice}</td>
            <td>${String(new Date(pdata[i].ExpiryDate)).substring(4,15).split(' ')[1]} ${String(new Date(pdata[i].ExpiryDate)).substring(4,15).split(' ')[0]} ${String(new Date(pdata[i].ExpiryDate)).substring(4,15).split(' ')[2]}</td>
            <td>${pdata[i].BoxSize}</td>
            <td>${pdata[i].BoxCount}</td>
            <td>${String(new Date(pdata[i].createdAt)).substring(4,15).split(' ')[1]} ${String(new Date(pdata[i].createdAt)).substring(4,15).split(' ')[0]} ${String(new Date(pdata[i].createdAt)).substring(4,15).split(' ')[2]}</td>
        `;
        tableBody.appendChild(row);
    }
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

// Initial population of table and pagination

//getPurchaseHistory()