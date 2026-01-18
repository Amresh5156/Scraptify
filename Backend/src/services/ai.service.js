const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY
});

async function generateNoteContent(text) {
  const prompt = `
Convert the following answer into handwritten-style student notes.

STRICT RULES:
- No markdown symbols (#, *, -, _, backticks)
- No JSON
- Plain notebook-style writing
- Short sentences
- Use bullet symbol: •
- Blank line between sections
- Insert [PAGE_BREAK] for new pages
`;

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: [
      { role: "user", parts: [{ text: prompt + "\n\n" + text }] }
    ]
  });

  return response.candidates[0].content.parts[0].text;
}

module.exports = { generateNoteContent };
