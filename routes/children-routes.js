const User = require("../models/User.model");
const encryptPassword = require("../helpers/encrypt-password");
const sendEmail = require('../helpers/sendEmail');

const registerChild = app => {
	//register and add child to list
	//add existed child

	app.post("/api/register-child", async (req, res) => {
		const { user } = req.session;
		if (!user) {
			return res.status(400).send("You are not logged in");
		}
		if (!user.isParent && user.role !== "admin") {
			return res.status(400).send("You are not parent");
		}

		const { email, phone, password } = req.body;

		let parent = await User.findById(user._id);

		let child = new User({
			...req.body,
			isParent: false,
			password: encryptPassword(password)
		});

		let notUniqueEmail = await User.findOne({ email: email });

		if (notUniqueEmail && notUniqueEmail.email == child.email) {
			return res.status(500).json({ errMsg: "Email already exists", code: "duplicateEmail" });
		}

		let notUniquePhone = await User.findOne({ phone: phone });

		if (notUniquePhone && notUniquePhone.phone == child.phone) {
			return res.status(500).json({ errMsg: "Phone already exists", code: "duplicatePhone" });
		}

		if (child.parents.includes(parent._id)) {
			return res
				.status(500)
				.json({ error: "This user is already your child" });
		}

		try {
			child.parents.push(parent);
			await child.save();
		} catch (error) {
			return res.status(400).json({ error: error });
		}

		parent.children.push(child);
		await parent.save();
		res.json({
			message: `Child is successfully registered`,
			child: child,
			email: child.email
		});

		const link = "http://localhost:4200";
		sendEmail({
			to: child.email,
			html: `<body><p>Click on link - <a href="${link}" target=_blank title="Log in on Chores&Money">Log in on Chores&Money</a></p>
			<p>Your credentials:</p>
			<dl>
				<dd>email: ${child.email}</dd>
				<dd>phone: ${child.phone}</dd>
				<dd>password: ${password}</dd>
			</dl>	
			</body>`,
			subject: "Chores&Money -Registration email NO REPLY"
		});

		res.status(200).end();
	});

	app.post("/api/add-child", async (req, res) => {
		const { user } = req.session;
		if (!user) {
			return res.status(400).send("You are not logged in");
		}
		if (!user.isParent && user.role !== "admin") {
			return res.status(400).json({error: "You are not parent"});
		}

		const { phone } = req.body;
		let parent = await User.findById(user._id);
		let child = await User.findOne({ phone: phone });
		if (!child) {
			return res
				.status(400)
				.json({ error: "No user with such phone number" });
		}
		if (parent.children.includes(child._id)) {
			return res.status(500).json({
				error: "User with such phone is already added to your children"
			});
		}
		if (child.isParent) {
			return res
				.status(400)
				.json({ error: "You can't to add another parent as a child" });
		}

		try {
			child.parents.push(parent);
			await child.save();
		} catch (error) {
			return res.status(400).json({ error: error });
		}
		try {
			parent.children.push(child);
			await parent.save();
		} catch (error) {
			return res.status(400).json({ error: error });
		}
		res.status(200).json({
			message: `Child is successfully added`,
			child: child,
			email: child.email
		});
	});

	app.get("/api/remove-child/:id", async (req, res) => {
		const { user } = req.session;
		if (!user) {
			return res.status(400).send("You are not logged in");
		}
		if (!user.isParent && user.role !== "admin") {
			return res.status(400).send("You are not parent");
		}

		let parent = await User.findById(user._id);
		let child = await User.findById(req.params.id);

		if (!parent.children.includes(child._id)) {
			return res.status(400).json({
				error: "Is not your child"
			});
		}

		try {
			parent.children.splice(parent.children.indexOf(child._id), 1);
			await parent.save();
		} catch (error) {
			return res.status(400).json({ error: error });
		}
		try {
			child.parents.splice(child.parents.indexOf(parent._id), 1);
			await child.save();
		} catch (error) {
			return res.status(400).json({ error: error });
		}
		res.status(200).end();
	});

	app.get("/api/my-children", async (req, res) => {
		const { user } = req.session;
		if (!user) {
			return res.status(400).send("You are not logged in");
		}

		try {
			const parent = await User.findById(user._id).populate(
				"children",
				"name phone"
			);
			res.status(200).json(parent.children);
		} catch (error) {
			res.status(500).json(error);
		}
	});
};

module.exports = registerChild;
