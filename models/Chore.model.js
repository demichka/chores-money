const Mongoose = require("mongoose");
const { Schema, model } = Mongoose;
const choreSchema = new Schema({
	desc: {
		type: String,
		maxlength: 50,
		required: true
	},
	isDonation: {
		type: Boolean,
		default: false,
		required: true
	},
	cost: {
		type: Number,
		default: 20,
		min: 0,
		max: 300,
		required: true
	},
	isDone: {
		type: Boolean,
		default: false,
		required: true
	},
	isPaid: {
		type: Boolean,
		default: false,
		required: true
	},
	recipient: {
		type: Schema.Types.ObjectId,
		ref: "User",
		required: true
	},
	sender: {
		type: Schema.Types.ObjectId,
		ref: "User",
		required: true
	},
	date: {
		type: Date,
		default: Date.now()
	}
});

const choreModel = new model("Chore", choreSchema);
module.exports = choreModel;
