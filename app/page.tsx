"use client";

import { useState, useEffect, useRef } from "react";

export default function Home() {
  const [timeLeft, setTimeLeft] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [totalTime, setTotalTime] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isActive && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((time) => time - 1);
      }, 1000);
    } else if (!isActive || timeLeft === 0) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      if (timeLeft === 0 && isActive) {
        setIsActive(false);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isActive, timeLeft]);

  const startTimer = (minutes: number) => {
    const seconds = minutes * 60;
    setTimeLeft(seconds);
    setTotalTime(seconds);
    setIsActive(true);
  };

  const stopTimer = () => {
    setIsActive(false);
    setTimeLeft(0);
    setTotalTime(0);
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  const progress = totalTime > 0 ? (timeLeft / totalTime) * 100 : 0;
  const circumference = 2 * Math.PI * 120;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center text-white">
      <h1 className="text-6xl font-bold mb-16 text-white">ポモドーロタイマー</h1>

      <div className="relative w-96 h-96 mx-auto mb-16">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 256 256">
            <circle
              cx="128"
              cy="128"
              r="120"
              stroke="currentColor"
              strokeWidth="18"
              fill="transparent"
              className="text-gray-200"
            />
            <circle
              cx="128"
              cy="128"
              r="120"
              stroke="currentColor"
              strokeWidth="20"
              fill="transparent"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              className="text-green-500 transition-all duration-1000 ease-linear"
              strokeLinecap="round"
            />
          </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="text-8xl font-mono font-bold text-white">
              {formatTime(timeLeft)}
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-8">
        <div className="flex gap-8 justify-center">
          <button
            onClick={() => startTimer(25)}
            disabled={isActive}
            className="px-12 py-6 text-2xl bg-red-500 text-white rounded-2xl hover:bg-red-600 disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors"
          >
            25 min
          </button>
          <button
            onClick={() => startTimer(5)}
            disabled={isActive}
            className="px-12 py-6 text-2xl bg-green-500 text-white rounded-2xl hover:bg-green-600 disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors"
          >
            5 min
          </button>
        </div>

        {isActive && (
          <div className="flex justify-center">
            <button
              onClick={stopTimer}
              className="px-12 py-6 text-2xl bg-gray-600 text-white rounded-2xl hover:bg-gray-700 transition-colors"
            >
              Stop
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
