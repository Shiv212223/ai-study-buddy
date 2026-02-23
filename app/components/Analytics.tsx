"use client";
import { useEffect, useState } from "react";

export default function Analytics() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/analytics")
      .then((res) => res.json())
      .then((data) => setData(data));
  }, []);

  if (!data) return <p>Loading analytics...</p>;

  return (
    <div className="grid grid-cols-2 gap-6 mt-6">
      <Card title="Notes Uploaded" value={data.notes_uploaded} />
      <Card title="Questions Generated" value={data.questions_generated} />
      <Card title="Last Quiz Score" value={data.last_score} />
      <Card title="Overall Accuracy (%)" value={data.accuracy} />
    </div>
  );
}

function Card({ title, value }: any) {
  return (
    <div className="bg-white shadow-xl rounded-2xl p-6 border">
      <h3 className="text-gray-500 text-sm">{title}</h3>
      <p className="text-3xl font-bold text-blue-600 mt-2">{value}</p>
    </div>
  );
}