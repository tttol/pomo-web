"use client";

import { useState, useEffect, useRef } from "react";
import Wakelock from "./wake-lock";

export default function Home() {
  const [timeLeft, setTimeLeft] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [totalTime, setTotalTime] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const [wakeLock, setWakeLock] = useState<Wakelock>();

  const playBeep = () => {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();

    for (let i = 0; i < 3; i++) {
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      const startTime = audioContext.currentTime + i * 0.7;

      oscillator.frequency.setValueAtTime(800, startTime);
      gainNode.gain.setValueAtTime(0.3, startTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + 0.5);

      oscillator.start(startTime);
      oscillator.stop(startTime + 0.5);
    }
  };

  useEffect(() => {
    setWakeLock(new Wakelock(null));
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
        playBeep();
        wakeLock?.enableScreenLock();
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isActive, timeLeft]);

  const startTimer = (minutes: number) => {
    wakeLock?.disableScreenLock();
    console.log(`Starting timer for ${minutes} minutes`);
    const seconds = minutes * 60;
    setTimeLeft(seconds);
    setTotalTime(seconds);
    setIsActive(true);
    console.log(`Timer set: ${seconds} seconds, isActive: true`);
  };

  const stopTimer = () => {
    wakeLock?.enableScreenLock();
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
  const circumference = 2 * Math.PI * 455;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center">
      <div className="relative w-full max-w-lg h-96 mb-16">
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 1000 1000">
          <circle
            cx="500"
            cy="500"
            r="455"
            stroke="currentColor"
            strokeWidth="18"
            fill="transparent"
            className="text-gray-200"
          />
          <circle
            cx="500"
            cy="500"
            r="455"
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
          <div className="text-8xl font-mono font-bold text-white">
            {formatTime(timeLeft)}
          </div>
        </div>
      </div>

      <div className="w-full space-y-8 text-center">
        <div>
          <button
            onClick={() => startTimer(25)}
            disabled={isActive}
            className="font-bold px-12 py-6 text-3xl bg-green-500 text-white rounded-2xl hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors mr-8"
          >
            25 min
          </button>
          <button
            onClick={() => startTimer(5)}
            disabled={isActive}
            className="font-bold px-12 py-6 text-3xl bg-sky-500 text-white rounded-2xl hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors"
          >
            5 min
          </button>
        </div>

        {isActive && (
          <div>
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
