const express = require('express');
const router = express.Router();

const { registerUser,
    confirmationEmail,
    loginUser,
    updatePassword,
    updateProfile,
    getUserProfile,
    forgotPassword,
    resetPassword,
    logout } = require('../controllers/User.Controller');
const { isAuthenticatedUser, authorizeRoles } = require('../utils/authenticator')

//Register User
router.route('/signup').post(registerUser);

//Email Confirmation
router.route('/confirmation/:token').get(confirmationEmail);

//Login 
router.route('/signin').post(loginUser);

//Logout
router.route('/logout').get(logout)

//Get User Profile
router.route('/profile').get(isAuthenticatedUser, getUserProfile);

//Get User Profile
router.route('/profile').post(isAuthenticatedUser, getUserProfile);

//Get User Profile
router.route('/profileupdate').post(isAuthenticatedUser, updateProfile);

//Forgot Password
router.route('/forgotpassword').post(forgotPassword)

//Reset Account Password
router.route('/resetpassword/:token').post(resetPassword)


module.exports = router;