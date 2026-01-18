import React, { useState } from "react";
import "./style/theme.css";
import "./style/home-theme.css";
import axios from "axios";

const Home = () => {
  const [notesHistory, setNotesHistory] = useState([]);
  const [noteInput, setNoteInput] = useState("");

  const [pdfUrl, setPdfUrl] = useState("");
  const [showPdf, setShowPdf] = useState(false);
  const [generated, setGenerated] = useState(false);

  const handleNewNote = () => {
    setNotesHistory(["", ...notesHistory]);
  };

  const handleGenerateNote = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post("http://localhost:3000/api/notes/generate", {
        text: noteInput,
      });

      if (res.data.handwritten && res.data.handwritten.pdf) {
        setPdfUrl(res.data.handwritten.pdf);
        setShowPdf(true);
        setGenerated(true);
      } else {
        setPdfUrl("");
        setShowPdf(false);
        setGenerated(false);
      }

      setNotesHistory([noteInput, ...notesHistory]);
      setNoteInput("");
    } catch (err) {
      console.error(err);
      setPdfUrl("");
      setShowPdf(false);
      setGenerated(false);
    }
  };

  return (
    <div className="home-layout">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <h2>Notes</h2>
          <button className="new-note-btn" onClick={handleNewNote}>
            + New Note
          </button>
        </div>

        <ul className="notes-history">
          {notesHistory.map((note, idx) => (
            <li key={idx} className="history-item">
              {note || "Untitled Note"}
            </li>
          ))}
        </ul>
      </aside>

      {/* Middle Panel */}
      <main className={`middle-panel ${generated ? "panel-shrink" : ""}`}>
        <form onSubmit={handleGenerateNote} className="note-form">
          <textarea
            className={`note-input ${generated ? "input-small" : ""}`}
            placeholder="Ask a question..."
            value={noteInput}
            onChange={(e) => setNoteInput(e.target.value)}
            rows={generated ? 4 : 6}
            required
          />
          <button type="submit" className="gen-note-btn">
            Generate Note
          </button>
        </form>
      </main>

      {/* PDF Folder Panel */}
      {showPdf && pdfUrl && (
        <div className="pdf-folder">
          <div className="pdf-header">📁 Generated Handwritten Notes</div>

          <iframe src={pdfUrl} title="Generated PDF"></iframe>

          <a href={pdfUrl} download target="_blank" rel="noopener noreferrer">
            <button className="download-pdf-btn">Download PDF</button>
          </a>
        </div>
      )}
    </div>
  );
};

export default Home;
