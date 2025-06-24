import React from 'react';
import classNames from 'classnames';

interface TetrominoSelectorProps {
  selectedPiece: 'T' | 'Square' | null;
  setSelectedPiece: (piece: 'T' | 'Square' | null) => void;
  tCount: number;
  squareCount: number;
}

const TetrominoSelector: React.FC<TetrominoSelectorProps> = ({
  selectedPiece,
  setSelectedPiece,
  tCount,
  squareCount,
}) => {
  return (
    <div className="space-y-3">
      <button
        onClick={() => setSelectedPiece(selectedPiece === 'T' ? null : 'T')}
        disabled={tCount === 0}
        className={classNames(
          'w-full py-3 px-4 rounded transition-colors text-center font-medium',
          {
            'bg-purple-500 text-white': selectedPiece === 'T',
            'bg-gray-200 hover:bg-gray-300': selectedPiece !== 'T' && tCount > 0,
            'bg-gray-100 text-gray-400 cursor-not-allowed': tCount === 0,
          }
        )}
      >
        T-Tetromino ({tCount})
      </button>
      <button
        onClick={() => setSelectedPiece(selectedPiece === 'Square' ? null : 'Square')}
        disabled={squareCount === 0}
        className={classNames(
          'w-full py-3 px-4 rounded transition-colors text-center font-medium',
          {
            'bg-yellow-500 text-white': selectedPiece === 'Square',
            'bg-gray-200 hover:bg-gray-300': selectedPiece !== 'Square' && squareCount > 0,
            'bg-gray-100 text-gray-400 cursor-not-allowed': squareCount === 0,
          }
        )}
      >
        Square ({squareCount})
      </button>
    </div>
  );
};

export default TetrominoSelector; 