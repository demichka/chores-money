const express = require("express");
const mongoose = require("mongoose");
const connectionDB = require("./config/connectionDB");

const app = express();
app.use(express.json());
const port = 3000;
mongoose
	.connect(connectionDB, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
		useCreateIndex: true
	})
	.then(
		() => {
			global.db = mongoose.connection;
			console.log("Connected to db");
		},
		err => {
			console.error(err);
		}
	);

app.listen(port, () => {
	console.log("Server is listening to", port);
});
