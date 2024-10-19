import express from "express";
import { validateToken } from "../middlewares/validateTokenHandler.js";
import { addNotes, deleteNotes, getNotes, updateNotes } from "../controllers/noteController.js";

const router = express.Router();

router.post('/add-notes',validateToken,addNotes);
router.get('/get-notes',validateToken,getNotes);
router.put('/update-notes/:notesId',validateToken,updateNotes);
router.delete('/delete-notes/:notesId',validateToken,deleteNotes);

export default router;