const sharp = require("sharp");
const fs = require("fs");
const path = require("path");
const PDFDocument = require("pdfkit");

const FONT_PATH = path.resolve("assets/fonts/handwriting.ttf");
const OUTPUT_DIR = path.resolve("output");

const fontBase64 = fs.readFileSync(FONT_PATH).toString("base64");

function buildSVG(text) {
  const lines = text.split("\n");

  return `
  <svg width="2480" height="3508" xmlns="http://www.w3.org/2000/svg">

    <defs>
      <style>
        @font-face {
          font-family: 'Handwriting';
          src: url(data:font/ttf;base64,${fontBase64});
        }
        .t {
          font-family: 'Handwriting';
          font-size: 48px;
          fill: #111827;
        }
      </style>
    </defs>

    <!-- Paper -->
    <rect width="100%" height="100%" fill="#fafafa"/>

    <!-- Margin line -->
    <line x1="160" y1="0" x2="160" y2="3508" stroke="#ef4444" stroke-width="3"/>

    <!-- Ruled lines -->
    ${Array.from({ length: 45 }).map((_, i) =>
      `<line x1="160" y1="${220 + i * 80}" x2="2300" y2="${220 + i * 80}" stroke="#93c5fd" stroke-width="2"/>`
    ).join("")}

    <!-- Text -->
    ${lines.map((line, i) =>
      `<text x="200" y="${210 + (i + 1) * 80}" class="t">${line}</text>`
    ).join("")}

  </svg>`;
}

async function generateHandwrittenNotes(text) {

  const svg = buildSVG(text);
  const imagePath = path.join(OUTPUT_DIR, "handwritten.png");

  await sharp(Buffer.from(svg)).png().toFile(imagePath);

  const pdfPath = path.join(OUTPUT_DIR, "handwritten.pdf");
  const pdf = new PDFDocument({ size: "A4" });
  pdf.pipe(fs.createWriteStream(pdfPath));
  pdf.image(imagePath, { fit: [595, 842] });
  pdf.end();

  return { imagePath, pdfPath };
}

module.exports = { generateHandwrittenNotes };
