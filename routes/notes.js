import express from "express";
import Note from "../models/Note.js";
import upload from "../config/noteUpload.js";

const router = express.Router();

// Upload Note
router.post("/upload", upload.single("pdf"), async (req, res) => {

    try {

        const { subject, title } = req.body;

        const file = "/notes/" + req.file.filename;

        await Note.create({
            subject,
            title,
            file
        });

        res.json({
            success: true,
            message: "Note Uploaded"
        });

    } catch (err) {

        res.status(500).json({
            success: false,
            error: err.message
        });

    }

});

// Get All Notes
router.get("/", async (req, res) => {

    const notes = await Note.find().sort({ createdAt: -1 });

    res.json(notes);

});

// Delete Note
router.delete("/:id", async (req, res) => {

    await Note.findByIdAndDelete(req.params.id);

    res.json({
        success: true
    });

});

export default router;