
const router = require('express').Router();
const controller = require('../controller/controller');
const upload = require('../middleware/file'); 

router.post('/signup', controller.signup);
router.post('/verifyOtp', controller.verifyOTP);
router.post('/resendOtp', controller.resendOTP);
router.post('/login', controller.login);
router.post('/forgotPassword', controller.forgotPassword);
router.post('/changePassword', controller.changePassword);

// router.post('/uploadProfilePicture', upload.single('profilePicture'), controller.uploadProfilePicture);

router.post('/uploadProfilePicture', upload.array('profilePicture', 10), controller.uploadProfilePicture)
router.post('/updateProfilePicture', upload.array('profilePicture', 10),controller.updateProfilePicture)


module.exports = router;
