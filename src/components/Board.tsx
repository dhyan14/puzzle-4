import React from 'react';
import classNames from 'classnames';

interface BoardProps {
  board: string[][];
  setBoard: (board: string[][]) => void;
  selectedPiece: 'T' | 'Square' | null;
  rotation: number;
  tCount: number;
  setTCount: (count: number) => void;
  squareCount: number;
  setSquareCount: (count: number) => void;
  setSelectedPiece: (piece: 'T' | 'Square' | null) => void;
}

const Board: React.FC<BoardProps> = ({
  board,
  setBoard,
  selectedPiece,
  rotation,
  tCount,
  setTCount,
  squareCount,
  setSquareCount,
  setSelectedPiece,
}) => {
  const canPlacePiece = (row: number, col: number): boolean => {
    if (!selectedPiece) return false;

    if (selectedPiece === 'Square') {
      if (row >= board.length - 1 || col >= board[0].length - 1) return false;
      return (
        board[row][col] === '' &&
        board[row][col + 1] === '' &&
        board[row + 1][col] === '' &&
        board[row + 1][col + 1] === ''
      );
    }

    // T piece placement check based on rotation
    const checkPositions = getTPositions(row, col, rotation);
    return checkPositions.every(([r, c]) => {
      return r >= 0 && r < board.length && c >= 0 && c < board[0].length && board[r][c] === '';
    });
  };

  const getTPositions = (row: number, col: number, rotation: number): [number, number][] => {
    switch (rotation) {
      case 0: // ▀▀▀
              //  ▀
        return [
          [row, col - 1],
          [row, col],
          [row, col + 1],
          [row + 1, col],
        ];
      case 90: // ▀
              // ▀▀
              // ▀
        return [
          [row - 1, col],
          [row, col],
          [row + 1, col],
          [row, col - 1],
        ];
      case 180: //  ▀
               // ▀▀▀
        return [
          [row, col - 1],
          [row, col],
          [row, col + 1],
          [row - 1, col],
        ];
      case 270: // ▀
               // ▀▀
               // ▀
        return [
          [row - 1, col],
          [row, col],
          [row + 1, col],
          [row, col + 1],
        ];
      default:
        return [];
    }
  };

  const handleCellClick = (row: number, col: number) => {
    if (!selectedPiece || !canPlacePiece(row, col)) return;

    const newBoard = board.map(row => [...row]);

    if (selectedPiece === 'Square') {
      newBoard[row][col] = 'S';
      newBoard[row][col + 1] = 'S';
      newBoard[row + 1][col] = 'S';
      newBoard[row + 1][col + 1] = 'S';
      setSquareCount(squareCount - 1);
    } else {
      const positions = getTPositions(row, col, rotation);
      positions.forEach(([r, c]) => {
        newBoard[r][c] = 'T';
      });
      setTCount(tCount - 1);
    }

    setBoard(newBoard);
    setSelectedPiece(null);
  };

  return (
    <div className="grid grid-cols-8 gap-1 bg-gray-200 p-4 rounded-lg">
      {board.map((row, rowIndex) => (
        row.map((cell, colIndex) => (
          <div
            key={`${rowIndex}-${colIndex}`}
            onClick={() => handleCellClick(rowIndex, colIndex)}
            className={classNames(
              'w-12 h-12 rounded cursor-pointer transition-colors',
              {
                'bg-purple-500': cell === 'T',
                'bg-yellow-500': cell === 'S',
                'bg-white hover:bg-gray-100': cell === '',
                'hover:bg-opacity-75': canPlacePiece(rowIndex, colIndex),
              }
            )}
          />
        ))
      ))}
    </div>
  );
};

export default Board; 