const Chore = require("../models/Chore.model");
const User = require("../models/User.model");

const createChore = app => {
	app.post("/api/create-chore", async (req, res) => {
		const { user } = req.session;
		let performer, payer;
		if (!user) {
			return res.status(400).json({ error: "You are not logged in" });
		}
		let author = await User.findById(user._id);
		let { desc, isDonation, cost, phone } = req.body;

		if (author.isParent) {
			performer = await User.findOne({ phone: String(phone) });
			payer = author;
			if (isDonation) {
				var isDone = true;
			}
		} else {
			performer = author;
			payer = await User.findOne({ phone: String(phone) });
		}

		const chore = new Chore({
			desc: desc,
			isDonation: isDonation,
			isDone: isDone || false,
			cost: cost,
			payer: payer._id,
			performer: performer._id,
			author: author._id
		});

		try {
			const result = await chore.save();
			res.status(200).json(result);
		} catch (error) {
			res.status(500).json(error);
		}
	});
};

module.exports = createChore;
