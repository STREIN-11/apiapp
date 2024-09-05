const express = require('express')
const router = express.Router();
const Note = require('../models/Note')
const fetchuser = require('../middleware/fetchuser')
const { validationResult, body } = require('express-validator');

// Route: 1 = To Get user Notes by get method
router.get('/getnotes', fetchuser, async (req, res) => {
    try {
        const notes = await Note.find({ user: req.user.id });
        res.json(notes)
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Servar Error");
    }
})

// Route: 2 = Add new note using post method login required
router.post('/addnote', fetchuser, [
    body('title', 'Enter a valid title').isLength({ min: 5 }),
    body('description', 'Enter a valid Description').isLength({ min: 5 })
], async (req, res) => {
    try {
        const { title, description } = req.body;
        const result = validationResult(req);
        if (!result.isEmpty()) {
            return res.status(400).json({ result: result.array() });
        }
        const note = new Note({
            title, description, user: req.user.id
        })
        const savenote = await note.save()
        res.json(savenote)
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Servar Error");
    }
})

// Route: 3 = for update note using put
router.put('/update/:id', fetchuser, async (req, res) => {
    const { title, description } = req.body;
    // Create new note to store value
    try {
        const newnote = {};
        if (title) { newnote.title = title };
        if (description) { newnote.description = description };

        // Find the note to be update
        let note = await Note.findById(req.params.id);
        if (!note) { return res.status(404).send("Not Found") }

        if (note.user.toString() !== req.user.id) {
            res.status(401).json({ error: "Not allowed" })
        }

        note = await Note.findByIdAndUpdate(req.params.id, { $set: newnote }, { new: true })
        res.json({ note });
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Servar Error");
    }
})

// Route: 4 = deleting note using delete
router.delete('/deletenote/:id', fetchuser, async (req, res) => {
    try {
        let note = await Note.findById(req.params.id);
        if (!note) { return res.status(404).send("Not Found") }
        if (note.user.toString() !== req.user.id) {
            res.status(401).json({ error: "Not allowed" })
        }
        note = await Note.findByIdAndDelete(req.params.id)
        res.json({ "Success": "Note Deleted Successfully" });
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Servar Error");
    }
})

module.exports = router