import axios from "axios";
import { useState } from "react";

export default function AskQuestion() {
  const [question, setQuestion] = useState("");
  const [pdf, setPdf] = useState("");

  const submit = async () => {
    const res = await axios.post("/api/notes/generate-notes", {
      question
    });
    setPdf(res.data.handwritten.pdf);
  };

  return (
    <>
      <textarea onChange={e => setQuestion(e.target.value)} />
      <button onClick={submit}>Generate Handwritten Notes</button>
      {pdf && <a href={pdf} download>Download PDF</a>}
    </>
  );
}
