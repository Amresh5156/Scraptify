const { generateNoteContent } = require("../services/ai.service.js");
const { generateHandwrittenNotes } = require("../services/handwriting.service.js");

const createNotes = async (req, res) => {
  const { question } = req.body;

  const answer = await generateNoteContent(question);
  const handwritten = await generateHandwrittenNotes(answer);

  res.json({
    answer,
    handwritten
  });
};

module.exports = { createNotes };