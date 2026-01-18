import React, { useState } from "react";
import "./style/theme.css";
import "./style/home-theme.css";
import axios from "axios";

const Home = () => {
  const [noteInput, setNoteInput] = useState("");
  const [pdfUrl, setPdfUrl] = useState("");
  const [showPdf, setShowPdf] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [notesHistory, setNotesHistory] = useState([]);

  const handleNewNote = () => {
    setNotesHistory(["", ...notesHistory]);
    setPdfUrl("");
    setShowPdf(false);
    setNoteInput("");
  };

  const handleGenerateNote = async (e) => {
    e.preventDefault();
    if (!noteInput.trim() || isLoading) return;

    setIsLoading(true);
    setPdfUrl("");
    setShowPdf(false);

    try {
      const res = await axios.post(
        "http://localhost:3000/api/notes/generate",
        { question: noteInput },
        { responseType: "blob" }
      );

      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "handwritten-notes.pdf");
      document.body.appendChild(link);
      link.click();

      setNotesHistory([noteInput, ...notesHistory]);
      setNoteInput("");
    } catch (err) {
      console.error(err);
      setPdfUrl("");
      setShowPdf(false);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="chat-layout">
      {/* Sidebar */}
      <aside className="chat-sidebar">
        <button className="new-chat-btn" onClick={handleNewNote}>
          <span>+</span> New Note
        </button>
        <div className="conversations-list">
          {notesHistory.map((note, idx) => (
            <button key={idx} className="conversation-item">
              <span className="conversation-title">{note || "Untitled Note"}</span>
            </button>
          ))}
        </div>
      </aside>

      {/* Main Chat Area */}
      <main className="chat-main">
        {!showPdf ? (
          <div className="centered-welcome">
            <h2 className="welcome-question">Where should we begin?</h2>
            <form onSubmit={handleGenerateNote} className="centered-input-form">
              <div className="centered-input-wrapper">
                <button type="button" className="input-icon-btn plus-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="12" y1="5" x2="12" y2="19"></line>
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                  </svg>
                </button>
                <input
                  type="text"
                  value={noteInput}
                  onChange={(e) => setNoteInput(e.target.value)}
                  placeholder="Ask anything"
                  className="centered-input"
                  disabled={isLoading}
                />
                <button type="button" className="input-icon-btn mic-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path>
                    <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
                    <line x1="12" y1="19" x2="12" y2="23"></line>
                    <line x1="8" y1="23" x2="16" y2="23"></line>
                  </svg>
                </button>
                <button
                  type="submit"
                  className="input-icon-btn send-waveform-btn"
                  disabled={!noteInput.trim() || isLoading}
                >
                  {isLoading ? (
                    <div className="loading-spinner-small"></div>
                  ) : (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                      <rect x="2" y="8" width="3" height="8" rx="1"></rect>
                      <rect x="7" y="4" width="3" height="12" rx="1"></rect>
                      <rect x="12" y="6" width="3" height="10" rx="1"></rect>
                      <rect x="17" y="3" width="3" height="13" rx="1"></rect>
                    </svg>
                  )}
                </button>
              </div>
            </form>
          </div>
        ) : (
          //pdf download ke liye chalega
          <div className="chat-messages">
            <div className="pdf-display-container">
              <div className="pdf-preview-container">
                <div className="pdf-header">📄 Generated Handwritten Notes</div>
                <iframe src={pdfUrl} title="Generated PDF" className="pdf-iframe"></iframe>
                <a href={pdfUrl} download target="_blank" rel="noopener noreferrer">
                  <button className="download-btn">Download PDF</button>
                </a>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Home;
