import React, { useState } from 'react';
import './style/theme.css';
import './style/home-theme.css';

const Home = () => {
  const [notesHistory, setNotesHistory] = useState([]);
  const [noteInput, setNoteInput] = useState("");

  const handleNewNote = () => {
    setNotesHistory(["", ...notesHistory]);
  };

  const handleGenerateNote = (e) => {
    e.preventDefault();
    if (noteInput.trim() !== "") {
      setNotesHistory([noteInput, ...notesHistory]);
      setNoteInput("");
    }
  };

  return (
    <div className="home-layout">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <h2>Notes</h2>
          <button className="new-note-btn" onClick={handleNewNote}>+ New Note</button>
        </div>
        <ul className="notes-history">
          {notesHistory.map((note, idx) => (
            <li key={idx} className="history-item">{note || "Untitled Note"}</li>
          ))}
        </ul>
      </aside>

      {/* Main/Middle Panel */}
      <main className="middle-panel">
        <form onSubmit={handleGenerateNote} className="note-form">
          <textarea
            className="note-input"
            placeholder="Write your note here..."
            value={noteInput}
            onChange={e => setNoteInput(e.target.value)}
            rows={6}
            required
          />
          <button type="submit" className="gen-note-btn">Generate Note</button>
        </form>
      </main>
    </div>
  );
};

export default Home;
