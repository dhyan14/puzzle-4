'use client';

import { useState } from 'react';
import Board from '@/components/Board';
import TetrominoSelector from '@/components/TetrominoSelector';
import Puzzle2 from '@/components/Puzzle2';

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
  
  // Password protection for Puzzle 2
  const [password, setPassword] = useState('');
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [showPasswordError, setShowPasswordError] = useState(false);
  
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

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === '1414') {
      setIsUnlocked(true);
      setShowPasswordError(false);
    } else {
      setShowPasswordError(true);
    }
  };

  return (
    <main className="min-h-screen bg-gray-100 py-4 px-4 md:py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl md:text-3xl font-bold text-center mb-4 md:mb-8">Tetromino Puzzle</h1>
        <div className="flex flex-col md:flex-row gap-4 md:gap-8 items-center md:items-start">
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
              className="w-full bg-blue-500 text-white py-3 px-4 rounded mt-4 disabled:bg-gray-300"
            >
              Rotate ({rotation}°)
            </button>
            <div className="flex gap-2 mt-4">
              <button
                onClick={handleUndo}
                disabled={currentStep === 0}
                className="flex-1 bg-orange-500 text-white py-3 px-4 rounded disabled:bg-gray-300"
              >
                Undo
              </button>
              <button
                onClick={handleRedo}
                disabled={currentStep === history.length - 1}
                className="flex-1 bg-green-500 text-white py-3 px-4 rounded disabled:bg-gray-300"
              >
                Redo
              </button>
            </div>
            <button
              onClick={resetGame}
              className="w-full bg-red-500 text-white py-3 px-4 rounded mt-4"
            >
              Reset Game
            </button>
            <div className="mt-4">
              <p className="font-medium">Remaining pieces:</p>
              <p>T-Tetromino: {tCount}</p>
              <p>Square: {squareCount}</p>
            </div>
          </div>
        </div>

        {!isUnlocked && (
          <div className="mt-8 pt-8 border-t-2 border-gray-200">
            <h2 className="text-2xl font-bold text-center mb-4">Unlock Puzzle 2</h2>
            <form onSubmit={handlePasswordSubmit} className="max-w-sm mx-auto">
              <div className="flex gap-2">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  className="flex-1 px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
                >
                  Unlock
                </button>
              </div>
              {showPasswordError && (
                <p className="text-red-500 text-sm mt-2">Incorrect password. Please try again.</p>
              )}
            </form>
          </div>
        )}

        <Puzzle2 isUnlocked={isUnlocked} />
      </div>
    </main>
  );
} 