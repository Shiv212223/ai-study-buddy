"use client";

type Props = {
  setSection: (section: string) => void;
};

export default function Sidebar({ setSection }: Props) {
  return (
    <div className="w-64 bg-black text-white p-6">
      <h1 className="text-2xl font-bold mb-8">AI Study Buddy</h1>

      <button
        onClick={() => setSection("Upload Notes")}
        className="block mb-4 hover:text-gray-300"
      >
        Upload Notes
      </button>

      <button
        onClick={() => setSection("Chat AI")}
        className="block mb-4 hover:text-gray-300"
      >
        Chat AI
      </button>

      <button
        onClick={() => setSection("Summary")}
        className="block mb-4 hover:text-gray-300"
      >
        Summary
      </button>

      <button
        onClick={() => setSection("Quiz Generator")}
        className="block mb-4 hover:text-gray-300"
      >
        Quiz Generator
      </button>

      {/* ✅ ADD THIS */}
      <button
        onClick={() => setSection("Analytics")}
        className="block mb-4 hover:text-gray-300"
      >
        Analytics
      </button>

    </div>
  );
}