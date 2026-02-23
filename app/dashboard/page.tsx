"use client";

import { useState } from "react";
import Sidebar from "../components/sidebar";
import UploadNotes from "../components/UploadNotes";
import ChatAI from "../components/ChatAi";
import Summary from "../components/Summary";
import Quiz from "../components/Quiz";
import Analytics from "../components/Analytics";

export default function Dashboard() {
  const [section, setSection] = useState("Upload Notes");

  return (
    <div className="flex h-screen">
      <Sidebar setSection={setSection} />

      <div className="flex-1 p-10">
        <h2 className="text-3xl font-semibold">{section}</h2>

        <div className="mt-6 border p-6 rounded-lg">
          {section === "Upload Notes" && <UploadNotes />}
          {section === "Chat AI" && <ChatAI />}
          {section === "Summary" && <Summary />}
          {section === "Quiz Generator" && <Quiz />}
          {section === "Analytics" && <Analytics />} 
        </div>
      </div>
    </div>
  );
}