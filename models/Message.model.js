const Mongoose = require("mongoose");
const { Schema, model } = Mongoose;
const messageSchema = new Schema({
	text: {
		type: String,
		required: true,
		maxlength: 70
    },
    choreAction: {
        type: String,
        maxlength: 80,
        required: true
    },
	date: {
		type: Date,
		default: Date.now()
    },
    unread: {
        type: Boolean,
        default: true,
        required: true
    },
	sender: {
		type: Schema.Types.ObjectId,
		ref: "User",
		required: true
	},
	receiver: {
		type: Schema.Types.ObjectId,
		ref: "User",
		required: true
	}
});

const messageModel = new model("Message", messageSchema);
module.exports = messageModel;
