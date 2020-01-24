const nodemailer = require('nodemailer');
const {mail} = require('../config/mailer.config');

const transporter = nodemailer.createTransport({
	host: "smtp.sendgrid.net",
	port: 465,
	secure: true,
	auth: {
		user: "apikey",
		pass: mail
	},
	tls: {
		rejectUnauthorized: false
	}
});

function sendEmail(options) {
	const defaultMailOptions = {
		from: `"Chores&Money Notification NOREPLY" miuchka@gmail.com`,
		subject: "Email subject",
		html:
			"<body><h3>Hello Zhenya!</h3><p>Hallå Zhenya! Hur är det med dig?</p></body>",
		to: null
	};

	const mailOptions = {
		...defaultMailOptions,
		...options
	};

	if (!mailOptions.to) {
		throw new Error("Mail must have recipient ('to' property)");
	}

	transporter.sendMail(mailOptions, function(err, res) {
		if (err) {
			console.error("there was an error: ", err);
        }
	});
}

module.exports = sendEmail;
