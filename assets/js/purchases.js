let itemsCount = 0
let items = new Array();
function addMedications(isComingFromServer, data){
    if(items.length >= 5){
        new Noty({
            theme: 'relax',
            text: 'Max 5 records allowed',
            type: 'error',
            layout: 'topRight',
            timeout: 1500
        }).show();
        return;
    }
    let medicine,batch,pprice,sprice,expDate,boxSize,boxCount;
    medicine = document.getElementById('Medicine').value
    batch = document.getElementById('Batch').value
    pprice = document.getElementById('pprice').value
    sprice = document.getElementById('sprice').value
    expDate = document.getElementById('ExpDate').value
    boxSize = document.getElementById('boxSize').value
    boxCount = document.getElementById('boxCount').value
    
    
    let child = document.createElement('tr');
    let parent = document.getElementById('prescriptionTableBody');
    
    if(
        !medicine || medicine == ''||
        !batch || batch == '' ||
        !sprice || sprice == '' ||
        !expDate || expDate == '' ||
        !boxSize || boxSize == '' ||
        !boxCount || boxCount == ''

    ){
        new Noty({
            theme: 'relax',
            text: 'Mandatory feilds are missing',
            type: 'error',
            layout: 'topRight',
            timeout: 1500
        }).show();
        return;
    }
    
    child.innerHTML=
    `
        <td>${++itemsCount}</td>
        <td style="text-transform: uppercase;">${medicine}</td>
        <td>${batch}</td>
        <td>${pprice}</td>
        <td>${sprice}</td>
        <td>${expDate}</td>
        <td>${boxSize}</td>
        <td>${boxCount}</td>
        <td>${pprice*boxCount}</td>
       <!-- <td class='delButton'><img width='25px' height='25px' src="/images/delete.png" onclick="deleteMed(${itemsCount})" alt=""></td> -->
    `
    child.id='medRow_'+itemsCount
    parent.appendChild(child);
    let thisItem = medicine+':'+batch+':'+pprice+':'+sprice+':'+expDate+':'+boxSize+':'+boxCount
    items.push(thisItem);
    clearMedForm();
}

function clearMedForm(){
    document.getElementById('Medicine').value = ''
    document.getElementById('Batch').value = ''
    document.getElementById('pprice').value = ''
    document.getElementById('sprice').value = ''
    document.getElementById('ExpDate').value = ''
    document.getElementById('boxSize').value = ''
    document.getElementById('boxCount').value = ''
}

function savePurchases(){
    $.ajax({
        url:'/purchases/save',
        data:{
            items
        },
        type:'POST',
        success:function(data){
            console.log(data);
            new Noty({
                theme: 'relax',
                text: 'Inventory updated',
                type: 'success',
                layout: 'topRight',
                timeout: 1500
            }).show();
            document.getElementById('prescriptionTableBody').innerHTML=``;
            return;
        },
        error: function(err){console.log(err.responseText)}
    })
}

function deleteMed(id){
    document.getElementById('medRow_'+id).remove();
    items.splice(id-1,1)
    
}