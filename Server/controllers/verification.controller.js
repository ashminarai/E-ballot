const nodemailer = require('nodemailer');

exports.sendMail = (req, res) => {

    const {email} = req.body;

    const verificationCode = Math.floor(100000 + Math.random() * 900000);

    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        service: 'gmail',
        auth: {
            user: process.env.GMAIL_EMAIL,
            pass: process.env.GMAIL_PASSWORD,
        },
    });

    const mailOptions = {
        from: process.env.GMAIL_EMAIL,
        to: email,
        subject: 'Verify your email',
        html: `Please use the following verification code to verify your email: <strong>${verificationCode}</strong>`,
    };

    // Send the verification email
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error(error);
            res.status(500).send('Failed to send verification email.');
        } else {

            req.session.email = email;
            req.session.verificationCode = verificationCode;
            console.log(req.session.verificationCode)
            res.status(200).send('Verification email sent successfully!');
        }
    });
}

exports.verifyOTP = (req, res) => {
    const {otp} = req.body
    console.log(otp,req.session.verificationCode)
    if (otp === req.session.verificationCode) {
        res.status(200).send({status: true, msg: 'Email verification successful!'});
    } else {
        res.status(404).send({status: false, msg: 'Email verification failed!'});
    }
}