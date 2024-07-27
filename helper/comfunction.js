const nodemailer = require('nodemailer');

exports.sendEmail = async (to, subject, text, otp) => {
    const transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        auth: {
            user: 'holly10@ethereal.email',
            pass: 'PfmZYF8e5mc3YSZ1a2'
        }
    });

    const mailOptions = {
        from: 'Anushka <holly10@ethereal.email>',
        to: to,
        subject: subject,
        text: `Your OTP is ${otp}`,
        html:  `<h1>Your OTP Code</h1><p>Your OTP code is <b>${otp}</b>.</p>`
       
        //'<b><h1><i>Hello world</i></h1></b>'
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`Email sent to ${to}`);
        return true; 
    } catch (error) {
        console.error('Error sending email:', error);
        return false; 
    }

}   

//module.exports = sendEmail;