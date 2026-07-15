"use client";

import React, { useState, useEffect } from "react";
import CameraCapture from "../components/CameraCapture";
import PuzzleBoard from "../components/PuzzleBoard";

export default function Home() {
  const [gameState, setGameState] = useState("START");
  const [image, setImage] = useState(null);
  const [difficulty, setDifficulty] = useState(3);
  const [time, setTime] = useState(0);

  useEffect(() => {
    let interval = null;

    if (gameState === "PLAYING") {
      interval = setInterval(() => {
        setTime((prevTime) => prevTime + 1);
      }, 1000);
    } else if (gameState === "START") {
      setTime(0);
    }

    return () => clearInterval(interval);
  }, [gameState]);

  const formatTime = (totalSeconds) => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-slate-800">
      <header className="mb-8 text-center">
        <h1 className="text-3xl font-extrabold text-blue-600 tracking-tight">
          CamPuzzle Next
        </h1>
        <p className="text-slate-500 text-sm mt-1">
          Snap a photo to build your custom puzzle
        </p>
      </header>

      <main className="w-full max-w-md bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        {gameState === "PLAYING" && (
          <div className="flex justify-between items-center mb-4 px-2 bg-slate-100 p-2.5 rounded-xl">
            <span className="text-xs font-bold text-slate-500 tracking-wide uppercase">
              Elapsed Time
            </span>
            <span className="text-lg font-mono font-bold text-slate-700 tracking-wider">
              {formatTime(time)}
            </span>
          </div>
        )}

        {gameState === "START" && (
          <div className="text-center py-6 flex flex-col gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-2">
                Select Grid Level
              </label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(Number(e.target.value))}
                className="w-full bg-slate-100 border-none rounded-xl p-3 text-center font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value={3}>Easy (3 x 3)</option>
                <option value={4}>Medium (4 x 4)</option>
                <option value={5}>Hard (5 x 5)</option>
              </select>
            </div>
            <button
              onClick={() => setGameState("CAMERA")}
              className="bg-blue-600 text-white font-bold py-3.5 px-6 rounded-xl shadow-md hover:bg-blue-700 transition-colors"
            >
              Launch Camera
            </button>
          </div>
        )}

        {gameState === "CAMERA" && (
          <CameraCapture
            onCapture={(imgData) => {
              setImage(imgData);
              setGameState("PLAYING");
            }}
          />
        )}

        {gameState === "PLAYING" && (
          <PuzzleBoard
            imageSrc={image}
            gridSize={difficulty}
            onWin={() => setGameState("WIN")}
          />
        )}

        {gameState === "WIN" && (
          <div className="text-center py-8">
            <h2 className="text-2xl font-black text-green-600 mb-2">
              Puzzle Solved!
            </h2>
            <p className="text-slate-600 font-medium mb-1">
              Final Time:{" "}
              <span className="font-mono text-lg font-bold text-slate-800">
                {formatTime(time)}
              </span>
            </p>
            <p className="text-slate-400 text-xs mb-6">
              Excellent job matching the pieces up.
            </p>
            <button
              onClick={() => setGameState("START")}
              className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold shadow-md hover:bg-blue-700 transition-colors"
            >
              Play Again
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
