const puppeteer = require("puppeteer");
const fs = require("fs");
const path = require("path");

// Load font and convert to base64 ONCE
const fontBase64 = fs.readFileSync(
  path.resolve("assets/fonts/handwriting.ttf")
).toString("base64");

const TEMPLATE = path.resolve("templates/handwritten.html");
const OUTPUT = path.resolve("output/handwritten.pdf");

async function generateHandwrittenNotes(text) {

  // Convert PAGE_BREAK into real HTML page breaks
  const formatted = text.replace(
    /\[PAGE_BREAK\]/g,
    '<div style="page-break-after: always;"></div>'
  );

  // Inject both font + content into template
  const html = fs.readFileSync(TEMPLATE, "utf8")
    .replace("{{FONT_BASE64}}", fontBase64)
    .replace("{{CONTENT}}", formatted);

    const browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"]
    });
    
  const page = await browser.newPage();

  await page.setContent(html, {
    waitUntil: "domcontentloaded",
    timeout: 0
  });
  
  await new Promise(resolve => setTimeout(resolve, 500));
  


  await page.pdf({
    path: OUTPUT,
    format: "A4",
    printBackground: true,
    margin: { top: "40px", bottom: "40px", left: "40px", right: "40px" }
  });

  await browser.close();

  return { pdfPath: OUTPUT };
}

module.exports = { generateHandwrittenNotes };
