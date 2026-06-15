const ROWS = 6;
const COLS = 7;
let board = [];
let isPlayerTurn = true;
let gameOver = false;

let p1Wins = 0; let p2Wins = 0;
let timerInterval; let secondsElapsed = 0;
let latestTree = "graph TD\nRoot"; 

// BLOK KEAMANAN: Jangan biarkan Mermaid meng-crash aplikasi jika gagal dimuat
try {
    if (typeof mermaid !== 'undefined') {
        mermaid.initialize({ startOnLoad: false, theme: 'dark' });
    } else {
        console.warn("Koneksi ke Mermaid.js CDN gagal. Diagram tidak akan muncul, tapi game tetap berjalan.");
    }
} catch (e) {
    console.error("Error saat inisialisasi Mermaid:", e);
}

const gameBoard = document.getElementById('game-board');
const statusIndicator = document.getElementById('status-indicator');
const nodeMM = document.getElementById('node-mm');
const nodeAB = document.getElementById('node-ab');
const historyLog = document.getElementById('history-log');
const gameTimer = document.getElementById('game-timer');
const scoreP1 = document.getElementById('score-p1');
const scoreP2 = document.getElementById('score-p2');

const modal = document.getElementById('tree-modal');
const viewTreeBtn = document.getElementById('view-tree-btn');
const closeBtn = document.querySelector('.close-btn');

if (viewTreeBtn) {
    viewTreeBtn.onclick = async function() {
        if(modal) modal.style.display = "block";
        const container = document.getElementById('mermaid-container');
        if(container) {
            if (typeof mermaid !== 'undefined') {
                container.innerHTML = latestTree;
                container.removeAttribute('data-processed'); 
                try {
                    await mermaid.run({ querySelector: '.mermaid' });
                } catch(err) {
                    console.error("Gagal render grafik:", err);
                }
            } else {
                container.innerHTML = "Diagram gagal dimuat (cek koneksi internet ke CDN).";
            }
        }
    }
}

if (closeBtn) closeBtn.onclick = () => modal.style.display = "none";
window.onclick = (e) => { if (e.target == modal) modal.style.display = "none"; }

function initBoard() {
    if(!gameBoard) return; // Mencegah error jika elemen HTML belum siap
    
    board = Array(ROWS).fill().map(() => Array(COLS).fill(0));
    gameBoard.innerHTML = '';
    gameOver = false;
    isPlayerTurn = true;
    
    updateStatus("Giliran P1 (Cyan)", "#00f3ff");
    if(nodeMM) nodeMM.innerText = "0"; 
    if(nodeAB) nodeAB.innerText = "0";
    if(historyLog) historyLog.innerHTML = `<div class="log-item" style="color: #aaa;">-- Sistem Di-restart --</div>`;
    
    resetTimer(); startTimer();

    for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < COLS; c++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            cell.dataset.row = r; cell.dataset.col = c;
            cell.addEventListener('click', () => handleMove(c));
            gameBoard.appendChild(cell);
        }
    }
}

function startTimer() {
    clearInterval(timerInterval);
    timerInterval = setInterval(() => {
        secondsElapsed++;
        let m = Math.floor(secondsElapsed / 60).toString().padStart(2, '0');
        let s = (secondsElapsed % 60).toString().padStart(2, '0');
        if(gameTimer) gameTimer.innerText = `${m}:${s}`;
    }, 1000);
}
function stopTimer() { clearInterval(timerInterval); }
function resetTimer() { stopTimer(); secondsElapsed = 0; if(gameTimer) gameTimer.innerText = "00:00"; }

function updateStatus(text, color) {
    if(!statusIndicator) return;
    statusIndicator.innerText = text;
    statusIndicator.style.borderLeftColor = color;
    statusIndicator.style.backgroundColor = `${color}1A`; 
    statusIndicator.style.color = color;
}

function addLog(message, color) {
    if(!historyLog) return;
    const time = new Date().toLocaleTimeString('id-ID', { hour12: false });
    const logItem = document.createElement('div');
    logItem.className = 'log-item';
    logItem.style.color = color;
    logItem.innerText = `[${time}] ${message}`;
    historyLog.appendChild(logItem);
    historyLog.scrollTop = historyLog.scrollHeight;
}

function updateCell(row, col, playerType) {
    const uiRow = ROWS - 1 - row; 
    const cell = document.querySelector(`.cell[data-row='${uiRow}'][data-col='${col}']`);
    if(cell) cell.classList.add(playerType);
}

function getNextOpenRow(c) {
    for (let r = 0; r < ROWS; r++) { if (board[r][c] === 0) return r; }
    return -1;
}

function getWinningCells(piece) {
    for (let c = 0; c < COLS - 3; c++) {
        for (let r = 0; r < ROWS; r++) { if (board[r][c] === piece && board[r][c+1] === piece && board[r][c+2] === piece && board[r][c+3] === piece) return [[r,c], [r,c+1], [r,c+2], [r,c+3]]; }
    }
    for (let c = 0; c < COLS; c++) {
        for (let r = 0; r < ROWS - 3; r++) { if (board[r][c] === piece && board[r+1][c] === piece && board[r+2][c] === piece && board[r+3][c] === piece) return [[r,c], [r+1,c], [r+2,c], [r+3,c]]; }
    }
    for (let c = 0; c < COLS - 3; c++) {
        for (let r = 0; r < ROWS - 3; r++) { if (board[r][c] === piece && board[r+1][c+1] === piece && board[r+2][c+2] === piece && board[r+3][c+3] === piece) return [[r,c], [r+1,c+1], [r+2,c+2], [r+3,c+3]]; }
    }
    for (let c = 0; c < COLS - 3; c++) {
        for (let r = 3; r < ROWS; r++) { if (board[r][c] === piece && board[r-1][c+1] === piece && board[r-2][c+2] === piece && board[r-3][c+3] === piece) return [[r,c], [r-1,c+1], [r-2,c+2], [r-3,c+3]]; }
    }
    return null;
}

function highlightWinner(winningCells) {
    if(!winningCells) return;
    winningCells.forEach(coord => {
        const uiRow = ROWS - 1 - coord[0];
        const cell = document.querySelector(`.cell[data-row='${uiRow}'][data-col='${coord[1]}']`);
        if(cell) cell.classList.add('win-pulse');
    });
}

// LOGIK UPDATE SKOR (DIKEMBALIKAN)
function handleWin(playerNum, mode) {
    gameOver = true;
    stopTimer();
    
    if (playerNum === 1) {
        p1Wins++;
        if(scoreP1) scoreP1.innerText = p1Wins;
        updateStatus("PLAYER 1 (CYAN) MENANG!", "#00f3ff");
        addLog("🏁 P1 Memenangkan Ronde!", "#00f3ff");
    } else {
        p2Wins++;
        if(scoreP2) scoreP2.innerText = p2Wins;
        const winnerName = mode === 'pvp' ? "PLAYER 2" : "AI";
        updateStatus(`${winnerName} (MAGENTA) MENANG!`, "#ff00fc");
        addLog(`🏁 ${winnerName} Memenangkan Ronde!`, "#ff00fc");
    }
}

async function handleMove(col) {
    if (gameOver) return;
    const modeInput = document.getElementById('game-mode');
    const mode = modeInput ? modeInput.value : 'pva';
    
    if (mode === 'pva' && !isPlayerTurn) return; 

    const row = getNextOpenRow(col);
    if (row === -1) return;

    const currentPlayerValue = isPlayerTurn ? 1 : 2;
    const playerClass = isPlayerTurn ? 'player' : 'ai';
    const playerColor = isPlayerTurn ? "#00f3ff" : "#ff00fc";

    board[row][col] = currentPlayerValue;
    updateCell(row, col, playerClass);
    addLog(`${isPlayerTurn ? "P1 (Cyan)" : "P2 (Magenta)"} menjatuhkan di Kolom ${col + 1}`, playerColor);

    const winCells = getWinningCells(currentPlayerValue);
    if (winCells) {
        highlightWinner(winCells);
        handleWin(currentPlayerValue, mode);
        return;
    }

    if (mode === 'pvp') {
        isPlayerTurn = !isPlayerTurn;
        updateStatus(`Giliran ${isPlayerTurn ? "P1 (Cyan)" : "P2 (Magenta)"}`, isPlayerTurn ? "#00f3ff" : "#ff00fc");
    } else {
        isPlayerTurn = false;
        updateStatus("AI Sedang Berpikir...", "#ff00fc");
        await getAIMove();
    }
}

function flashPrunedColumns(cols) {
    if(!cols || cols.length === 0) return;
    cols.forEach(col => {
        for(let r = 0; r < ROWS; r++) {
            const uiRow = ROWS - 1 - r;
            const cell = document.querySelector(`.cell[data-row='${uiRow}'][data-col='${col}']`);
            if(cell && !cell.classList.contains('player') && !cell.classList.contains('ai')) {
                cell.classList.add('pruned-highlight');
                setTimeout(() => cell.classList.remove('pruned-highlight'), 1200);
            }
        }
    });
    addLog(`✂️ Pruning Terjadi di cabang Kolom: ${cols.map(c=>c+1).join(', ')}`, "#ff4444");
}

async function getAIMove() {
    const depthInput = document.getElementById('depth-input');
    const toggleInput = document.getElementById('pruning-toggle');
    
    const depth = depthInput ? depthInput.value : 4;
    const usePruning = toggleInput ? toggleInput.checked : true;
    const flatBoard = board.flat();

    try {
        const response = await fetch('/api/move', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ board: flatBoard, depth: depth, use_pruning: usePruning })
        });

        const data = await response.json();
        const col = data.column;
        
        if(nodeMM) nodeMM.innerText = data.node_count_mm.toLocaleString('id-ID');
        if(nodeAB) nodeAB.innerText = data.node_count_ab.toLocaleString('id-ID');
        latestTree = data.mermaid_tree;

        flashPrunedColumns(data.pruned_cols);
        
        const row = getNextOpenRow(col);
        if (row !== -1) {
            board[row][col] = 2; // AI
            updateCell(row, col, 'ai');
            addLog(`AI memilih Kolom ${col + 1} (Memangkas ${data.node_count_mm - data.node_count_ab} node)`, "#ff00fc");

            const winCells = getWinningCells(2);
            if (winCells) {
                highlightWinner(winCells);
                handleWin(2, 'pva');
                return;
            }
        }

        isPlayerTurn = true;
        updateStatus("Giliran P1 (Cyan)", "#00f3ff");

    } catch (error) {
        console.error("AI Error:", error);
        updateStatus("Koneksi AI Terputus", "red");
        addLog("⚠️ Gagal memanggil AI", "red");
    }
}

const resetBtn = document.getElementById('reset-btn');
if(resetBtn) resetBtn.addEventListener('click', initBoard);

const resetScoreBtn = document.getElementById('reset-score-btn');
if(resetScoreBtn) {
    resetScoreBtn.addEventListener('click', () => {
        p1Wins = 0; p2Wins = 0;
        if(scoreP1) scoreP1.innerText = "0"; 
        if(scoreP2) scoreP2.innerText = "0";
        addLog("♻️ Skor berhasil di-reset", "yellow");
    });
}

// Hanya gambar papan jika halaman sudah sepenuhnya dimuat
document.addEventListener('DOMContentLoaded', () => {
    initBoard();
});