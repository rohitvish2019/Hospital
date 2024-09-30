function getMedInventoryInfo(){
    document.getElementById('loader').style.display='block'
    $.ajax({
        url:'/purchases/getMedInfo',
        data:{
            Medicine:document.getElementById('Medicine').value
        },
        type:'Get',
        success:function(data){
            console.log(data)
            document.getElementById('loader').style.display='none'
            setInventoryOnUi(data.meds)
        },
        error:function(err){
            document.getElementById('loader').style.display='none'
            console.log(err)}
    })
}


function setInventoryOnUi(data){
    let container = document.getElementById('medicine-list');
    container.innerHTML=``;
    for(let i=0;i<data.length;i++){
        let rowItem = document.createElement('tr');
        rowItem.innerHTML=
        `
            <td>${data[i].Medicine}</td>
            <td><input id='${data[i]._id}_qty' type="number" name="" id="" disabled value="${data[i].CurrentQty}"></td>
            <td><input id='${data[i]._id}_addqty' type='number'></td>
            <td>${data[i].AlertQty}</td>
            <td>${String(new Date(data[i].ExpiryDate)).substring(4,15).split(' ')[1]} ${String(new Date(data[i].ExpiryDate)).substring(4,15).split(' ')[0]} ${String(new Date(data[i].ExpiryDate)).substring(4,15).split(' ')[2]}</td>
            <td>${data[i].Batch}</td>
            <td>${data[i].Price}</td>
            <td><button class="btn btn-success" onclick=updateInventoryStock('${data[i]._id}') >Update</button></td>
        `
        container.appendChild(rowItem)
    }
}


function updateInventoryStock(id){
    let qty = document.getElementById(id+'_qty').value;
    let addQty = document.getElementById(id+'_addqty').value;
    $.ajax({
        url:'/purchases/updateInventory',
        data:{
            id,
            qty,
            addQty
        },
        type:'Post',
        success:function(data){
            console.log(data)
            document.getElementById(id+'_addqty').value=''
            document.getElementById(id+'_qty').value = +qty + +addQty
            new Noty({
                theme: 'relax',
                text: 'Inventory Updated',
                type: 'success',
                layout: 'topRight',
                timeout: 1500
            }).show();
        },
        error: function(err){
            console.log(err)
            new Noty({
                theme: 'relax',
                text: 'Unable to update Inventory',
                type: 'error',
                layout: 'topRight',
                timeout: 1500
            }).show();
        }
    })
}

function clearInventoreis(){
    $.ajax({
        url:'/sales/clearEmptyInventories',
        type:'delete',
        success:function(data){
            new Noty({
                theme: 'relax',
                text: 'Successfully cleared empty inventories',
                type: 'success',
                layout: 'topRight',
                timeout: 1500
            }).show();
        },
        error:function(err){
            new Noty({
                theme: 'relax',
                text: 'Unable to clear Inventories',
                type: 'error',
                layout: 'topRight',
                timeout: 1500
            }).show();
        }
    })
}