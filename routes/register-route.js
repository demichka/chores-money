const User = require("../models/User.model");
const encryptPassword = require("../helpers/encrypt-password");

const registerUser = app => {
	app.post("/api/register", async (req, res) => {
		const { email, phone, password } = req.body;
		const user = new User({
			...req.body,
			password: encryptPassword(password)
		});

		let notUniqueEmail = await User.findOne({ email: email });

		if (notUniqueEmail) {
			return res.status(500).json({ error: "Email address is already exists." });
		}

		let notUniquePhone = await User.findOne({ phone: phone });

		if (notUniquePhone) {
			return res.status(500).json({ error: "Phone number is already exists." });
		}

		try {
			await user.save();
			res.status(200).json({
				message: `Account is successfully registered`,
				user: user,
				email: user.email
			});
		} catch (error) {
			return res.status(400).json(error);
		}
	});
};

module.exports = registerUser;
