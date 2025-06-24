import React from 'react';
import classNames from 'classnames';

type TetrominoPieceType = 'I' | 'T' | 'S' | 'L' | 'Square';
type SelectedPiece = TetrominoPieceType | null;

interface Puzzle2Props {
  isUnlocked: boolean;
}

interface GameState {
  board: string[][];
  pieces: Record<TetrominoPieceType, number>;
}

const Puzzle2: React.FC<Puzzle2Props> = ({ isUnlocked }) => {
  const [selectedPiece, setSelectedPiece] = React.useState<SelectedPiece>(null);
  const [board, setBoard] = React.useState<string[][]>(Array(4).fill(null).map(() => Array(5).fill('')));
  const [rotation, setRotation] = React.useState(0);
  const [pieces, setPieces] = React.useState<Record<TetrominoPieceType, number>>({
    'I': 1,
    'T': 1,
    'S': 1,
    'L': 1,
    'Square': 1,
  });
  
  // History management
  const [history, setHistory] = React.useState<GameState[]>([{
    board: Array(4).fill(null).map(() => Array(5).fill('')),
    pieces: { 'I': 1, 'T': 1, 'S': 1, 'L': 1, 'Square': 1 }
  }]);
  const [currentStep, setCurrentStep] = React.useState(0);

  if (!isUnlocked) {
    return null;
  }

  const getPiecePositions = (row: number, col: number, piece: TetrominoPieceType, rotation: number): [number, number][] => {
    switch (piece) {
      case 'I':
        switch (rotation) {
          case 0:
          case 180:
            return [[row, col-1], [row, col], [row, col+1], [row, col+2]];
          case 90:
          case 270:
            return [[row-1, col], [row, col], [row+1, col], [row+2, col]];
        }
        break;
      case 'T':
        switch (rotation) {
          case 0:
            return [[row, col-1], [row, col], [row, col+1], [row+1, col]];
          case 90:
            return [[row-1, col], [row, col], [row+1, col], [row, col-1]];
          case 180:
            return [[row-1, col], [row, col-1], [row, col], [row, col+1]];
          case 270:
            return [[row-1, col], [row, col], [row+1, col], [row, col+1]];
        }
        break;
      case 'S':
        switch (rotation) {
          case 0:
          case 180:
            return [[row, col], [row, col+1], [row+1, col-1], [row+1, col]];
          case 90:
          case 270:
            return [[row-1, col], [row, col], [row, col+1], [row+1, col+1]];
        }
        break;
      case 'L':
        switch (rotation) {
          case 0:
            return [[row, col-1], [row, col], [row, col+1], [row+1, col-1]];
          case 90:
            return [[row-1, col-1], [row-1, col], [row, col], [row+1, col]];
          case 180:
            return [[row-1, col+1], [row, col-1], [row, col], [row, col+1]];
          case 270:
            return [[row-1, col], [row, col], [row+1, col], [row+1, col+1]];
        }
        break;
      case 'Square':
        return [[row, col], [row, col+1], [row+1, col], [row+1, col+1]];
    }
    return [];
  };

  const canPlacePiece = (row: number, col: number): boolean => {
    if (!selectedPiece || pieces[selectedPiece] === 0) return false;

    const positions = getPiecePositions(row, col, selectedPiece, rotation);
    return positions.every(([r, c]) => {
      return r >= 0 && r < board.length && c >= 0 && c < board[0].length && board[r][c] === '';
    });
  };

  const handleCellClick = (row: number, col: number) => {
    if (!selectedPiece || !canPlacePiece(row, col)) return;

    const newBoard = board.map(row => [...row]);
    const positions = getPiecePositions(row, col, selectedPiece, rotation);
    
    positions.forEach(([r, c]) => {
      newBoard[r][c] = selectedPiece;
    });

    const newPieces = { ...pieces, [selectedPiece]: 0 };
    
    setBoard(newBoard);
    setPieces(newPieces);
    saveToHistory(newBoard, newPieces);
    setSelectedPiece(null);
  };

  const saveToHistory = (newBoard: string[][], newPieces: Record<TetrominoPieceType, number>) => {
    const newHistory = history.slice(0, currentStep + 1);
    newHistory.push({ board: newBoard, pieces: newPieces });
    setHistory(newHistory);
    setCurrentStep(newHistory.length - 1);
  };

  const handleUndo = () => {
    if (currentStep > 0) {
      const previousState = history[currentStep - 1];
      setBoard(previousState.board.map(row => [...row]));
      setPieces(previousState.pieces);
      setCurrentStep(currentStep - 1);
      setSelectedPiece(null);
      setRotation(0);
    }
  };

  const handleRedo = () => {
    if (currentStep < history.length - 1) {
      const nextState = history[currentStep + 1];
      setBoard(nextState.board.map(row => [...row]));
      setPieces(nextState.pieces);
      setCurrentStep(currentStep + 1);
      setSelectedPiece(null);
      setRotation(0);
    }
  };

  const resetGame = () => {
    const initialState = {
      board: Array(4).fill(null).map(() => Array(5).fill('')),
      pieces: { 'I': 1, 'T': 1, 'S': 1, 'L': 1, 'Square': 1 }
    };
    setBoard(initialState.board);
    setPieces(initialState.pieces);
    setSelectedPiece(null);
    setRotation(0);
    setHistory([initialState]);
    setCurrentStep(0);
  };

  return (
    <div className="mt-8 pt-8 border-t-2 border-gray-200">
      <h2 className="text-2xl md:text-3xl font-bold text-center mb-4">Puzzle 2</h2>
      <div className="flex flex-col md:flex-row gap-4 md:gap-8 items-center md:items-start">
        <div className="w-full max-w-[500px] mx-auto">
          <div className="grid grid-cols-5 gap-[2px] bg-black p-[2px] rounded-lg aspect-[5/4]">
            {board.map((row, rowIndex) => (
              row.map((cell, colIndex) => (
                <div
                  key={`${rowIndex}-${colIndex}`}
                  onClick={() => handleCellClick(rowIndex, colIndex)}
                  className={classNames(
                    'aspect-square rounded-sm cursor-pointer transition-colors',
                    {
                      'bg-blue-500': cell === 'I',
                      'bg-purple-500': cell === 'T',
                      'bg-green-500': cell === 'S',
                      'bg-orange-500': cell === 'L',
                      'bg-yellow-500': cell === 'Square',
                      'bg-white hover:bg-gray-100': cell === '',
                      'hover:bg-opacity-75': canPlacePiece(rowIndex, colIndex),
                    }
                  )}
                />
              ))
            ))}
          </div>
        </div>
        <div className="w-full md:w-64 bg-white p-4 rounded-lg shadow">
          <div className="space-y-3">
            {(['I', 'T', 'S', 'L', 'Square'] as TetrominoPieceType[]).map((piece) => (
              <button
                key={piece}
                onClick={() => setSelectedPiece(selectedPiece === piece ? null : piece)}
                disabled={pieces[piece] === 0}
                className={classNames(
                  'w-full py-3 px-4 rounded transition-colors text-center font-medium',
                  {
                    'bg-blue-500 text-white': selectedPiece === 'I' && piece === 'I',
                    'bg-purple-500 text-white': selectedPiece === 'T' && piece === 'T',
                    'bg-green-500 text-white': selectedPiece === 'S' && piece === 'S',
                    'bg-orange-500 text-white': selectedPiece === 'L' && piece === 'L',
                    'bg-yellow-500 text-white': selectedPiece === 'Square' && piece === 'Square',
                    'bg-gray-200 hover:bg-gray-300': selectedPiece !== piece && pieces[piece] > 0,
                    'bg-gray-100 text-gray-400 cursor-not-allowed': pieces[piece] === 0,
                  }
                )}
              >
                {piece} ({pieces[piece]})
              </button>
            ))}
          </div>
          <button
            onClick={() => setRotation((prev) => (prev + 90) % 360)}
            disabled={!selectedPiece || selectedPiece === 'Square'}
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
        </div>
      </div>
    </div>
  );
};

export default Puzzle2; 