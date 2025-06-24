class TetrominoGame {
    constructor() {
        this.grid = Array(8).fill().map(() => Array(8).fill(0));
        this.tCount = 15;
        this.squareCount = 1;
        this.currentPiece = null;
        this.rotation = 0;
        this.init();
    }

    init() {
        this.createGrid();
        this.setupEventListeners();
        this.updateCounters();
    }

    createGrid() {
        const gridElement = document.getElementById('grid');
        for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 8; j++) {
                const cell = document.createElement('div');
                cell.className = 'cell';
                cell.dataset.row = i;
                cell.dataset.col = j;
                gridElement.appendChild(cell);
            }
        }
    }

    setupEventListeners() {
        const tPiece = document.getElementById('t-piece');
        const squarePiece = document.getElementById('square-piece');
        const rotateBtn = document.getElementById('rotate-btn');
        const resetBtn = document.getElementById('reset-btn');
        const cells = document.querySelectorAll('.cell');

        tPiece.addEventListener('click', () => this.selectPiece('T'));
        squarePiece.addEventListener('click', () => this.selectPiece('square'));
        rotateBtn.addEventListener('click', () => this.rotatePiece());
        resetBtn.addEventListener('click', () => this.resetGame());

        cells.forEach(cell => {
            cell.addEventListener('click', (e) => this.handleCellClick(e));
            cell.addEventListener('mouseover', (e) => this.handleCellHover(e));
            cell.addEventListener('mouseout', (e) => this.clearHighlight());
        });
    }

    selectPiece(type) {
        if ((type === 'T' && this.tCount > 0) || (type === 'square' && this.squareCount > 0)) {
            this.currentPiece = type;
            this.rotation = 0;
        }
    }

    rotatePiece() {
        if (this.currentPiece === 'T') {
            this.rotation = (this.rotation + 90) % 360;
            this.clearHighlight();
        }
    }

    getTShape() {
        const shapes = [
            [[0, 1], [1, 0], [1, 1], [2, 1]], // 0 degrees
            [[1, 0], [1, 1], [1, 2], [2, 1]], // 90 degrees
            [[0, 1], [1, 1], [1, 2], [2, 1]], // 180 degrees
            [[0, 1], [1, 0], [1, 1], [1, 2]]  // 270 degrees
        ];
        return shapes[this.rotation / 90];
    }

    getSquareShape() {
        return [[0, 0], [0, 1], [1, 0], [1, 1]];
    }

    canPlacePiece(row, col) {
        const shape = this.currentPiece === 'T' ? this.getTShape() : this.getSquareShape();
        
        for (const [dr, dc] of shape) {
            const newRow = row + dr;
            const newCol = col + dc;
            
            if (newRow < 0 || newRow >= 8 || newCol < 0 || newCol >= 8 || this.grid[newRow][newCol] === 1) {
                return false;
            }
        }
        return true;
    }

    placePiece(row, col) {
        if (!this.currentPiece || !this.canPlacePiece(row, col)) return;

        const shape = this.currentPiece === 'T' ? this.getTShape() : this.getSquareShape();
        
        for (const [dr, dc] of shape) {
            const newRow = row + dr;
            const newCol = col + dc;
            this.grid[newRow][newCol] = 1;
            document.querySelector(`[data-row="${newRow}"][data-col="${newCol}"]`)
                .classList.add('filled', `${this.currentPiece.toLowerCase()}-piece`);
        }

        if (this.currentPiece === 'T') {
            this.tCount--;
        } else {
            this.squareCount--;
        }

        this.updateCounters();
        this.checkWinCondition();
        this.currentPiece = null;
    }

    handleCellClick(e) {
        if (!this.currentPiece) return;
        
        const row = parseInt(e.target.dataset.row);
        const col = parseInt(e.target.dataset.col);
        this.placePiece(row, col);
    }

    handleCellHover(e) {
        if (!this.currentPiece) return;
        
        const row = parseInt(e.target.dataset.row);
        const col = parseInt(e.target.dataset.col);
        
        this.clearHighlight();
        if (this.canPlacePiece(row, col)) {
            const shape = this.currentPiece === 'T' ? this.getTShape() : this.getSquareShape();
            shape.forEach(([dr, dc]) => {
                const cell = document.querySelector(`[data-row="${row + dr}"][data-col="${col + dc}"]`);
                if (cell) cell.classList.add('highlight');
            });
        }
    }

    clearHighlight() {
        document.querySelectorAll('.cell.highlight').forEach(cell => {
            cell.classList.remove('highlight');
        });
    }

    updateCounters() {
        document.getElementById('t-count').textContent = this.tCount;
        document.getElementById('square-count').textContent = this.squareCount;
    }

    checkWinCondition() {
        if (this.tCount === 0 && this.squareCount === 0) {
            setTimeout(() => {
                alert('Congratulations! You completed the puzzle!');
            }, 100);
        }
    }

    resetGame() {
        this.grid = Array(8).fill().map(() => Array(8).fill(0));
        this.tCount = 15;
        this.squareCount = 1;
        this.currentPiece = null;
        this.rotation = 0;
        
        document.querySelectorAll('.cell').forEach(cell => {
            cell.className = 'cell';
        });
        
        this.updateCounters();
    }
}

// Initialize the game when the page loads
window.addEventListener('load', () => {
    new TetrominoGame();
}); 