const Mongoose = require("mongoose");
const { Schema, model } = Mongoose;
const userSchema = new Schema(
	{
		name: {
			type: String,
			required: true,
			max: 10,
			min: 3
		},
		email: {
			type: String,
			required: true,
			unique: true
		},
		phone: {
			type: String,
			required: true,
			unique: true,
			max: 10,
			min: 3
		},
		role: {
			type: String,
			required: true,
			default: "user",
			enum: ["user", "admin"],
			immutable: true
		},
		isParent: {
			type: Boolean,
			default: true,
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
		},
		currency: {
			type: String,
			default: 'SEK'
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

userSchema.virtual("assignedChores", {
	ref: "Chore",
	localField: "_id",
	foreignField: "performer",
	options: { sort: { date: 'desc' } }
});

userSchema.virtual("choresForPayment", {
	ref: "Chore",
	localField: "_id",
	foreignField: "payer",
	options: { sort: { date: 'desc' } }
});

userSchema.virtual("outgoingTransactions", {
	ref: "Transaction",
	localField: "_id",
	foreignField: "author",
	options: { sort: { date: 'desc' } }

});

userSchema.virtual("incomingTransactions", {
	ref: "Transaction",
	localField: "_id",
	foreignField: "receiver",
	options: { sort: { date: 'desc' } }
});

userSchema.methods.toJSON = function() {
	var obj = this.toObject();
	delete obj.password;
	delete obj.isAdmin;
	return obj;
};
const userModel = new model("User", userSchema);
module.exports = userModel;
