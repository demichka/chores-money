const User = require("../models/User.model");

const toggleUserActivity = app => {
	app.post("/api/activate-user/:id", async (req, res) => {
		const { user } = req.session;
		if (!user) {
			return res.status(400).json({ error: "You are not logged in" });
		}

		if (user.isAdmin) {
			return res.status(400).json({ error: "You are not admin" });
		}

		try {
			var userToActivate = await User.findById(req.params.id);
		} catch (error) {
			return res.status(400).json(error);
		}

		if (userToActivate.isActive) {
			return res
				.status(500)
				.json({ error: "This user is active already" });
		}

		try {
			await userToActivate.updateOne({ isActive: true });
		} catch (error) {
			return res.status(400).json(error);
		}

		return res.status(200).end();
	});

	app.post("/api/deactivate-user/:id", async (req, res) => {
		const { user } = req.session;
		if (!user) {
			return res.status(400).json({ error: "You are not logged in" });
		}

		if (user.isAdmin) {
			return res.status(400).json({ error: "You are not admin" });
		}

		try {
			var userToInactivate = await User.findById(req.params.id);
		} catch (error) {
			return res.status(400).json(error);
		}

		if (!userToInactivate.isActive) {
			return res
				.status(500)
				.json({ error: "This user is inactive already" });
		}

		try {
			await userToInactivate.updateOne({ isActive: false });
		} catch (error) {
			return res.status(400).json(error);
		}

		return res.status(200).end();
	});

	app.get("/api/isactive-user/:id", async (req, res) => {
		const { user } = req.session;
		if (!user) {
			return res.status(400).json({ error: "You are not logged in" });
		}

		if (user.isAdmin) {
			return res.status(400).json({ error: "You are not admin" });
		}

		try {
			var userToCheckActivity = await User.findById(req.params.id);
		} catch (error) {
			return res.status(400).json(error);
		}

		if (userToCheckActivity.isActive) {
			return res.status(200).send(true);
		} else {
			return res.status(200).send(false);
		}
	});
};

module.exports = toggleUserActivity;
