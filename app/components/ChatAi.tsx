"use client";
import { useState } from "react";

export default function ChatAI() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);

  const askAI = async () => {
    if (!question) return;

    setLoading(true);

    try {
      const res = await fetch("http://127.0.0.1:8000/ask", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ question }),
      });

      const data = await res.json();
      setAnswer(data.answer);
    } catch (error) {
      console.error(error);
      setAnswer("AI server not responding.");
    }

    setLoading(false);
  };

  const getSummary = async () => {
    setLoading(true);

    try {
      const res = await fetch("http://127.0.0.1:8000/summary", {
        method: "GET",
      });

      const data = await res.json();
      setAnswer(data.summary);
    } catch (error) {
      console.error(error);
      setAnswer("Summary failed.");
    }

    setLoading(false);
  };

  return (
    <div className="p-4 border rounded-lg mt-4">
      <h2 className="text-xl font-bold mb-2">Chat with AI</h2>

      <input
        type="text"
        placeholder="Ask something from your notes..."
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        className="border p-2 w-full"
      />

      <div className="flex gap-2 mt-3">
        <button
          onClick={askAI}
          className="bg-green-500 text-white px-4 py-2 rounded"
        >
          Ask AI
        </button>

        <button
          onClick={getSummary}
          className="bg-purple-500 text-white px-4 py-2 rounded"
        >
          Generate Summary
        </button>
      </div>

      {loading && <p className="mt-4">AI is thinking...</p>}

      {!loading && answer && (
        <p className="mt-4 whitespace-pre-line">{answer}</p>
      )}
    </div>
  );
}