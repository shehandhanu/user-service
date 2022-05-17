const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const userSchema = new mongoose.Schema({

    firstName: {
        type: String,
        required: [true, 'Please Enter Your First Name'],
        maxLength: [30, 'Your First Name cannot exceed 30 characters']
    },
    lastName: {
        type: String,
        required: [true, 'Please Enter Your Last Name'],
        maxLength: [30, 'Your Last Name cannot exceed 30 characters']
    },
    email: {
        type: String,
        required: [true, 'Please Enter Your Email'],
        unique: true,
        validate: [validator.isEmail, 'Please Enter Valid Email Address']
    },
    password: {
        type: String,
        required: [true, 'Please Enter Your Password'],
        minLength: [5, 'Your Password must be longer than 5 characters'],
        select: false
    },
    avatar: {
        public_id: {
            type: String,
            // required: true
        },
        url: {
            type: String,
            // required: true
        }
    },
    birthday: {
        type: Date,
        // required: true
    },
    phoneNumber: {
        type: Number,
        minLength: [10, 'Your Password must be longer than 5 characters'],
        maxLength: [30, 'Your Last Name cannot exceed 30 characters'],
        // required: true
    },
    role: {
        type: String,
        default: 'user'
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    verifiedAccount: {
        type: Boolean,
        default: false
    },
    empID: {
        type: mongoose.Schema.ObjectId,
        ref: 'Employee'
    },
    reservations: [
        {
            reservationID: {
                type: mongoose.Schema.ObjectId,
                ref: 'Reservation'
            }
        }
    ],
    resetPasswordToken: String,
    resetPasswordExpire: Date

})

//Encript password
userSchema.pre('save', async function (next) {

    if (!this.isModified('password')) {
        next();
    }

    this.password = await bcrypt.hash(this.password, 10);

})

//Compare password
userSchema.methods.comparePassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password)
}

//Return JWT Token
userSchema.methods.getJwtToken = function () {
    return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_TIME
    });
}

//get passsword reset token
userSchema.methods.getResetPasswordToken = function () {

    //genarate token
    const resetToken = crypto.randomBytes(20).toString('hex');

    //has nad set reset passsword token
    this.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');

    //set token expire timestamp
    this.resetPasswordExpire = Date.now() + 30 * 60 * 1000;

    console.log(this.resetPasswordToken);

    return this.resetPasswordToken;

}

module.exports = mongoose.model('User', userSchema)