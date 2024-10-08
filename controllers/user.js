const UserSchema = require('../models/Users');
const db = require('../configs/dbConnection');
/*
const winston = require("winston");
const User = require('../modals/userSchema');
const dateToday = new Date().getDate().toString()+'-'+ new Date().getMonth().toString() + '-'+ new Date().getFullYear().toString();
const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: "logs/error_"+dateToday+'.log', level: "warn" }),
    new winston.transports.File({ filename: "logs/app_"+dateToday+".log" }),
  ],
});
*/

/*
module.exports.mainHome = function(req,res){
    return res.render('./home/index');
}
*/
module.exports.login = function(req, res){
    if(req.isAuthenticated()){
        return res.redirect('/patients/new')
    }
    else{
        console.log('Unable to authenticate')
        return res.render('login');
    }
    
}

/*
module.exports.signUp = function(req, res){
    return res.render('SchoolRegistration');
}

module.exports.home = async function(req, res){
    let properties = propertiesReader('../School/config/properties/'+req.user.SchoolCode+'.properties');
    try{
        let messages = await Messages.find({SchoolCode:req.user.SchoolCode, Category:'School'})
        const pathToDirectory = '../School/assets/schools/'+req.user.SchoolCode+'/carousel-photos';
        let mono = properties.get(req.user.SchoolCode+'_MONO');
        let imgdir = properties.get(req.user.SchoolCode+'_IMAGES')
        console.log(mono);
        fs.readdir(pathToDirectory, (error, files) => {
        if (error) {
            console.log(error);
        } else {
            if(req.isAuthenticated){
                console.log(req.user.School_Code+'_name');
                let School_name = properties.get(req.user.SchoolCode+'_name');
                console.log(files)
                return res.render('admin_home', {files,role:req.user.role, School_name, messages, user:{name:req.user.full_name, Mobile:req.user.mobile_number, username:req.user.email, address: req.user.address,SchoolCode:req.user.SchoolCode}, mono,imgdir});
                
                
            }else{
                return re.redirect('/user/login')
            }
        }
        });
    }catch(err){
        logger.error(err.toString());
        return res.redirect('back')
    }
}
*/

module.exports.createSession = async function(req, res){
    try{
        let rm = Math.floor(Math.random() * 10000) + 1;
        await UserSchema.findOneAndUpdate({email:req.user.email},{updater:rm});
        return res.redirect('/patients/new');
    }catch(err){
        console.log(err)
        return res.redirect('/user/login')
    }
}

module.exports.logout = async function(req, res){
    try{
        let destroyedSession = req.session.destroy(function(err){
            if(err){
                console.log(err)
                console.log("failed Logging out");
                return res.redirect('/user/login');
            }else{
                console.log('Logged out')
            }
            return res.redirect('/user/login');
        });
        let rm = Math.floor(Math.random() * 10000) + 1;
        await UserSchema.findOneAndUpdate({email:req.user.email},{updater:rm})
    }catch(err){
        console.log(err);
        return res.redirect('back')
    }
}

module.exports.showUsersUI = async function(req, res){
    if(req.user.role == 'Admin'){
        try{
            if(req.user.role === 'Admin'){
                let users = await UserSchema.find({},'full_name role email');
                return res.render('manageUsers',{role:req.user.role, users})
            }else{
                console.log('403')
                return res.render('Error_403');
            }
        }catch(err){
            console.log(err)
        }
    }else{
        return res.render('Error_403')
    }
    
}

module.exports.addNewUser = async function(req, res){
    if(req.user.role == 'Admin'){
        try{
            if(req.user.role === 'Admin'){
                let user  = await UserSchema.create(
                    req.body
                );
                return res.status(200).json({
                    message:'user created'
                })   
            }else{
                return res.status(403).json({
                    message:'You are not authorized to create new user'
                })        
            }
        }catch(err){
            return res.status(500).json({
                message:'Unable to created user'
            })
        }
    }else{
        return res.render('Error_403')
    }
    
}

module.exports.deleteUser = async function(req, res){
    if(req.user.role == 'Admin'){
        try{
            if(req.user.role == 'Admin'){
                await UserSchema.findByIdAndDelete(req.params.user_id);
                return res.status(200).json({
                    message:'User deleted'
                })
            }else{
                return res.render('Error_403')
            }
            
        }catch(err){
            return res.status(500).json({
                message:'Error deleting user'
            })
        }
    }else{
        return res.render('Error_403')
    }
    
}

module.exports.myProfile = function(req, res){
    let user = {
        name:req.user.full_name,
        username: req.user.email,
        role:req.user.role
    }
    return res.render('profile', {user,role:req.user.role})
}

module.exports.updatePassword = async function(req, res){
    try{
        let user = await UserSchema.findOne(req.user);
        console.log(user.password.toString());
        console.log(req.body.oldPassword.toString());
        if(user.password.toString() === req.body.oldPassword.toString()){
            await user.updateOne({password:req.body.password});
            user.save();
            return res.status(200).json({
                message:'Password updated'
            })
        }else{
            return res.status(403).json({
                message:'Incorrect old password'
            })
        }
    }catch(err){
        console.log(err)
        return res.status(500).json({
            message:'Internal server error'
        })
    }
}
