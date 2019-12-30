const Mongoose = require("mongoose");
const { Schema, model } = Mongoose;
const userSchema = new Schema(
	{
		name: {
			type: String,
			required: true
		},
		email: {
			type: String,
			required: true,
			unique: true
		},
		phone: {
			type: String,
			required: true,
			unique: true
		},
		role: {
			type: String,
			required: true,
			default: "parent",
			enum: ["parent", "child", "admin"],
			immutable: true
		},
		isAdmin: {
			type: String,
			unique: true
		},
		balance: {
			type: Number,
			required: true,
			default: 0
		},
		children: [{ type: Schema.Types.ObjectId, ref: "User" }],
		parents: [{ type: Schema.Types.ObjectId, ref: "User" }],
		password: {
			type: String,
			required: true
		},
		isActive: {
			type: Boolean,
			default: true
		}
	},
	{
		toJSON: { virtuals: true }
	}
);

userSchema.virtual("chores", {
	ref: "Chore",
	localField: "_id",
	foreignField: "recipient"
});

const userModel = new model("User", userSchema);
module.exports = userModel;
