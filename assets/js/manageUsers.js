function addUser(){
    let full_name,email,password,role, cpassword
    full_name = document.getElementById('full_name').value
    email = document.getElementById('email').value
    password = document.getElementById('password').value
    role = document.getElementById('role').value
    cpassword = document.getElementById('cpassword').value
    if(!full_name || full_name == ''){
        new Noty({
            theme: 'relax',
            text: 'Name is mandatory',
            type: 'error',
            layout: 'topRight',
            timeout: 1500
        }).show();
        return
    }
    if(!email || email == ''){
        new Noty({
            theme: 'relax',
            text: 'Email is mandatory',
            type: 'error',
            layout: 'topRight',
            timeout: 1500
        }).show();
        return
    }
    if(!role || role == ''){
        new Noty({
            theme: 'relax',
            text: 'Role is mandatory',
            type: 'error',
            layout: 'topRight',
            timeout: 1500
        }).show();
        return
    }
    if(!password || password == ''){
        new Noty({
            theme: 'relax',
            text: 'Password is mandatory',
            type: 'error',
            layout: 'topRight',
            timeout: 1500
        }).show();
        return
    }
    if(!cpassword || cpassword == ''){
        new Noty({
            theme: 'relax',
            text: 'Confirm password is mandatory',
            type: 'error',
            layout: 'topRight',
            timeout: 1500
        }).show();
        return
    }
    if(password != cpassword){
        new Noty({
            theme: 'relax',
            text: 'Password and confirm password is not matcing',
            type: 'error',
            layout: 'topRight',
            timeout: 1500
        }).show();
        let rowItem = document.createElement('tr')
        rowItem.innerHTML=
        `
            <td>${full_name}</td>
            <td>${email}</td>
            <td>${role}</td>
            `

        document.getElementById('userTableBody').appendChild(rowItem)
        return
    }
    $.ajax({
        url:'/user/addNew',
        type:'Post',
        data:{
            full_name,
            email,
            password,
            role
        },
        success: function(data){
            console.log(data)
            new Noty({
                theme: 'relax',
                text: 'User added',
                type: 'success',
                layout: 'topRight',
                timeout: 1500
            }).show();
            return
        },
        error: function(err){console.log(err.responseText)}
    })
}

function deleteUser(id){
    let confirmation = window.confirm("User will be deleted and lose access to this system permanently");
    if(confirmation == true){
        $.ajax({
            url:'/user/delete/'+id,
            type:'delete',
            success:function(data){
                console.log(data)
                document.getElementById(id).remove()
            },
            error:function(err){console.log(err.responseText)}
        })
    }else{
        return
    }
    
}