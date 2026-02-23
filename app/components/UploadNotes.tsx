"use client";
import { useState } from "react";

export default function UploadNotes() {
  const [file, setFile] = useState<File | null>(null);
  const [message, setMessage] = useState("");

  const uploadFile = async () => {
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("http://127.0.0.1:8000/upload", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    setMessage(`Uploaded ${data.filename} | Chunks: ${data.chunks_created}`);
  };

  return (
    <div className="p-4 border rounded-lg">
      <input
        type="file"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
      />
      <button
        onClick={uploadFile}
        className="bg-blue-500 text-white px-4 py-2 ml-2"
      >
        Upload
      </button>

      <p className="mt-2">{message}</p>
    </div>
  );
}  