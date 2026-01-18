const { generateNoteContent } = require("../services/ai.service.js");
const { generateHandwrittenNotes } = require("../services/handwriting.service.js");
const fs = require("fs");

const createNotes = async (req, res) => {
  try {
    const { question } = req.body;

    const answer = await generateNoteContent(question);
    const handwritten = await generateHandwrittenNotes(answer);

    const pdfPath = handwritten.pdfPath;

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=handwritten-notes.pdf"
    );

    const stream = fs.createReadStream(pdfPath);
    stream.pipe(res);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "PDF generation failed" });
  }
};

module.exports = { createNotes };