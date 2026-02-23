"use client";
import { useState } from "react";

type QuizItem = {
  question: string;
  options: string[];
  answer: string;
};

export default function Quiz() {
  const [quiz, setQuiz] = useState<QuizItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [finished, setFinished] = useState(false);
  const [loading, setLoading] = useState(false);

  const generateQuiz = async () => {
    try {
      setLoading(true);
      const res = await fetch("http://127.0.0.1:8000/quiz");
      const data = await res.json();

      if (!data.quiz || data.quiz.length === 0) {
        alert("Please upload notes first.");
        return;
      }

      setQuiz(data.quiz);
      setCurrentIndex(0);
      setScore(0);
      setFinished(false);
      setSelected(null);
    } catch (error) {
      console.error("Quiz generation failed:", error);
      alert("Failed to generate quiz.");
    } finally {
      setLoading(false);
    }
  };

  const handleNext = () => {
    if (!selected) return;

    if (selected === quiz[currentIndex].answer) {
      setScore((prev) => prev + 1);
    }

    setSelected(null);

    if (currentIndex + 1 < quiz.length) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      setFinished(true);
    }
  };

  const restartQuiz = () => {
    setQuiz([]);
    setFinished(false);
    setScore(0);
    setCurrentIndex(0);
  };

  if (quiz.length === 0) {
    return (
      <div className="p-8 bg-white shadow-xl rounded-2xl border">
        <h2 className="text-3xl font-bold mb-6 text-gray-900">
          🧠 Quiz Generator
        </h2>

        <button
          onClick={generateQuiz}
          disabled={loading}
          className="bg-indigo-600 text-white px-8 py-3 rounded-xl 
                     hover:bg-indigo-700 transition duration-300 
                     disabled:bg-gray-400"
        >
          {loading ? "Generating..." : "Generate Quiz"}
        </button>
      </div>
    );
  }

  if (finished) {
    return (
      <div className="p-8 bg-white shadow-xl rounded-2xl border text-center">
        <h2 className="text-3xl font-bold mb-4 text-gray-900">
          🎉 Quiz Completed
        </h2>

        <p className="text-xl mb-6 text-gray-700">
          Your Score:{" "}
          <span className="font-bold text-indigo-600">
            {score} / {quiz.length}
          </span>
        </p>

        <div className="w-full bg-gray-200 rounded-full h-4 mb-6">
          <div
            className="bg-indigo-600 h-4 rounded-full transition-all duration-500"
            style={{
              width: `${(score / quiz.length) * 100}%`,
            }}
          />
        </div>

        <button
          onClick={restartQuiz}
          className="bg-indigo-600 text-white px-8 py-3 rounded-xl hover:bg-indigo-700 transition duration-300"
        >
          Take Again
        </button>
      </div>
    );
  }

  const current = quiz[currentIndex];

  return (
    <div className="p-8 bg-white shadow-xl rounded-2xl border">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-800">
          Question {currentIndex + 1} of {quiz.length}
        </h2>

        <span className="text-sm font-medium text-indigo-600">
          Score: {score}
        </span>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-gray-200 rounded-full h-2 mb-6">
        <div
          className="bg-indigo-600 h-2 rounded-full transition-all duration-500"
          style={{
            width: `${((currentIndex + 1) / quiz.length) * 100}%`,
          }}
        />
      </div>

      {/* Question */}
      <p className="text-lg font-semibold mb-6 text-gray-900">
        {current.question}
      </p>

      {/* Options */}
      <div className="space-y-3">
        {current.options.map((option, i) => {
          const isCorrect = option === current.answer;
          const isSelected = selected === option;

          const optionLetter = String.fromCharCode(65 + i); // A, B, C, D

          return (
            <button
              key={i}
              onClick={() => setSelected(option)}
              disabled={!!selected}
              className={`w-full text-left px-4 py-3 rounded-xl border font-medium transition duration-200
                ${
                  selected
                    ? isCorrect
                      ? "bg-green-100 border-green-600 text-green-800"
                      : isSelected
                      ? "bg-red-100 border-red-600 text-red-800"
                      : "bg-gray-100 text-gray-600 border-gray-300"
                    : "bg-gray-50 hover:bg-indigo-50 border-gray-300 text-gray-800"
                }
              `}
            >
              <span className="font-bold mr-2">{optionLetter}.</span>
              {option}
            </button>
          );
        })}
      </div>

      {/* Next Button */}
      <button
        onClick={handleNext}
        disabled={!selected}
        className="mt-6 bg-indigo-600 text-white px-8 py-3 rounded-xl 
                   hover:bg-indigo-700 transition duration-300 
                   disabled:bg-gray-400"
      >
        {currentIndex + 1 === quiz.length ? "Finish" : "Next"}
      </button>
    </div>
  );
}