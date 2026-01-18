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
          fill:rgb(0, 0, 0);
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
  if (!fs.existsSync(OUTPUT_DIR)) fs.mkdirSync(OUTPUT_DIR);

  const rawPages = text.split("[PAGE_BREAK]");
  const imagePaths = [];

  for (let i = 0; i < rawPages.length; i++) {
    const pageText = rawPages[i].trim();
    const svg = buildSVG(pageText);
    const imgPath = path.join(OUTPUT_DIR, `page-${i}.png`);

    await sharp(Buffer.from(svg)).png().toFile(imgPath);
    imagePaths.push(imgPath);
  }

  const pdfPath = path.join(OUTPUT_DIR, "handwritten.pdf");

  await new Promise((resolve) => {
    const pdf = new PDFDocument({ size: "A4" });
    const stream = fs.createWriteStream(pdfPath);

    pdf.pipe(stream);

    imagePaths.forEach((img, index) => {
      if (index !== 0) pdf.addPage();
      pdf.image(img, { fit: [595, 842] });
    });

    pdf.end();
    stream.on("finish", resolve);
  });

  return { pdfPath };
}



module.exports = { generateHandwrittenNotes };
