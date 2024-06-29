const wordList = [];

function addWord() {
    const wordInput = document.getElementById('wordInput');
    const word = wordInput.value.trim();
    if (word) {
        wordList.push(word);
        displayWords();
        wordInput.value = '';
    }
}

function deleteWord(index) {
    wordList.splice(index, 1);
    displayWords();
}

function displayWords() {
    const wordListContainer = document.getElementById('wordList');
    wordListContainer.innerHTML = '';
    wordList.forEach((word, index) => {
        const wordItem = document.createElement('div');
        wordItem.className = 'word-item';
        wordItem.textContent = word;
        const deleteButton = document.createElement('button');
        deleteButton.textContent = '×';
        deleteButton.onclick = () => deleteWord(index);
        wordItem.appendChild(deleteButton);
        wordListContainer.appendChild(wordItem);
    });
}

function generateGrid() {
    const gridContainer = document.getElementById('gridContainer');
    gridContainer.innerHTML = '';
    const grid = Array.from({ length: 8 }, () => Array(8).fill(''));

    const directions = [
        { dx: 0, dy: 1 }, // vertical
        { dx: 1, dy: 0 }, // horizontal
        { dx: 1, dy: 1 }, // diagonal down-right
        { dx: 1, dy: -1 } // diagonal up-right
    ];

    wordList.forEach(word => {
        let placed = false;
        const difficulty = parseInt(document.getElementById('difficulty').value);
        while (!placed) {
            const direction = directions[Math.floor(Math.random() * difficulty)];
            const startX = Math.floor(Math.random() * (8 - (direction.dx * word.length)));
            const startY = Math.floor(Math.random() * (8 - (direction.dy * word.length)));
            if (canPlaceWord(word, startX, startY, direction, grid)) {
                placeWord(word, startX, startY, direction, grid);
                placed = true;
            }
        }
    });

    fillEmptyCells(grid);

    grid.forEach(row => {
        row.forEach(cell => {
            const cellElement = document.createElement('div');
            cellElement.className = 'grid-cell';
            cellElement.textContent = cell;
            gridContainer.appendChild(cellElement);
        });
    });

    generateProblems();
}

function canPlaceWord(word, startX, startY, direction, grid) {
    for (let i = 0; i < word.length; i++) {
        const x = startX + i * direction.dx;
        const y = startY + i * direction.dy;
        if (grid[y][x] !== '' && grid[y][x] !== word[i]) {
            return false;
        }
    }
    return true;
}

function placeWord(word, startX, startY, direction, grid) {
    for (let i = 0; i < word.length; i++) {
        const x = startX + i * direction.dx;
        const y = startY + i * direction.dy;
        grid[y][x] = word[i];
    }
}

function fillEmptyCells(grid) {
    const hiragana = 'あいうえおかきくけこさしすせそたちつてとなにぬねのはひふへほまみむめもやゆよらりるれろわをんがぎぐげござじずぜぞだぢづでどばびぶべぼぱぴぷぺぽ';
    for (let y = 0; y < 8; y++) {
        for (let x = 0; x < 8; x++) {
            if (grid[y][x] === '') {
                grid[y][x] = hiragana[Math.floor(Math.random() * hiragana.length)];
            }
        }
    }
}

function generateProblems() {
    const problemList = document.getElementById('problemList');
    problemList.innerHTML = '';
    wordList.forEach(word => {
        const problemItem = document.createElement('div');
        problemItem.className = 'problem-item';
        const missingIndex = Math.floor(Math.random() * word.length);
        const displayWord = word.split('').map((char, i) => (i === missingIndex ? '__' : char)).join('');
        problemItem.textContent = displayWord;
        problemList.appendChild(problemItem);
    });
}

function printContent() {
    const originalContent = document.body.innerHTML;
    const gridContent = document.getElementById('gridContainer').outerHTML;
    const problemContent = document.getElementById('problemList').outerHTML;
    document.body.innerHTML = `<div>${gridContent}</div><div>${problemContent}</div>`;
    window.print();
    document.body.innerHTML = originalContent;
}

document.getElementById('wordInput').addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        e.preventDefault();
        addWord();
    }
});
