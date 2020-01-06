const Transaction = require("../models/Transaction.model");
const User = require("../models/User.model");

const transactionsRoutes = app => {
	app.post("/api/create-transaction", async (req, res) => {
		const { user } = req.session;
		if (!user) {
			return res.status(400).send("You are not logged in");
		}

		let author = await User.findById(user._id);

		const { amount, desc = "" } = req.body;
		let transaction = new Transaction({
			amount: amount,
			desc: desc,
			author: author._id
		});

		try {
			if (author.balance < transaction.amount) {
				return res.status(400).json({ error: "Not enough money" });
			}
			author.balance -= transaction.amount;
			await author.save();
			let result = await transaction.save();
			res.status(200).json(result);
		} catch (error) {
			res.status(500).json(error);
		}
	});

	app.get("/api/my-transactions", async (req, res) => {
		const { user } = req.session;
		if (!user) {
			return res.status(400).send("You are not logged in");
		}

		try {
			const result = await User.findById(user._id).populate({
				path: "transactions"
			});

			res.status(200).json(result.transactions);
		} catch (error) {
			res.status(500).json(error);
		}
	});
};

module.exports = transactionsRoutes;
