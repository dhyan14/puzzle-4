'use client';

import { useState, useEffect } from 'react';
import Board from '@/components/Board';
import TetrominoSelector from '@/components/TetrominoSelector';

export default function Home() {
  const [selectedPiece, setSelectedPiece] = useState<'T' | 'Square' | null>(null);
  const [tCount, setTCount] = useState(15);
  const [squareCount, setSquareCount] = useState(1);
  const [board, setBoard] = useState<string[][]>(Array(8).fill(null).map(() => Array(8).fill('')));
  const [rotation, setRotation] = useState(0);

  const handleRotate = () => {
    setRotation((prev) => (prev + 90) % 360);
  };

  const resetGame = () => {
    setBoard(Array(8).fill(null).map(() => Array(8).fill('')));
    setTCount(15);
    setSquareCount(1);
    setSelectedPiece(null);
    setRotation(0);
  };

  const checkWin = () => {
    return tCount === 0 && squareCount === 0 && !board.flat().includes('');
  };

  return (
    <main className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-center mb-8">Tetromino Puzzle</h1>
        <div className="flex flex-col md:flex-row gap-8 items-start">
          <div className="flex-1">
            <Board
              board={board}
              setBoard={setBoard}
              selectedPiece={selectedPiece}
              rotation={rotation}
              tCount={tCount}
              setTCount={setTCount}
              squareCount={squareCount}
              setSquareCount={setSquareCount}
              setSelectedPiece={setSelectedPiece}
            />
          </div>
          <div className="w-full md:w-64 bg-white p-4 rounded-lg shadow">
            <TetrominoSelector
              selectedPiece={selectedPiece}
              setSelectedPiece={setSelectedPiece}
              tCount={tCount}
              squareCount={squareCount}
            />
            <button
              onClick={handleRotate}
              disabled={!selectedPiece}
              className="w-full bg-blue-500 text-white py-2 px-4 rounded mt-4 disabled:bg-gray-300"
            >
              Rotate ({rotation}°)
            </button>
            <button
              onClick={resetGame}
              className="w-full bg-red-500 text-white py-2 px-4 rounded mt-4"
            >
              Reset Game
            </button>
            <div className="mt-4">
              <p>Remaining pieces:</p>
              <p>T-Tetromino: {tCount}</p>
              <p>Square: {squareCount}</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
} 