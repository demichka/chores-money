const User = require('../models/User.model');

const updateProfile = app => {
    app.patch("/api/update-profile", async (req, res) => {
        const {
            user
        } = req.session;
        if (!user) {
            return res.status(400).json({
                error: "You are not logged in"
            });
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
        // await userToUpdate.save();

    });
}

module.exports = updateProfile;