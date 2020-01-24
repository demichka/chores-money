const User = require("../models/User.model");
const encryptPassword = require("../helpers/encrypt-password");
const sendEmail = require('../helpers/sendEmail');

const registerUser = app => {
	app.post("/api/register", async (req, res) => {
		const { email, phone, password } = req.body;
		const user = new User({
			...req.body,
			password: encryptPassword(password)
		});

		let notUniqueEmail = await User.findOne({ email: email });

		if (notUniqueEmail) {
			return res.status(500).json({ errMsg: "Email address is already exists.", code: 'duplicateEmail' });
		}

		let notUniquePhone = await User.findOne({ phone: phone });

		if (notUniquePhone) {
			return res.status(500).json({ errMsg: "Phone number is already exists.", code: "duplicatePhone" });
		}

		try {
			await user.save();
			res.json({
				message: `Account is successfully registered`,
				user: user,
				email: user.email
			});
		} catch (error) {
			return res.status(400).json(error);
		}

		const link = "http://localhost:4200";
		sendEmail({
			to: user.email,
			html: `<body><p>Click on link - <a href="${link}" target=_blank title="Log in on Chores&Money">Log in on Chores&Money</a></p>
			<p>Your credentials:</p>
			<dl>
				<dd>email: ${user.email}</dd>
				<dd>phone: ${user.phone}</dd>
				<dd>password: ${password}</dd>
			</dl>	
			</body>`,
			subject: "Chores&Money -Registration email NO REPLY"
		});

		res.status(200).end();
	});
};

module.exports = registerUser;
