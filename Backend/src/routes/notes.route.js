const express = require("express");
const { createNotes } = require("../controllers/notes.controller.js");

const router = express.Router();
router.post("/generate", createNotes);

module.exports = router;
