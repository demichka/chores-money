const Transaction = require("../models/Transaction.model");
const User = require("../models/User.model");

const transactionsRoutes = app => {
	app.post("/api/create-transaction", async (req, res) => {
		const { user } = req.session;
		if (!user) {
			return res.status(400).send("You are not logged in");
		}

		const { amount, desc = "", receiver } = req.body;
		console.log(req.body)

		let author = await User.findById(user._id);
		let receiverUser = await User.findById(receiver);

		let transaction = new Transaction({
			amount: amount,
			desc: desc,
			author: author._id,
			receiver: receiver ? receiver : null
		});

		try {
			if (!author.isParent && author.balance < transaction.amount) {
				return res.status(400).json({ error: "Not enough money" });
			}
			if(!author.isParent) {
				author.balance -= transaction.amount;
			}
			else {
				receiverUser.balance += transaction.amount;
				await receiverUser.save();
				author.balance -= transaction.amount;
			}
			
			await author.save();
			
			
			req.session.user = author;
			req.session.save(function(err) {
				console.log(req.session.user)
				if(err) {
					throw error(err);
				}
			});
			let result = await transaction.save();
			res.status(200).json(result);
		} catch (error) {
			console.log(error)
			res.status(500).json({error: error});
		}
	});

	app.get("/api/my-transactions", async (req, res) => {
		const { user } = req.session;
		if (!user) {
			return res.status(400).send("You are not logged in");
		}

		try {
			const result = await User.findById(user._id).populate({
				path: "outgoingTransactions",
				populate: {
					path: 'author',
					model: 'User'
				}
				
			}).populate({
				path: "incomingTransactions",
				populate: {
					path: 'receiver',
					model: 'User'
				}
			});

			res.status(200).json({incoming: result.incomingTransactions, outgoing: result.outgoingTransactions});
		} catch (error) {
			res.status(500).json(error);
		}
	});
};

module.exports = transactionsRoutes;
