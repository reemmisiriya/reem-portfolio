
require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const Contact = require("./models/Contact");

const app = express();
const PORT = 3000;

// Parse JSON requests
app.use(express.json());

// Serve frontend files
app.use(express.static(path.join(__dirname, "public")));

// Connect to local MongoDB
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log("MongoDB connected successfully!"))
    .catch((error) => console.error("MongoDB connection error:", error));

// Receive and save contact form messages
app.post("/api/contact", async (req, res) => {
    try {
        const { name, email, message } = req.body;

        if (
            typeof name !== "string" ||
            typeof email !== "string" ||
            typeof message !== "string" ||
            !name.trim() ||
            !email.trim() ||
            !message.trim()
        ) {
            return res.status(400).json({
                message: "Please fill in all fields."
            });
        }

        const contact = new Contact({
            name: name.trim(),
            email: email.trim(),
            message: message.trim()
        });

        await contact.save();

        res.status(201).json({
            message: "Your message has been saved successfully!"
        });
    } catch (error) {
        console.error("Contact form error:", error);
        res.status(500).json({
            message: "Unable to save your message. Please try again."
        });
    }
});

// Serve portfolio homepage
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

mongoose.connection.once("open", () => {
    console.log("Database is ready.");
});

app.listen(PORT, () => {
    console.log(`Portfolio running at http://localhost:${PORT}`);
});

