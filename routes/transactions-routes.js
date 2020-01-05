const Transaction = require("../models/Transaction.model");
const User = require("../models/User.model");

const createTransaction = app => {
	app.post("/api/my-transactions/create-transaction", async (req, res) => {
		const { user } = req.session;
		if (!user) {
			return res.status(400).send("You are not logged in");
		}

		const { amount, desc = "" } = req.body;
		let transaction = new Transaction({
			amount: amount,
			desc: desc
		});

		let man = await User.findById(user._id);

		try {
			if (man.balance < transaction.amount) {
				return res.status(400).json({ error: "Not enough money" });
			}
			man.balance -= transaction.amount;
			await man.save();
			let result = await transaction.save();
			res.status(200).json(result);
		} catch (error) {
			res.status(500).json(error);
		}
	});
};

module.exports = createTransaction;
