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
		var isDone = false;
		var isConfirmed = false;

		if (author.isParent) {
			performer = await User.findOne({ phone: String(phone) });
			payer = author;
			isConfirmed = true;
			if (isDonation) {
				isDone = true;
				isConfirmed = true;
			}
		} else {
			performer = author;
			payer = await User.findOne({ phone: String(phone) });
		}

		const chore = new Chore({
			desc: desc,
			isDonation: isDonation,
			isDone: isDone,
			cost: cost,
			payer: payer._id,
			performer: performer._id,
			author: author._id,
			isConfirmed: isConfirmed
		});

		try {
			const result = await chore.save();

			// //save updated user to session

			// if(user._id == payer._id) {
			// 	req.session.user = payer;
			// 	req.session.save(function(err) {
			// 		if(err) {
			// 			throw error(err);
			// 		}
			// 	});
			// }
			res.status(200).json(result);
		} catch (error) {
			res.status(500).json(error);
		}
	});

	app.put("/api/confirm-chore/:id", async (req, res) => {
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

		const payer = await User.findById(chore.payer._id);

		try {
			await chore.updateOne({ isConfirmed: true });
			if(chore.isDonation) {
				await chore.updateOne({ isDone: true });
			}
			await chore.save();
			await payer.save();
			//save updated user to session

			if(user._id == payer._id) {
				req.session.user = payer;
				req.session.save(function(err) {
					if(err) {
						throw error(err);
					}
				});
			}
		} catch (error) {
			return res.status(500).json(error);
		}
		res.status(200).json(chore);
	});

	app.delete("/api/reject-chore/:id", async (req, res) => {
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

		try {
			await chore.deleteOne({ _id: req.params.id });
		} catch (error) {
			return res.status(500).json(error);
		}
		res.status(200).end();
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
		let payer = await User.findById(chore.payer);
		let performer = await User.findById(chore.performer);

		try {
			await chore.updateOne({ isPaid: true });

			await chore.save();

			//save updated user to session
			if(user._id == payer._id) {
				req.session.user = payer;
				req.session.save(function(err) {
					if(err) {
						throw error(err);
					}
				});
			}
			

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

	app.get("/api/my-chores", async (req, res) => {
		const { user } = req.session;
		if (!user) {
			return res.status(400).json({ error: "You are not logged in" });
		}

		try {
			let childChores = await User.findById(user._id)
				.populate({
					path: "assignedChores",
					populate: {
						path: "performer",
						model: "User"
					}
				});

			let parentChores = await User.findById(user._id).populate({
				path: "choresFromParent",
				populate: {
					path: "payer",
					model: "User"
				}
			});

			if (user.isParent) {
				return res.status(200).json({
					choresFromParent: parentChores.choresFromParent
				});
			} else {
				return res.status(200).json({
					myChores: childChores.myChores,
					choresFromParent: childChores.assignedChores
				});
			}
		} catch (error) {
			return res.status(500).json(error);
		}
	});
};

module.exports = createChore;
