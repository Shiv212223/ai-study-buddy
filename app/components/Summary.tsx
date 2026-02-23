"use client";
import { useState } from "react";

export default function Summary() {
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);

  const generateSummary = async () => {
    setLoading(true);
    setSummary("");

    try {
      const res = await fetch("http://127.0.0.1:8000/summary");
      const data = await res.json();

      setSummary(data.summary);
    } catch (error) {
      console.error(error);
      setSummary("Backend not responding.");
    }

    setLoading(false);
  };

  return (
    <div className="p-4 border rounded-lg mt-4">
      <h2 className="text-xl font-bold mb-2">AI Summary</h2>

      <button
        onClick={generateSummary}
        className="bg-blue-500 text-white px-4 py-2"
      >
        Generate Summary
      </button>

      {loading && <p className="mt-4">AI is thinking...</p>}

      {summary && <p className="mt-4">{summary}</p>}
    </div>
  );
}