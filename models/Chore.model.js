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
	performer: {
		type: Schema.Types.ObjectId,
		ref: "User",
		required: true
	},
	payer: {
		type: Schema.Types.ObjectId,
		ref: "User",
		required: true
	},
	author: {
		type: Schema.Types.ObjectId,
		ref: "User",
		required: true
	},
	date: {
		type: Date,
		default: Date.now()
	},
	isConfirmed: {
		type: Boolean,
		default: true,
		required: true
	}
});

const choreModel = new model("Chore", choreSchema);
module.exports = choreModel;
