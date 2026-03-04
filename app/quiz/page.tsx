"use client";

import { QUIZ_QUESTIONS } from "@/lib/quiz";
import {
  getQuizPreScores,
  setQuizPreScores,
  getQuizPostScores,
  setQuizPostScores,
} from "@/lib/progress";
import { useEffect, useState } from "react";

type Phase = "pre" | "post" | "pre-done" | "post-done";

export default function QuizPage() {
  const [phase, setPhase] = useState<Phase>("pre");
  const [preScores, setPreScoresState] = useState<number[] | null>(null);
  const [postScores, setPostScoresState] = useState<number[] | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [answers, setAnswers] = useState<number[]>([]);

  useEffect(() => {
    Promise.all([getQuizPreScores(), getQuizPostScores()]).then(([pre, post]) => {
      setPreScoresState(pre);
      setPostScoresState(post);
    });
  }, []);

  const isPre = phase === "pre" || phase === "pre-done";
  const questions = QUIZ_QUESTIONS;
  const setCurrentScores = isPre ? setQuizPreScores : setQuizPostScores;
  const setCurrentScoresState = isPre ? setPreScoresState : setPostScoresState;

  const currentQ = questions[currentIndex];
  const isLast = currentIndex === questions.length - 1;

  const handleNext = () => {
    if (selected === null) return;
    const nextAnswers = [...answers, selected];
    setAnswers(nextAnswers);
    setSelected(null);
    if (isLast) {
      void setCurrentScores(nextAnswers);
      setCurrentScoresState(nextAnswers);
      setPhase(isPre ? "pre-done" : "post-done");
      setCurrentIndex(0);
      setAnswers([]);
    } else {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handleStartPost = () => {
    setPhase("post");
    setCurrentIndex(0);
    setAnswers([]);
    setSelected(null);
  };

  const preCount = preScores ? preScores.filter((a, i) => a === QUIZ_QUESTIONS[i].correctIndex).length : 0;
  const postCount = postScores ? postScores.filter((a, i) => a === QUIZ_QUESTIONS[i].correctIndex).length : 0;
  const improved = postCount - preCount;

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <h1 className="mb-2 text-3xl font-bold text-amber-950">Quiz</h1>
      <p className="mb-6 text-lg text-amber-800">
        Same 6 questions before and after training. See how you improve.
      </p>

      {phase === "pre" && (
        <>
          <p className="mb-6 rounded-lg border border-amber-200 bg-amber-50 p-4 text-base">
            First, take the pre-quiz. Answer honestly—there are no wrong answers here, only learning.
          </p>
          <div className="rounded-2xl border border-amber-200 bg-white p-6 shadow-sm">
            <p className="mb-2 text-sm font-medium text-amber-700">
              Question {currentIndex + 1} of {questions.length}
            </p>
            <h2 className="mb-4 text-xl font-bold text-amber-950">{currentQ.question}</h2>
            <div className="flex flex-col gap-2">
              {currentQ.options.map((opt, i) => (
                <label
                  key={i}
                  className={`flex cursor-pointer items-center gap-3 rounded-lg border px-4 py-3 ${
                    selected === i ? "border-amber-500 bg-amber-50" : "border-amber-200 hover:bg-amber-50"
                  }`}
                >
                  <input
                    type="radio"
                    name="quiz"
                    checked={selected === i}
                    onChange={() => setSelected(i)}
                    className="h-5 w-5 accent-amber-600"
                  />
                  <span className="text-base">{opt}</span>
                </label>
              ))}
            </div>
            <button
              type="button"
              onClick={handleNext}
              disabled={selected === null}
              className="mt-6 rounded-xl bg-amber-500 px-6 py-3 text-lg font-semibold text-amber-950 hover:bg-amber-400 disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-amber-600"
            >
              {isLast ? "See results" : "Next"}
            </button>
          </div>
        </>
      )}

      {phase === "pre-done" && (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6">
          <p className="text-xl font-medium text-amber-950">
            Pre-quiz score: {preCount} out of {questions.length} correct.
          </p>
          <p className="mt-2 text-base text-amber-800">Learning is progress. When you&apos;re ready, do the training and then take the post-quiz.</p>
          <button
            type="button"
            onClick={handleStartPost}
            className="mt-6 rounded-xl bg-amber-500 px-6 py-3 text-lg font-semibold text-amber-950 hover:bg-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-600"
          >
            Take post-quiz now
          </button>
        </div>
      )}

      {phase === "post" && (
        <>
          <p className="mb-6 rounded-lg border border-amber-200 bg-amber-50 p-4 text-base">
            Same questions. See how you did after the training.
          </p>
          <div className="rounded-2xl border border-amber-200 bg-white p-6 shadow-sm">
            <p className="mb-2 text-sm font-medium text-amber-700">
              Question {currentIndex + 1} of {questions.length}
            </p>
            <h2 className="mb-4 text-xl font-bold text-amber-950">{currentQ.question}</h2>
            <div className="flex flex-col gap-2">
              {currentQ.options.map((opt, i) => (
                <label
                  key={i}
                  className={`flex cursor-pointer items-center gap-3 rounded-lg border px-4 py-3 ${
                    selected === i ? "border-amber-500 bg-amber-50" : "border-amber-200 hover:bg-amber-50"
                  }`}
                >
                  <input
                    type="radio"
                    name="quiz-post"
                    checked={selected === i}
                    onChange={() => setSelected(i)}
                    className="h-5 w-5 accent-amber-600"
                  />
                  <span className="text-base">{opt}</span>
                </label>
              ))}
            </div>
            <button
              type="button"
              onClick={handleNext}
              disabled={selected === null}
              className="mt-6 rounded-xl bg-amber-500 px-6 py-3 text-lg font-semibold text-amber-950 hover:bg-amber-400 disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-amber-600"
            >
              {isLast ? "See results" : "Next"}
            </button>
          </div>
        </>
      )}

      {phase === "post-done" && (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6">
          <p className="text-xl font-medium text-amber-950">
            Post-quiz score: {postCount} out of {questions.length} correct.
          </p>
          {preScores != null && (
            <p className="mt-2 text-lg font-medium text-amber-900">
              You improved by {improved} {improved === 1 ? "question" : "questions"}.
            </p>
          )}
          <p className="mt-2 text-base text-amber-800">Learning is progress.</p>
        </div>
      )}
    </div>
  );
}
