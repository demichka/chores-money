const express = require("express");
const session = require("express-session");
const mongoose = require("mongoose");
const createRoutes = require("./routes/common-routes");
const connectionDB = require("./config/connectionDB");
const connectMongo = require("connect-mongo")(session);
const useCustomRoutes = require("./routes/custom-routes");

const app = express();
const salt = "Not a big secret";
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
app.use(
	session({
		secret: salt,
		resave: false,
		saveUninitialized: true,
		cookie: { secure: false }, //true on https
		store: new connectMongo({ mongooseConnection: mongoose.connection })
	})
);

createRoutes(app);
useCustomRoutes(app);

app.listen(port, () => {
	console.log("Server is listening to", port);
});
