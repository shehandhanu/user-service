const User = require('../models/User.Model')

const sendToken = require('../utils/jwtToken');
const sendEmail = require('../utils/sendEmail');
const jwt = require('jsonwebtoken')

//Register User   => /api/v1/signup
exports.registerUser = async (req, res, next) => {

    const { firstName, lastName, email, password, public_id, url, birthday, phoneNumber } = req.body

    const user = await User.create({
        firstName,
        lastName,
        email,
        password,
        avatar: {
            public_id,
            url
        },
        birthday,
        phoneNumber
    })

    if (!user) {
        res.status(201).json({
            success: false
        })
    }

    const ruser = await sendToken(user)

    let token = ruser.token;
    let option = ruser.option;

    const data = {
        token,
        user
    }

    sendEmail(1, data)

    res.status(200).cookie('token', token, option).json({
        success: true,
        token,
        user
    })

}

//Email Confirmations
exports.confirmationEmail = async (req, res) => {

    const decodeJWT = jwt.verify(req.params.token, process.env.JWT_SECRET)
    const user = await User.findByIdAndUpdate(decodeJWT.id, { verifiedAccount: true })

    res.status(200).json({
        success: true,
        user
    })
}

//Login User
exports.loginUser = async (req, res, next) => {

    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(204).json({
            success: false,
            message: 'Email Or Password Empty'
        })
    }

    //finding user in data bsae
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
        return next(new ErrorHandler('Invalid Email Or Password', 401));
    }

    //checks password is correct 
    const isPasswordMatched = await user.comparePassword(password);

    if (!isPasswordMatched) {
        return next(new ErrorHandler('Invalid Email Or Password', 401));
    }

    const tokendata = await sendToken(user);

    const token = tokendata.token
    const option = tokendata.option

    res.status(200).cookie('token', token, option).json({
        success: true,
        token,
        user
    })
}

//change password => apiv1/password/update      
exports.updatePassword = async (req, res, next) => {

    const user = await User.findById(req.user._id).select('+password');

    //check previes user password  
    const isMatch = await user.comparePassword(req.body.oldPassword);
    if (!isMatch) {
        return next(new ErrorHandler('Old password is incorrect', 400))
    }

    user.password = req.body.password;
    await user.save();

    sendToken(user, 200, res);

}

//update user profile   => api/v1/user/update
exports.updateProfile = async (req, res, next) => {

    const newUserData = req.body

    //update avater TODO
    const user = await User.findByIdAndUpdate(req.user.id, newUserData, {
        new: true,
        runValidators: true,
        useFindAndModify: false
    })

    res.status(200).json({
        success: true,
        user
    })

}

//get current user  => /api/v1/user
exports.getUserProfile = async (req, res, next) => {

    console.log("works");

    let user = await User.findById(req.user.id).populate('reservations.reservationID')
        .populate('carID').populate('empID')

    if (!user) {
        return res.status(401).json({
            success: false,
            user: [],
            message: 'User Not Found'
        })
    }

    res.status(200).json({
        success: true,
        user
    })
}

//Forgot Password => api/v1/password/forgot password
exports.forgotPassword = async (req, res, next) => {

    const user = await User.findOne({ email: req.body.email });

    if (!user) {
        return next(new ErrorHandler('User Not Found ', 404));
    }

    //get rest token  
    const resetToken = user.getResetPasswordToken();
    await user.save({ validateBeforeSave: false });

    //create reset url 
    const resetUrl = `${req.protocol}://http://localhost:3000/changepassword/${resetToken}`;
    const message = `your password reset token is as follow : \n\n ${resetUrl}\n\n if you have not requested this email, then ignore it.`;

    const data = {
        subject: 'Black Code Car Rental Password Recovery',
        message,
        user
    }

    try {
        await sendEmail(3, data)

        res.status(200).json({
            success: true,
            messsage: `Email send to ${user.email}`
        })

    } catch (error) {
        user.resetPasswordToken = undefined;
        user.resetPAsswordExpires = undefined;
        await user.save({ validateBeforeSave: false });
        return next(new ErrorHandler(error.message, 500));
    }
}

//reset Password
exports.resetPassword = async (req, res, next) => {
    //hash url
    const resetPasswordToken = req.params.token;
    // crypto.createHash('sha256').update(req.params.token).digest('hex');
    console.log(resetPasswordToken);

    const user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpire: { $gt: Date.now() }
    })

    console.log(user);

    if (!user) {
        return next(new ErrorHandler('1 Password token invali or has expired', 400))
    }

    if (req.body.password !== req.body.confirmPassword) {
        return next(new ErrorHandler('2 password dose not match', 400))
    }

    // setup new password 
    user.password = req.body.password;

    user.resetPasswordToken = undefined;
    user.resetPAsswordExpires = undefined;

    await user.save();

    const tokendata = await sendToken(user);

    const token = tokendata.token
    const option = tokendata.option

    res.status(200).cookie('token', token, option).json({
        success: true,
        token,
        user
    })

}

//logout user => /api/v1/logout
exports.logout = async (req, res, next) => {
    res.cookie('token', null, {
        expires: new Date(Date.now()),
        httpOnly: true
    })

    res.status(200).json({
        success: true,
        message: 'logged out'
    })
}
