const Message = require('../models/Message.model');
const User = require("../models/User.model");

const messagesRoutes = app => {
    app.post("/api/create-message", async (req, res) => {
        const {
            user
        } = req.session;
        if (!user) {
            return res.status(400).json({
                error: "You are not logged in"
            });
        }
        let sender = await User.findById(user._id);
        let {
            text,
            receiverId
        } = req.body;

        const message = new Message({
            text: text,
            sender: sender._id,
            receiver: receiverId
        });



        try {
            const result = await message.save();
            res.status(200).json(result);
        } catch (error) {
            res.status(500).json(error);
        }
    });

    app.patch("/api/read-message/:id", async (req, res) => {
        const {
            user
        } = req.session;
        let message;
        if (!user) {
            return res.status(400).json({
                error: "You are not logged in"
            });
        }

        try {
            message = await Message.findById(req.params.id);
            await message.updateOne({
                unread: false
            });
            await message.save();
            return res.status(200).json(message);
        } catch (error) {
            res.status(500).json(error);
        }
    });

    app.delete("/api/remove-message/:id", async (req, res) => {
        const {
            user
        } = req.session;
        let message;
        if (!user) {
            return res.status(400).json({
                error: "You are not logged in"
            });
        }

        try {
            message = await Message.findById(req.params.id);
        } catch (error) {
            res.status(400).json({
                message: "Message not found"
            });
        }
        try {

            await message.deleteOne({
                _id: req.params.id
            });
            return res.status(200).json({
                message: "Message removed"
            });
        } catch (error) {
            res.status(500).json(error);
        }
    })

    app.get("/api/my-messages", async (req, res) => {
        const {
            user
        } = req.session;
        if (!user) {
            return res.status(400).json({
                error: "You are not logged in"
            });
        }

        try {
            let sentMessages = await User.findById(user._id).populate({
                path: 'sentMessages',
                populate: {
                    path: "sender receiver",
                    model: 'User'
                }
            });

            let receivedMessages = await User.findById(user._id).populate({
                path: 'receivedMessages',
                populate: {
                    path: "sender receiver",
                    model: 'User'
                }
            });

            return res.status(200).json({
                sent: sentMessages,
                received: receivedMessages
            });


        } catch (error) {
            return res.status(500).json(error);
        }
    });
}

module.exports = messagesRoutes;