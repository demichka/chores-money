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

const checkIfAdmin = user => {
	user.isAdmin = user._id;
	if (user.role === "admin") {
		user.isAdmin = "-1";
	}
};

userSchema.pre("save", function() {
	checkIfAdmin(this);
});

userSchema.post("save", (error, doc, next) => {
	if (
		error.name === "MongoError" &&
		error.code === 11000 &&
		error.errmsg.includes("isAdmin")
	) {
		next(new Error("Admin already exists"));
	} else {
		next();
	}
});

userSchema.virtual("chores", {
	ref: "Chore",
	localField: "_id",
	foreignField: "recipient"
});

const userModel = new model("User", userSchema);
module.exports = userModel;
