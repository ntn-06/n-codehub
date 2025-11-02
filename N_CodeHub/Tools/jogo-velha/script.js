// ===== ESTADO DO JOGO =====
let currentPlayer = 'X';
let gameBoard = ['', '', '', '', '', '', '', '', ''];
let gameActive = false; // Começa falso até escolher modo
let gameMode = null; // Começa nulo
let scores = { X: 0, O: 0, draw: 0 };

// ===== ELEMENTOS DO DOM =====
const cells = document.querySelectorAll('.cell');
const playerTurnElement = document.getElementById('player-turn');
const gameStatusElement = document.getElementById('game-status');
const currentModeElement = document.getElementById('current-mode').querySelector('span');
const resetButton = document.getElementById('reset-btn');
const resetScoreButton = document.getElementById('reset-score-btn');
const changeModeButton = document.getElementById('change-mode-btn');
const scoreXElement = document.getElementById('score-x');
const scoreOElement = document.getElementById('score-o');
const scoreDrawElement = document.getElementById('score-draw');
const modeModal = document.getElementById('mode-modal');

// ===== COMBINAÇÕES VENCEDORAS =====
const winningConditions = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8], 
    [0, 4, 8], [2, 4, 6]
];

// ===== INICIALIZAÇÃO DO JOGO =====
function initGame() {
    // Mostra modal de seleção de modo
    showModeModal();
    
    // Event listeners
    cells.forEach(cell => {
        cell.addEventListener('click', handleCellClick);
    });
    
    resetButton.addEventListener('click', resetGame);
    resetScoreButton.addEventListener('click', resetScoreboard);
    changeModeButton.addEventListener('click', showModeModal);
    
    // Botões do modal
    document.querySelectorAll('.modal-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            selectGameMode(this.getAttribute('data-mode'));
        });
    });
}

// ===== MODAL DE SELEÇÃO DE MODO =====
function showModeModal() {
    modeModal.classList.remove('hidden');
    gameActive = false; // Pausa o jogo durante seleção
}

function hideModeModal() {
    modeModal.classList.add('hidden');
}

function selectGameMode(mode) {
    gameMode = mode;
    hideModeModal();
    startGame();
}

// ===== INICIAR JOGO =====
function startGame() {
    gameActive = true;
    currentPlayer = 'X';
    
    // Atualiza interface
    updateCurrentMode();
    updatePlayerTurn();
    gameStatusElement.textContent = 'Jogo em andamento...';
    
    // Habilita células
    cells.forEach(cell => {
        cell.disabled = false;
    });
}

// ===== FUNÇÃO: CLIQUE EM UMA CÉLULA =====
function handleCellClick(event) {
    if (!gameActive || !gameMode) return;
    
    const clickedCell = event.target;
    const cellIndex = parseInt(clickedCell.getAttribute('data-index'));
    
    if (gameBoard[cellIndex] !== '' || !gameActive) {
        return;
    }
    
    makeMove(cellIndex, currentPlayer);
    checkGameResult();
    
    if (gameMode === 'cpu' && gameActive && currentPlayer === 'O') {
        setTimeout(makeCpuMove, 600);
    }
}

// ===== FUNÇÃO: FAZ UMA JOGADA =====
function makeMove(cellIndex, player) {
    gameBoard[cellIndex] = player;
    
    const cell = document.querySelector(`[data-index="${cellIndex}"]`);
    cell.textContent = player === 'X' ? '❌' : '⭕';
    cell.disabled = true;
    
    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    updatePlayerTurn();
}

// ===== FUNÇÃO: JOGADA DA CPU =====
function makeCpuMove() {
    if (!gameActive) return;
    
    let availableCells = [];
    gameBoard.forEach((cell, index) => {
        if (cell === '') availableCells.push(index);
    });
    
    if (availableCells.length === 0) return;
    
    let cpuMove;
    
    // Estratégia da CPU
    cpuMove = findWinningMove('O');
    if (cpuMove !== -1) {
        makeMove(cpuMove, 'O');
        return;
    }
    
    cpuMove = findWinningMove('X');
    if (cpuMove !== -1) {
        makeMove(cpuMove, 'O');
        return;
    }
    
    if (gameBoard[4] === '') {
        makeMove(4, 'O');
        return;
    }
    
    const randomIndex = Math.floor(Math.random() * availableCells.length);
    makeMove(availableCells[randomIndex], 'O');
}

// ===== FUNÇÃO: ENCONTRA JOGADA VENCEDORA =====
function findWinningMove(player) {
    for (let i = 0; i < winningConditions.length; i++) {
        const [a, b, c] = winningConditions[i];
        const line = [gameBoard[a], gameBoard[b], gameBoard[c]];
        
        const playerCells = line.filter(cell => cell === player).length;
        const emptyCells = line.filter(cell => cell === '').length;
        
        if (playerCells === 2 && emptyCells === 1) {
            if (gameBoard[a] === '') return a;
            if (gameBoard[b] === '') return b;
            if (gameBoard[c] === '') return c;
        }
    }
    return -1;
}

// ===== FUNÇÃO: VERIFICA RESULTADO DO JOGO =====
function checkGameResult() {
    let roundWon = false;
    let winningCombo = [];

    for (let i = 0; i < winningConditions.length; i++) {
        const [a, b, c] = winningConditions[i];
        if (gameBoard[a] && gameBoard[a] === gameBoard[b] && gameBoard[a] === gameBoard[c]) {
            roundWon = true;
            winningCombo = [a, b, c];
            break;
        }
    }

    if (roundWon) {
        gameActive = false;
        highlightWinningCells(winningCombo);
        
        const winner = currentPlayer === 'X' ? 'O' : 'X';
        scores[winner]++;
        updateScoreboard();
        
        const winnerName = gameMode === 'cpu' && winner === 'O' ? 'CPU' : 'Jogador';
        gameStatusElement.textContent = `🎉 ${winnerName} ${winner === 'X' ? '❌' : '⭕'} venceu!`;
        return;
    }

    if (!gameBoard.includes('')) {
        gameActive = false;
        scores.draw++;
        updateScoreboard();
        gameStatusElement.textContent = '🤝 Empate!';
        return;
    }

    gameStatusElement.textContent = 'Jogo em andamento...';
}

// ===== FUNÇÃO: DESTACA CÉLULAS VENCEDORAS =====
function highlightWinningCells(cellsIndexes) {
    cellsIndexes.forEach(index => {
        const cell = document.querySelector(`[data-index="${index}"]`);
        cell.classList.add('winning-cell');
    });
}

// ===== FUNÇÃO: ATUALIZA VEZ DO JOGADOR =====
function updatePlayerTurn() {
    const symbol = currentPlayer === 'X' ? '❌' : '⭕';
    const playerName = gameMode === 'cpu' && currentPlayer === 'O' ? 'CPU' : 'Jogador';
    playerTurnElement.textContent = symbol;
    playerTurnElement.style.color = currentPlayer === 'X' ? '#ff6b6b' : '#4ecdc4';
}

// ===== FUNÇÃO: ATUALIZA MODO ATUAL =====
function updateCurrentMode() {
    const modeNames = {
        'friend': '2 Jogadores 👥',
        'cpu': 'Vs CPU 🤖'
    };
    currentModeElement.textContent = modeNames[gameMode];
}

// ===== FUNÇÃO: ATUALIZA PLACAR =====
function updateScoreboard() {
    scoreXElement.textContent = scores.X;
    scoreOElement.textContent = scores.O;
    scoreDrawElement.textContent = scores.draw;
}

// ===== FUNÇÃO: REINICIA O JOGO =====
function resetGame() {
    if (!gameMode) {
        showModeModal();
        return;
    }
    
    gameBoard = ['', '', '', '', '', '', '', '', ''];
    gameActive = true;
    currentPlayer = 'X';
    
    cells.forEach(cell => {
        cell.textContent = '';
        cell.disabled = false;
        cell.classList.remove('winning-cell');
    });
    
    updatePlayerTurn();
    gameStatusElement.textContent = 'Jogo em andamento...';
}

// ===== FUNÇÃO: ZERA PLACAR =====
function resetScoreboard() {
    scores = { X: 0, O: 0, draw: 0 };
    updateScoreboard();
}

// ===== INICIA O JOGO =====
document.addEventListener('DOMContentLoaded', initGame);