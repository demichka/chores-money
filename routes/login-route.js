const User = require("../models/User.model");
const encryptPassword = require("../helpers/encrypt-password");

module.exports = useLogin = app => {
	//when user is logging in
	app.post("/api/login", async (req, res) => {
		let { email, password } = req.body;

		let user = await User.findOne({ email: email });

		if (user) {
			if (user.password === encryptPassword(password)) {
				if (!user.isActive) {
					return res.status(400).json({ error: "User is inactive" });
				} else {
					req.session.user = user;
					return res.status(200).json(user);
				}
			} else {
				return res
					.status(400)
					.json({ error: "Password does not match" });
			}
		} else {
			return res
				.status(500)
				.json({ error: "User with such email is not found" });
		}
	});


	app.get("/api/check-login", async (req, res) => {
		if(req.session.user) {
			res.status(200).send(true);
		}
		else {
			res.status(200).send(false);
		}
	});

	app.get("/api/logout", async (req, res) => {
		const { user } = req.session;
		if (user) {
			req.session.destroy();
			res.status(200).end();
		} else {
			res.status(400).end();
		}
	});

	app.get("/api/get-user", async (req, res) => {
		const {user} = req.session;
		if(user) {
			var userInstance = await User.findById(user._id);
			res.status(200).json(userInstance);
		}
		else {
			res.status(401).end();
		}
	})
};
