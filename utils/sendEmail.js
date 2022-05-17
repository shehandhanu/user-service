const nodemailer = require('nodemailer');

const sendEmail = async (type, data) => {

    var sendEmail = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure: true,
        service: 'gmail',
        auth: {
            user: process.env.EMAIL,
            pass: process.env.EMAILPASSWORD
        }
    });

    //Type 1 - Account create email & verification email
    //Type 2 - Successfull Acount activete email
    //Type 3 - password reset email

    switch (type) {
        case 1: {

            const url = `http://localhost:3000/confirmation/${data.token}`

            var mailOption = {
                from: 'blackcodeteam1st@gmail.com',
                to: data.user.email,
                subject: 'Welcome to Black Code Car Rental System',
                text: `Hi ${data.user.firstName},
                Thank you for Join With Black Code Car Rental System
                Now You Created Your Account Successfully....!
                    
                To Verify Account Please User Link Below
                 ${url} `,
            }
            console.log("email send 1");
        }
            break;
        case 2: {

            var mailOption = {
                from: 'blackcodeteam1st@gmail.com',
                to: data.user.email,
                subject: 'Welcome to Black Code Car Rental System',
                text: `Hi ${data.user.firstName}
                    Thank you for Join With Black Code Car Rental System
                    Now You Created Your Account Successfully
                    
                    To Verify Account Please User Link Below
                    <a herf="${url}"> ${url} </a>`,
                // attachments: {
                //     filename: 'invoice.pdf',
                //     path: "./invoice.pdf"
                // }
            }
            console.log("email send 1");

        }
            break;

        case 4: {

            var mailOption = {
                from: 'blackcodeteam1st@gmail.com',
                to: data.email,
                subject: 'Welcome to Black Code Car Rental System',
                text: `Hi ${data.emName}
                        Your Leave has Approved
                        
                    `,
                // attachments: {
                //     filename: 'invoice.pdf',
                //     path: "./invoice.pdf"
                // }
            }

        }

            break;

        case 5: {

            var mailOption = {
                from: 'blackcodeteam1st@gmail.com',
                to: data.email,
                subject: 'Welcome to Black Code Car Rental System',
                text: `Hi ${data.emName}
                        Your Leave has Rejected
                        
                    `,
                // attachments: {
                //     filename: 'invoice.pdf',
                //     path: "./invoice.pdf"
                // }
            }

        }

        case 3: {
            var mailOption = {
                from: 'blackcodeteam1st@gmail.com',
                to: data.user.email,
                subject: 'Your Account Password Reset Link',
                text: `Hi ${data.user.firstName}
                        ${data.message}`,
                // attachments: {
                //     filename: 'invoice.pdf',
                //     path: "./invoice.pdf"
                // }
            }

        }
    }

    sendEmail.sendMail(mailOption, function (error, info) {

        if (error) {
            console.log(error);
        } else {
            console.log(`Email Sent`);
        }

    })

}

module.exports = sendEmail;