const {sendMail, verifyOTP} = require("../controllers/verification.controller");
module.exports = app => {

    const router = require("express").Router();

    router.post("/sendVerificationCode",sendMail)

    router.post("/verify",verifyOTP)

    app.use('/api', router)
}