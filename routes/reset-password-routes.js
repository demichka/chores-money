const User = require('../models/User.model');
const encryptPassword = require('../helpers/encrypt-password');
const sendEmail = require('../helpers/sendEmail');

module.exports = resetPassword = app => {
    //if user click on forgot password on login-page

   app.post("/api/reset-password", async (req, res) => {
    const {email} = req.body;

    let user = await User.findOne({email: email});

    if(!user) {
        return res.status(400).json({error: "No user with such email"});
    }

    let newPassword = generatePassword();
    user.password = encryptPassword(newPassword);
    await user.save();

    sendEmail({
        to: user.email,
        html: `<body><p>Hi ${user.name}!</p><p>This is your new password: ${newPassword}</p></body>`,
        subject: 'Chores&Money - reset password | NO REPLY'
    });

    res.status(200).end();

   })





    generatePassword = () => {
        let symbols = 'qwertyuiopasdfghjklzxcvbnm1234567890QWERTYUIOPASDFGHJKLZXCVBNM';
        symbols = symbols.split("");
        let password = "";
        for (let i = 0; i <=5; i++) {
            let l = symbols[Math.floor(Math.random() * symbols.length)];
            password = password + l;
        }

        return password;
    }
    
    
}