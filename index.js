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

app.use((req, res, next) => {
	
	// Website you wish to allow to connect
	res.setHeader('Access-Control-Allow-Origin', 'http://localhost:4200');
	// Request methods you wish to allow
	res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

	// Request headers you wish to allow
	res.setHeader('Access-Control-Allow-Headers', 'Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers,X-Access-Token,XKey,Authorization');
  
   res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  
	// Pass to next layer of middleware
	next();
})

createRoutes(app);
useCustomRoutes(app);



app.listen(port, () => {
	console.log("Server is listening to", port);
});
