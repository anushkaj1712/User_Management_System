
const user = require('../model/model');
const { sendEmail } = require('../helper/comfunction');
const generateOTP = require('./optfile');
const del = require('del');
const fs = require('fs');



exports.signup = async (req, res) => {
    console.log(req.body);

    if (req.body.password !== req.body.confirmPassword) {
        return res.status(400).send('Password mismatch');
    }

    try {
        const existingUser = await user.findOne({ email: req.body.email });
        if (existingUser) {
            return res.status(400).send('User already exists');
        }
        const otp = generateOTP();
        console.log('Generated OTP:', otp);

        const otpExpiry = new Date(Date.now() + 5 * 60000);
        console.log('OTP expiry:', otpExpiry);

        const userData = new user({ name: req.body.name, email: req.body.email, password: req.body.password, otp, otpExpiry, otpverify: false });
        await userData.save();
        console.log('User saved');

        let mail = await sendEmail(req.body.email, 'Your OTP', 'Please verify your OTP', otp);

        //let mail = await sendEmail(req.body.email, 'Your OTP ' , otp);

        if (mail) {
            return res.status(400).send('Signup successful, check your email for OTP');
        } else {
            return res.status(500).send('Error sending email');
        }

    } catch (error) {
        console.error("Error occurred:", error.message);
        return res.status(500).send('Internal Server Error');
    }
};

exports.verifyOTP = async (req, res) => {
    try {
        const userData = await user.findOne({ email: req.body.email });
        if (!userData) {
            console.log('User not found');
            return res.status(404).send('User not found');
        }
        if (userData.otpverify) {
            console.log('You have already verified your OTP');
            return res.status(200).send('You have already verified your OTP');
        }
        else {
            if (userData.otp !== req.body.otp) {
                console.log('Invalid OTP');
                return res.status(400).send('Invalid OTP');
            }

            if (userData.otpExpiry < new Date()) {
                console.log('OTP has expired');
                return res.status(400).send('OTP has expired');
            }

            userData.otpverify = true;
            await userData.save();
            console.log('OTP verified');
            return res.status(200).send('OTP verified');
        }

    } catch (error) {
        console.error("Error occurred:", error.message);
        return res.status(500).send('Internal Server Error');
    }
};

exports.resendOTP = async (req, res) => {
    console.log(req.body);

    const User = await user.findOne({ email: req.body.email });
    if (!User) {
        console.log('invalid email');
        return res.status(400).send('Invalid email');
    }
    if (new Date() <= User.otpExpiry) {
        console.log('OTP is still valid');
        return res.status(400).send('OTP is still valid');
    }

    const otp = generateOTP();
    const otpExpiry = new Date(Date.now() + 5 * 60000);

    User.otp = otp;
    User.otpExpiry = otpExpiry;

    await User.save();

    try {
        await sendEmail(req.body.email, 'Your new OTP', 'Your new OTP is ', otp);
        console.log('New OTP sent successfully');
        res.status(200).send('New OTP sent successfully');
    }
    catch (error) {
        console.error('Error 3:', error.message);
        res.status(500).send('Server error', error);
    }

};

exports.login = async (req, res) => {
    try {
        const userData = await user.findOne({ email: req.body.email });

        if (!userData) {
            console.log('User not found');
            return res.status(404).send('User not found');
        }

        if (req.body.password !== userData.password) {
            console.log('Invalid password');
            return res.status(400).send('Invalid password');
        }

        if (userData.otpverify) {
            console.log('Login successful');
            return res.status(400).send('Login successful');
        }
        else {
            console.log('OTP not verified');
            return res.status(200).send('OTP not verified');
        }

    } catch (error) {
        console.error("Error occurred:", error.message);
        return res.status(500).send('Internal Server Error');
    }
};

exports.forgotPassword = async (req, res) => {
    try {
        console.log(req.body);
        const { email, otp, newPassword, confirmNewPassword } = req.body;

        // Check if the user exists
        const userData = await user.findOne({ email });
        if (!userData) {
            console.log('User not found');
            return res.status(404).send('User not found');
        }

        if (!otp) {
            const otp = generateOTP();
            const otpExpiry = new Date(Date.now() + 5 * 60000);

            userData.otp = otp;
            userData.otpExpiry = otpExpiry;
            userData.otpverify = false;

            console.log('Generated OTP:', otp);
            console.log('OTP expiry:', otpExpiry);

            await userData.save();
            console.log('Data saved');

            await sendEmail(req.body.email, 'Your new OTP', 'Your new OTP is ', otp);
            console.log('New OTP sent successfully');
            return res.status(200).send('New OTP sent successfully');

        }

        if (!userData.otpverify) {
            console.log('OTP not verified');
            return res.status(400).send('OTP not verified');
        }

        if (newPassword !== confirmNewPassword) {
            console.log('New password and confirm new password do not match');
            return res.status(400).send('New password and confirm new password do not match');
        }

        userData.password = newPassword;
        await userData.save();

        console.log('Password changed successfully');
        return res.status(200).send('Password changed successfully');
    }
    catch (error) {
        console.error("Error occurred:", error.message);
        return res.status(500).send('Internal Server Error');
    }
}

exports.changePassword = async (req, res) => {
    try {
        console.log(req.body);

        const { email, otp, password, newPassword, confirmNewPassword } = req.body;


        if (!password) {
            console.log('Previous password is required');
            return res.status(400).send('Previous password is required');
        }

        const userData = await user.findOne({ email: req.body.email });
        if (!userData) {
            console.log('User not found');
            return res.status(404).send('User not found');
        }
        // if (!req.body.otp) {
        //     const otp = generateOTP();
        //     const otpExpiry = new Date(Date.now() + 5 * 60000);

        //     userData.otp = otp;
        //     userData.otpExpiry = otpExpiry;

        //     console.log('Generated OTP:', otp);
        //     console.log('OTP expiry:', otpExpiry);

        //     await userData.save();
        //     console.log('Data saved');

        //     await sendEmail(email , 'Your new OTP', 'Your new OTP is ', otp);
        //     console.log('New OTP sent successfully');
        //     return res.status(200).send ( 'New OTP sent successfully' );            
        // }

        // if (userData.otp !== otp || userData.otpExpiry < new Date()) {
        //     console.log('Invalid or expired OTP');
        //     return res.status(401).send('Invalid or expired OTP');
        // }

        if (newPassword === password) {
            console.log('New password must be different from the old password');
            return res.status(400).send('New password must be different from the old password');
        }
        if (newPassword !== confirmNewPassword) {
            console.log('New password and confirm new password do not match');
            return res.status(400).send('New password and confirm new password do not match');
        }

        userData.password = newPassword;
        await userData.save();

        console.log('Password updated successfully');
        return res.status(200).send('Password updated successfully');

    }
    catch (error) {
        console.error("Error occurred:", error.message);
        return res.status(500).send('Internal Server Error');
    }
};

exports.uploadProfilePicture = async (req, res) => {
    try {
        console.log(req.body);

        if (!req.files) {
            return res.status(400).send('No file uploaded');
        }
        console.log("==================================================",req.files);

        if (!req.body.email) {
            return res.status(400).send('Email is required');
        }

        const userData = await user.findOne({ email: req.body.email });
        if (!userData) {
            console.log('invalid email');
            return res.status(400).send('Invalid email');
        } 

        let str = []
        for (let i = 0; i < req.files.length; i++) {
            str.push(req.files[i].path);
        }
        console.log("files:", str)

        userData.profilePicture = str
        await userData.save();
        console.log('Profile picture uploaded successfully');

        res.status(200).send('Profile picture uploaded successfully');
    } catch (error) {
        console.error("Error occurred:", error.message);
        return res.status(500).send('Internal Server Error');
    }
};

exports.updateProfilePicture = async (req, res) => {
    try {
        console.log(req.body);
    
        if (!req.files) {
            return res.status(400).send('No file uploaded');
        }
        console.log("==================================================", req.files);
    
        if (!req.body.email) {
            return res.status(400).send('Email is required');
        }
    
        const userData = await user.findOne({ email: req.body.email });
        if (!userData) {
            console.log('invalid email');
            return res.status(400).send('Invalid email');
        }
  
        if (userData.profilePicture) {
            for (let i = 0; i < userData.profilePicture.length; i++) {
              fs.unlink(userData.profilePicture[i], (err) => {
                if (err) {
                  console.error("error",error.message);
                }
              });
            }
        }
        
        
        let str = []
        for (let i = 0; i < req.files.length; i++) {
            str.push(req.files[i].path);
        }
        console.log("files:", str)

        userData.profilePicture = str
        await userData.save();
        console.log('Profile picture updated successfully');
    
        res.status(200).send('Profile picture updated successfully');
        } catch (error) {
        console.error("Error occurred:", error.message);
        return res.status(500).send('Internal Server Error');
        }
  };

// exports.updateProfilePicture = async (req, res) => {
//     try {
//         console.log(req.body);
//         await user.findOneAndUpdate({ email: req.body.email },{ profilePicture: req.files.path }, { new: true });
//         return res.status(200).send(`Profile picture updated successfully `);
     
 
//     } catch (error) {
//         console.error("Error occurred:", error.message);
//         return res.status(500).send('Internal Server Error');
//     }
// };