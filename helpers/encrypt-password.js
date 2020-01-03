const crypto = require("crypto");
const salt = "Aux butties chaumont Jouets";

const encryptPassword = password => {
	return crypto
		.createHmac("sha256", salt)
		.update(password)
		.digest("hex");
};

module.exports = encryptPassword;
