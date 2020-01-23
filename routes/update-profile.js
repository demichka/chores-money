const User = require('../models/User.model');

const updateProfile = app => {
    app.patch("/api/update-profile", async (req, res) => {
        const {
            user
        } = req.session;
        if (!user) {
            return res.status(400).json({
                errorMsg: "You are not logged in"
            });
        }

        let duplicatePhone = await User.findOne({phone: req.body.phone});
        let duplicateEmail = await User.findOne({email: req.body.email});

        if( duplicatePhone && duplicatePhone._id != user._id) {
            return res.status(500).send({errMsg: 'Phone number is already owned by another user', code: 'duplicatePhone' });
        }
        if(duplicateEmail && duplicateEmail._id != user._id) {
            return res.status(500).send({errMsg: 'Email address is already owned by another user', code: "duplicateEmail" });
        }

        try {
            var userToUpdate = await User.findById(user._id);
        } catch (error) {
            return res.status(400).json(error);
        }

        try {
            await userToUpdate.updateOne(req.body);
            const updated = await User.findById(user._id);
            req.session.user = updated;
            req.session.save(function (err) {
                if (err) {
                    throw error(err);
                }
            });
            return res.status(200).json(updated);

        } catch (error) {
            return res.status(400).json(error);
        }
    });
}

module.exports = updateProfile;