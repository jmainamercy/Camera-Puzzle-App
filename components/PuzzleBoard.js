"use client";

import React, { useRef, useEffect, useState } from "react";

export default function PuzzleBoard({ imageSrc, gridSize = 3, onWin }) {
  const canvasRef = useRef(null);
  const [board, setBoard] = useState([]);
  const [imgElement, setImgElement] = useState(null);
  const size = 450;
  const tileSize = size / gridSize;

  useEffect(() => {
    const img = new Image();
    img.src = imageSrc;
    img.onload = () => {
      setImgElement(img);
      initializeGame();
    };
  }, [imageSrc, gridSize]);

  const initializeGame = () => {
    let pieces = Array.from({ length: gridSize * gridSize }, (_, i) => i);

    do {
      pieces = pieces.sort(() => Math.random() - 0.5);
    } while (!isSolvable(pieces) || isAlreadyWon(pieces));

    const emptyIndex = pieces.indexOf(gridSize * gridSize - 1);
    pieces[emptyIndex] = -1;
    setBoard(pieces);
    console.log("Game initialized with board state:", pieces);
  };

  const isSolvable = (arr) => {
    let inversions = 0;
    for (let i = 0; i < arr.length; i++) {
      for (let j = i + 1; j < arr.length; j++) {
        if (arr[i] > arr[j] && arr[i] !== -1 && arr[j] !== -1) inversions++;
      }
    }
    return inversions % 2 === 0;
  };

  const isAlreadyWon = (arr) => {
    return arr.every((val, i) => val === i);
  };

  useEffect(() => {
    if (!canvasRef.current || !imgElement || board.length === 0) return;
    const ctx = canvasRef.current.getContext("2d");
    ctx.clearRect(0, 0, size, size);

    board.forEach((pieceIdx, currentPos) => {
      const dx = (currentPos % gridSize) * tileSize;
      const dy = Math.floor(currentPos / gridSize) * tileSize;

      if (pieceIdx === -1) {
        ctx.fillStyle = "#1e293b";
        ctx.fillRect(dx, dy, tileSize, tileSize);
        return;
      }

      const sx = (pieceIdx % gridSize) * tileSize;
      const sy = Math.floor(pieceIdx / gridSize) * tileSize;

      ctx.drawImage(
        imgElement,
        sx,
        sy,
        tileSize,
        tileSize,
        dx,
        dy,
        tileSize,
        tileSize,
      );

      ctx.strokeStyle = "#ffffff";
      ctx.lineWidth = 2;
      ctx.strokeRect(dx, dy, tileSize, tileSize);
    });
  }, [board, imgElement, gridSize, tileSize]);

  const tryMoveTile = (clickedPos) => {
    const emptyPos = board.indexOf(-1);

    const clickedRow = Math.floor(clickedPos / gridSize);
    const clickedCol = clickedPos % gridSize;
    const emptyRow = Math.floor(emptyPos / gridSize);
    const emptyCol = emptyPos % gridSize;

    const isAdjacent =
      (Math.abs(clickedRow - emptyRow) === 1 && clickedCol === emptyCol) ||
      (Math.abs(clickedCol - emptyCol) === 1 && clickedRow === emptyRow);

    console.log(
      `Click action register -> Clicked index position: ${clickedPos}. Open gap index position: ${emptyPos}. Valid neighbors check: ${isAdjacent}`,
    );

    if (isAdjacent) {
      const newBoard = [...board];
      newBoard[emptyPos] = newBoard[clickedPos];
      newBoard[clickedPos] = -1;
      setBoard(newBoard);

      const isWin = newBoard.every((val, i) => val === -1 || val === i);
      if (isWin && newBoard[newBoard.length - 1] === -1) {
        setTimeout(() => onWin(), 300);
      }
    }
  };

  const handleCanvasClick = (e) => {
    if (!canvasRef.current) return;

    const rect = canvasRef.current.getBoundingClientRect();

    const scaleX = size / rect.width;
    const scaleY = size / rect.height;

    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;

    const col = Math.floor(x / tileSize);
    const row = Math.floor(y / tileSize);

    if (col >= 0 && col < gridSize && row >= 0 && row < gridSize) {
      const clickedPos = row * gridSize + col;
      tryMoveTile(clickedPos);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (board.length === 0) return;
      const emptyPos = board.indexOf(-1);
      const row = Math.floor(emptyPos / gridSize);
      const col = emptyPos % gridSize;
      let targetPos = -1;

      if (e.key === "ArrowUp" && row < gridSize - 1)
        targetPos = emptyPos + gridSize;
      if (e.key === "ArrowDown" && row > 0) targetPos = emptyPos - gridSize;
      if (e.key === "ArrowLeft" && col < gridSize - 1) targetPos = emptyPos + 1;
      if (e.key === "ArrowRight" && col > 0) targetPos = emptyPos - 1;

      if (targetPos !== -1) {
        e.preventDefault();
        tryMoveTile(targetPos);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [board, gridSize]);

  return (
    <div className="flex flex-col items-center gap-4">
      <canvas
        ref={canvasRef}
        width={size}
        height={size}
        onClick={handleCanvasClick}
        className="border-4 border-slate-700 rounded-lg shadow-xl cursor-pointer max-w-full touch-none"
      />
      <div className="text-center text-xs text-slate-400 max-w-xs mt-1">
        💡 Tap a tile right next to the empty dark block to slide it. On a
        desktop computer, you can also use your keyboard{" "}
        <span className="font-semibold text-slate-500">Arrow Keys</span>.
      </div>
      <button
        onClick={initializeGame}
        className="text-sm bg-slate-200 text-slate-700 px-4 py-2 rounded hover:bg-slate-300 transition-colors mt-2"
      >
        Reshuffle Board
      </button>
    </div>
  );
}
