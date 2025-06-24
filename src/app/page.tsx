'use client';

import { useState, useEffect } from 'react';
import Board from '@/components/Board';
import TetrominoSelector from '@/components/TetrominoSelector';

interface GameState {
  board: string[][];
  tCount: number;
  squareCount: number;
}

export default function Home() {
  const [selectedPiece, setSelectedPiece] = useState<'T' | 'Square' | null>(null);
  const [tCount, setTCount] = useState(15);
  const [squareCount, setSquareCount] = useState(1);
  const [board, setBoard] = useState<string[][]>(Array(8).fill(null).map(() => Array(8).fill('')));
  const [rotation, setRotation] = useState(0);
  
  // History management
  const [history, setHistory] = useState<GameState[]>([{
    board: Array(8).fill(null).map(() => Array(8).fill('')),
    tCount: 15,
    squareCount: 1
  }]);
  const [currentStep, setCurrentStep] = useState(0);

  const handleRotate = () => {
    setRotation((prev) => (prev + 90) % 360);
  };

  const saveToHistory = (newBoard: string[][], newTCount: number, newSquareCount: number) => {
    const newHistory = history.slice(0, currentStep + 1);
    newHistory.push({
      board: newBoard,
      tCount: newTCount,
      squareCount: newSquareCount
    });
    setHistory(newHistory);
    setCurrentStep(newHistory.length - 1);
  };

  const handleUndo = () => {
    if (currentStep > 0) {
      const previousState = history[currentStep - 1];
      setBoard(previousState.board.map(row => [...row]));
      setTCount(previousState.tCount);
      setSquareCount(previousState.squareCount);
      setCurrentStep(currentStep - 1);
      setSelectedPiece(null);
      setRotation(0);
    }
  };

  const handleRedo = () => {
    if (currentStep < history.length - 1) {
      const nextState = history[currentStep + 1];
      setBoard(nextState.board.map(row => [...row]));
      setTCount(nextState.tCount);
      setSquareCount(nextState.squareCount);
      setCurrentStep(currentStep + 1);
      setSelectedPiece(null);
      setRotation(0);
    }
  };

  const resetGame = () => {
    const initialState = {
      board: Array(8).fill(null).map(() => Array(8).fill('')),
      tCount: 15,
      squareCount: 1
    };
    setBoard(initialState.board);
    setTCount(initialState.tCount);
    setSquareCount(initialState.squareCount);
    setSelectedPiece(null);
    setRotation(0);
    setHistory([initialState]);
    setCurrentStep(0);
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
              setBoard={(newBoard) => {
                setBoard(newBoard);
                saveToHistory(newBoard, tCount, squareCount);
              }}
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
            <div className="flex gap-2 mt-4">
              <button
                onClick={handleUndo}
                disabled={currentStep === 0}
                className="flex-1 bg-orange-500 text-white py-2 px-4 rounded disabled:bg-gray-300"
              >
                Undo
              </button>
              <button
                onClick={handleRedo}
                disabled={currentStep === history.length - 1}
                className="flex-1 bg-green-500 text-white py-2 px-4 rounded disabled:bg-gray-300"
              >
                Redo
              </button>
            </div>
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