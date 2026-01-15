let currentSlide = 0;
const pages = document.querySelectorAll(".page");

// Check login status
function isLoggedIn() {
  return localStorage.getItem("isLoggedIn") === "true";
}

// Show slide with auth check
function showSlide(index) {
  if (index === 1 && !isLoggedIn()) {
    alert("Please login first!");
    currentSlide = 0;
  } else {
    currentSlide = index;
  }

  pages.forEach((page, i) => {
    page.classList.toggle("active", i === currentSlide);
  });
}

// Next slide
function nextSlide() {
  showSlide(currentSlide + 1);
}

// Previous slide
function prevSlide() {
  showSlide(currentSlide - 1);
}

// Login button logic
document.getElementById("loginBtn").addEventListener("click", () => {
  // Simple validation (optional)
  localStorage.setItem("isLoggedIn", "true");
  alert("Login successful!");
  showSlide(1);
});

// On page load – always start from login
window.onload = () => {
  localStorage.removeItem("isLoggedIn");
  showSlide(0);
};

async function generateHandwriting() {
    const text = document.getElementById("textInput").value;
    const font = document.getElementById("fontSelect").value;

    if (!text) {
        alert("Please enter some text!");
        return;
    }

    try {
        // Backend call
        const response = await fetch("http://localhost:3000/generate", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ text, font })
        });

        const data = await response.json();

        // PDF generate using jsPDF
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();

        // Set font (default Times, can later map to handwriting font)
        doc.setFont("times", "normal");
        doc.text(data.generatedText.join(" "), 10, 10);

        // Download PDF
        doc.save("HandwritingNotes.pdf");

    } catch (err) {
        console.error(err);
        alert("Error connecting to backend");
    }
}
