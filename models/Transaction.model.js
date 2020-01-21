const Mongoose = require("mongoose");
const { Schema, model } = Mongoose;
const transactionSchema = new Schema({
	amount: {
		type: Number,
		required: true,
		min: 1
	},
	desc: {
		type: String,
		required: true,
		maxlength: 30
	},
	date: {
		type: Date,
		default: Date.now()
	},
	author: {
		type: Schema.Types.ObjectId,
		ref: "User",
		required: true
	},
	receiver: {
		type: Schema.Types.ObjectId,
		ref: "User",
		required: false
	}
});

const transactionModel = new model("Transaction", transactionSchema);
module.exports = transactionModel;
