const express = require('express');
const router = express.Router();
const passport = require('passport');
const passportLocal = require('passport-local').Strategy;
const LocalStrategy = require('../configs/passport-local-strategy');

const userController = require('../controllers/user');

router.get('/login', userController.login);
router.get('/logout', userController.logout);
router.get('/showAll', userController.showUsersUI)
router.post('/addNew',passport.checkAuthentication, userController.addNewUser);
router.delete('/delete/:user_id', userController.deleteUser)
/*
router.get('/sign-up', userController.signUp)

router.get('/new',passport.checkAuthentication, userController.addUserPage);

router.get('/home', passport.checkAuthentication, userController.home);
router.post('/studentUser', userController.addStudentUser);
router.post('/updatePassword', userController.updatePassword);

router.get('/getAll', userController.getUsers);
router.get('/getProperties', userController.getSchoolProperties)

router.get('/getClassList', userController.getClassList);
router.post('/register/school', userController.registerSchool)
*/
router.post('/authenticate', passport.authenticate(
    'local',
    {failureRedirect: '/user/login'},
), userController.createSession);

module.exports = router