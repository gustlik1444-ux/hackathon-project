const grid = document.getElementById('grid');
const startBtn = document.getElementById('start-btn');
const modeSelect = document.getElementById('mode');
const lengthSlider = document.getElementById('length');
const diffVal = document.getElementById('diff-val');
const statusMsg = document.getElementById('status-message');

const GRID_SIZE = 12;
let tiles = [];
let gamePath = [];
let userPath = [];
let isShowingPath = false;

function createGrid() {
    grid.innerHTML = '';
    tiles = [];
    for (let i = 0; i < GRID_SIZE * GRID_SIZE; i++) {
        const tile = document.createElement('div');
        tile.classList.add('tile');
        tile.dataset.index = i;
        tile.addEventListener('click', () => handleTileClick(i));
        grid.appendChild(tile);
        tiles.push(tile);
    }
}

function generatePath() {
    const length = parseInt(lengthSlider.value);
    const path = [];
    
    if (modeSelect.value === 'set') {
        const start = 133;
        for(let i=0; i<length; i++) path.push(start - (i * GRID_SIZE)); 
    } else {
        let current = Math.floor(Math.random() * (GRID_SIZE * GRID_SIZE));
        path.push(current);

        while (path.length < length) {
            const neighbors = getNeighbors(current);
            const next = neighbors[Math.floor(Math.random() * neighbors.length)];
            path.push(next);
            current = next;
        }
    }
    return path;
}

function getNeighbors(index) {
    const neighbors = [];
    const row = Math.floor(index / GRID_SIZE);
    const col = index % GRID_SIZE;

    if (row > 0) neighbors.push(index - GRID_SIZE);
    if (row < GRID_SIZE - 1) neighbors.push(index + GRID_SIZE);
    if (col > 0) neighbors.push(index - 1);
    if (col < GRID_SIZE - 1) neighbors.push(index + 1);
    
    return neighbors;
}

async function showPath() {
    isShowingPath = true;
    statusMsg.innerText = "Watch carefully...";
    
    for (const index of gamePath) {
        await new Promise(r => setTimeout(r, 400));
        tiles[index].classList.add('active');
        await new Promise(r => setTimeout(r, 400));
        tiles[index].classList.remove('active');
    }
    
    isShowingPath = false;
    statusMsg.innerText = "Your turn!";
}

function handleTileClick(index) {
    if (isShowingPath || gamePath.length === 0) return;

    const expectedIndex = gamePath[userPath.length];

    if (index === expectedIndex) {
        tiles[index].classList.add('active');
        userPath.push(index);
        
        if (userPath.length === gamePath.length) {
            statusMsg.innerText = "Perfect! Try again?";
            gamePath = [];
        }
    } else {
        tiles[index].classList.add('wrong');
        statusMsg.innerText = "Game Over! Try again.";
        gamePath = [];
        setTimeout(() => tiles[index].classList.remove('wrong'), 500);
    }
}

lengthSlider.oninput = () => diffVal.innerText = lengthSlider.value;

startBtn.addEventListener('click', () => {
    tiles.forEach(t => t.classList.remove('active', 'wrong'));
    userPath = [];
    gamePath = generatePath();
    showPath();
});

createGrid();