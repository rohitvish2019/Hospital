const UserSchema = require('../models/Users');
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
    return res.render('login');
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

module.exports.createSession = function(req, res){
    return res.redirect('/patients/new')
}

module.exports.logout = function(req, res){
    try{
        req.logout(function(err){
            if(err){
                console.log("failed Logging out");
                return res.redirect('/user/login');
            }
            req.flash('success', 'Logged out successfully')
            return res.redirect('/user/login');
        });
    }catch(err){
        console.log(err);
        return res.redirect('back')
    }
}

module.exports.showUsersUI = async function(req, res){
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
}

module.exports.addNewUser = async function(req, res){
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

    
}

module.exports.deleteUser = async function(req, res){
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
}
/*
module.exports.addUserPage = function(req, res){
    if(req.user.role === 'Admin'){
        return res.render('addUser',{role:req.user.role, isAdmin:req.user.isAdmin});
    }else{
        return res.render('Error_403')
    }
}

module.exports.addStudentUser = async function(req, res){
    try{
        let student = await Students.findOne({AdmissionNo:req.body.AdmissionNo, isThisCurrentRecord:true, Mob:req.body.email, SchoolCode: req.body.SchoolCode});
        if(student){
            await UserSchema.create({
                full_name:req.body.full_name,
                email:req.body.email,
                SchoolCode: req.body.SchoolCode,
                password: req.body.password,
                role:'Student'
            });
            console.log('User reigstered')
            return res.redirect('/user/login')
        }else{
            console.log('No student registered with given information')
            return res.redirect('back')
        }
    }catch(err){
        console.log(err);
        return res.redirect('back')
    }
}


module.exports.updatePassword = async function(req, res){
    try{
        let user = await UserSchema.findOne(req.user);
        console.log(user.password.toString());
        console.log(req.body.oldPassword.toString());
        if(user.password.toString() === req.body.oldPassword.toString()){
            console.log('changing now')
            await user.updateOne({password:req.body.newPassword});
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



module.exports.getUsers = async function(req, res){
    try{
        if(req.user.role === 'Admin'){
            logger.info('Finding users ...')
            let users = await UserSchema.find({SchoolCode:req.user.SchoolCode},'full_name email role mobile address');
            return res.status(200).json({
                message:'Users fetched',
                users
            })
        }else{
            return res.render('Error_403')
        }
    }catch(err){
        logger.error('Unable to fetch users from DB');
        logger.error(err.toString());
        return res.status(500).json({
            message:'Unable to fetch users from DB'
        })
    }
}


module.exports.getSchoolProperties = function(req, res){
    let properties = propertiesReader('../School/config/properties/'+req.user.SchoolCode+'.properties');
    try{
        let schoolProperties = new Object()
        let code = req.user.SchoolCode;
        school_name = properties.get(code+'.NAME');
        mono = properties.get(code+'.MONO');
        imgdir = properties.get(code+'.IMAGES');
        address = properties.get(code+'.ADDRESS');
        schoolProperties={school_name,mono,imgdir,address}
        return res.status(200).json({
            schoolProperties,
            message:'Properties fetched'
        })
    }catch(err){
        logger.error(err)
        return res.status(500).json({
            message:'Unable to get properties'
        })
    }
}


module.exports.getClassList = function(req, res){
    let properties = propertiesReader('../School/config/properties/'+req.user.SchoolCode+'.properties');
    try{
        let classes = properties.get(req.user.SchoolCode+'.CLASSES_LIST').split(',');
        return res.status(200).json({
            classes
        })
    }catch(err){
        logger.error(err)
        return res.status(500).json({
            message:'Unable to fetch class list'
        })
    }
}





module.exports.registerSchool = async function(req, res){
    try{
        await RegisteredSchools.create(req.body);
        return res.redirect('/')
    }catch(err){
        return res.render('Error_403')
    }
}
*/