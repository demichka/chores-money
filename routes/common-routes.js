const path = require("path");
const fs = require("fs");
const prefix = "/api/";
const pathToModels = path.join(__dirname, "../models/");
var models = [];

const createModels = () => {
	fs.readdirSync(pathToModels).forEach(file => {
		let model = require(pathToModels + file);
		models.push({
			key: file.slice(0, file.indexOf(".")).toLowerCase(),
			model: model
		});
	});
};

const routes = (app, prefix, key, Model) => {
	let route = prefix + key + "s/";
	app.get(route, async (req, res) => {
		if (req.session.user) {
			try {
				let result = await Model.find();
				res.status(200).json(result);
			} catch (error) {
				console.error(error);
				res.status(400).send(error);
			}
		} else {
			res.status(400).json({ error: "Not logged in" });
		}
	});
	app.get(route + ":id", async (req, res) => {
		if (req.session.user) {
			try {
				let result = await Model.findById(req.params.id);
				res.status(200).json(result);
			} catch (error) {
				console.error(error);
				res.status(400).send(error);
			}
		} else {
			res.status(400).json({ error: "Not logged in" });
		}
	});
	app.put(route + ":id", async (req, res) => {
		if (req.session.user) {
			try {
				let result = await Model.updateOne(
					{ _id: req.params.id },
					req.body
				);
				res.status(200).json(result);
			} catch (error) {
				console.error(error);
				res.status(400).send(error);
			}
		} else {
			res.status(400).json({ error: "Not logged in" });
		}
	});
	app.post(route, async (req, res) => {
		if (key === "user") {
			return res.status(400).json({ error: "Page not found" });
		}
		try {
			let result = await new Model(req.body).save();
			res.status(200).json(result);
		} catch (error) {
			console.error(error);
			res.status(400).send(error);
		}
	});
	app.delete(route + ":id", async (req, res) => {
		if (key === "user") {
			return res.status(400).json({ error: "Page not found" });
		}
		if (req.session.user) {
			try {
				let result = await Model.deleteOne({ _id: req.params.id });
				res.status(200).json(result);
			} catch (error) {
				console.error(error);
				res.status(400).send(error);
			}
		} else {
			res.status(400).json({ error: "Not logged in" });
		}
	});
};

module.exports = createRoutes = app => {
	createModels();
	if (models.length) {
		for (let i = 0; i < models.length; i++) {
			routes(app, prefix, models[i].key, models[i].model);
		}
	}
};
