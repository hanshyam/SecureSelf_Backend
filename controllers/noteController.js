import asyncHandler from 'express-async-handler';
import noteModel from '../models/noteModel.js';
import mongoose from 'mongoose';
//import v// validate here your mongo id from '../utils/validateMongoId.js';

// Add a new note
const addNotes = asyncHandler(async (req, res) => {
    const { title, description } = req.body;
    const { _id } = req.user; // _id of the user
    const note = await noteModel.create({
        title,
        description,
        userId: _id // Store userId as ObjectId
    });

    res.json({ message: "Notes created successfully", note });
});

// Get notes by category and userId
const getNotes = asyncHandler(async (req, res) => {
    const { category } = req.body;
    const { _id } = req.user; // _id of the user
    // If category is not provided, fetch notes without filtering by category
    const query = { userId: _id };
    if (category) {
        query.category = category;
    }

    try {
        const notes = await noteModel.find(query);

        // Check if notes is empty
        if (notes.length === 0) {
            return res.status(404).json({ message: "No notes found for the given user and category." });
        }

        // Return the found notes
        res.status(200).json(notes);

    } catch (error) {
        res.status(500).json({ message: "Failed to fetch notes", error: error.message });
    }
});

// Update a note by noteId
const updateNotes = asyncHandler(async (req, res) => {
    const { notesId } = req.params;
    // validate here your mongo id(notesId);
    // Find the note by its ID
    const note = await noteModel.findById(notesId);
    if (!note) {
        return res.status(404).json({ message: "Note not found" });
    }

    // Update the note with new data
    const updatedNotes = await noteModel.findByIdAndUpdate(notesId, req.body, { new: true });

    res.json({ message: "Note updated successfully", updatedNotes });
});

// Delete a note by noteId
const deleteNotes = asyncHandler(async (req, res) => {
    const { notesId } = req.params;
    // validate here your mongo id(notesId);
    // Find and delete the note
    const deletedNote = await noteModel.findByIdAndDelete(notesId);
    if (!deletedNote) {
        return res.status(404).json({ message: "Note not found" });
    }

    res.json({ message: "Note deleted successfully" });
});

export {
    addNotes,
    getNotes,
    updateNotes,
    deleteNotes
};
