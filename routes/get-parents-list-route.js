const User = require("../models/User.model");

const getParentsList = app => {
	app.get("/api/my-parents", async (req, res) => {
		const { user } = req.session;
		if (!user) {
			return res.status(400).send("You are not logged in");
		}

		try {
			const child = await User.findById(user._id).populate(
				"parents",
				"name phone"
			);
			res.status(200).json(child.parents);
		} catch (error) {
			res.status(500).json(error);
		}
	});
};

module.exports = getParentsList;
