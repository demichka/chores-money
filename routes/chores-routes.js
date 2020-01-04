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

	app.put("/api/edit-chore/:id", async (req, res) => {
		const { user } = req.session;
		if (!user) {
			return res.status(400).json({ error: "You are not logged in" });
		}
		try {
			var chore = await Chore.findById(req.params.id);
		} catch (error) {
			return res.status(400).json(error);
		}
		if (!chore) {
			return res.status(500).json({ error: "Chore not found" });
		}
		if (chore.isDone || chore.isPaid) {
			return res.status(500).json({ error: "Chore is not editable" });
		}

		if (chore.author != user._id) {
			return res.status(500).json({ error: "You can't edit this chore" });
		}
		try {
			await chore.updateOne(req.body);
			await chore.save();
		} catch (error) {
			return res.status(500).json(error);
		}
		res.status(200).json(chore);
	});

	app.put("/api/set-chore-done/:id", async (req, res) => {
		const { user } = req.session;
		if (!user) {
			return res.status(400).json({ error: "You are not logged in" });
		}

		try {
			var chore = await Chore.findById(req.params.id);
		} catch (error) {
			return res.status(400).json(error);
		}
		if (!chore) {
			return res.status(400).json({ error: "Page not found" });
		}
		if (user._id != chore.performer && user._id != chore.payer) {
			return res.status(400).json({
				error: "You have no permission to set this chore as done"
			});
		}

		try {
			await chore.updateOne({ isDone: true });
			await chore.save();
			return res.status(200).json(chore);
		} catch (error) {
			res.status(400).json(error);
		}
	});

	app.put("/api/set-chore-paid/:id", async (req, res) => {
		const { user } = req.session;
		if (!user) {
			return res.status(400).json({ error: "You are not logged in" });
		}

		try {
			var chore = await Chore.findById(req.params.id);
		} catch (error) {
			return res.status(400).json(error);
		}

		if (!chore) {
			return res.status(400).json({ error: "Page not found" });
		}

		if (!user.isParent || user._id != chore.payer) {
			return res.status(400).json({
				error: "You have no permission to set this chore as paid"
			});
		}
		if (!chore.isDone) {
			return res.status(400).json({
				error: "Chore is not done and can't be paid now"
			});
		}

		try {
			await chore.updateOne({ isPaid: true });
			await chore.save();
			return res.status(200).json(chore);
		} catch (error) {
			res.status(400).json(error);
		}
	});

	app.delete("/api/remove-chore/:id", async (req, res) => {
		const { user } = req.session;
		if (!user) {
			return res.status(400).json({ error: "You are not logged in" });
		}
		try {
			var chore = await Chore.findById(req.params.id);
		} catch (error) {
			return res.status(400).json(error);
		}
		if (!chore) {
			return res.status(500).json({ error: "Chore not found" });
		}
		if (chore.isDone || chore.isPaid) {
			return res
				.status(500)
				.json({ error: "Chore is done and can't be removed" });
		}

		if (chore.author != user._id) {
			return res
				.status(500)
				.json({ error: "You can't delete this chore" });
		}
		try {
			await chore.deleteOne({ _id: req.params.id });
		} catch (error) {
			return res.status(500).json(error);
		}
		res.status(200).json({ message: "This chore is removed" });
	});
};

module.exports = createChore;
