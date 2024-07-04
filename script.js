const words = JSON.parse(localStorage.getItem('words')) || [];
const hiragana = 'あいうえおかきくけこさしすせそたちつてとなにぬねのはひふへほまみむめもやゆよらりるれろわをんがぎぐげござじずぜぞだぢづでどばびぶべぼぱぴぷぺぽ'.split('');

function addWord() {
    const wordInput = document.getElementById('wordInput').value;
    if (wordInput) {
        words.push(wordInput);
        document.getElementById('wordInput').value = '';
        displayWords();
        localStorage.setItem('words', JSON.stringify(words));
    }
}

function removeWord(index) {
    words.splice(index, 1);
    displayWords();
    localStorage.setItem('words', JSON.stringify(words));
}

function displayWords() {
    const wordList = document.getElementById('wordList');
    wordList.innerHTML = '';
    words.forEach((word, index) => {
        const wordItem = document.createElement('div');
        wordItem.className = 'word-item';
        wordItem.textContent = word;
        const removeButton = document.createElement('button');
        removeButton.className = 'remove-word';
        removeButton.textContent = '✖';
        removeButton.onclick = () => removeWord(index);
        wordItem.appendChild(removeButton);
        wordList.appendChild(wordItem);
    });
}

function generateGrid() {
    const gridContainer = document.getElementById('gridContainer');
    gridContainer.innerHTML = '';
    const grid = Array.from({ length: 8 }, () => Array(8).fill(''));

    let allWordsPlaced = true;

    words.forEach(word => {
        const placed = placeWordInGrid(grid, word);
        if (!placed) {
            allWordsPlaced = false;
        }
    });

    if (!allWordsPlaced) {
        displayError("単語をすべて配置できません。何度か生成を押すか単語を減らしてください。");
        return;
    }

    fillEmptyCells(grid);
    displayGrid(grid);
    displayProblems();
}

function placeWordInGrid(grid, word) {
    const directions = getDirections();
    const maxAttempts = 100;
    for (let attempt = 0; attempt < maxAttempts; attempt++) {
        const direction = directions[Math.floor(Math.random() * directions.length)];
        const { startX, startY, deltaX, deltaY } = getStartPositionAndDeltas(grid, word, direction);

        if (canPlaceWord(grid, word, startX, startY, deltaX, deltaY)) {
            for (let i = 0; i < word.length; i++) {
                grid[startY + i * deltaY][startX + i * deltaX] = word[i];
            }
            return true;
        }
    }
    return false;
}

function getDirections() {
    const difficulty = parseInt(document.getElementById('difficulty').value, 10);
    const directions = {
        1: [{ deltaX: 0, deltaY: 1 }],
        2: [{ deltaX: 1, deltaY: 0 }],
        3: [{ deltaX: 0, deltaY: 1 }, { deltaX: 1, deltaY: 0 }],
        4: [{ deltaX: 0, deltaY: 1 }, { deltaX: 1, deltaY: 0 }, { deltaX: 1, deltaY: 1 }, { deltaX: 1, deltaY: -1 }]
    };
    return directions[difficulty];
}

function getStartPositionAndDeltas(grid, word, direction) {
    const maxStartX = direction.deltaX === 0 ? grid[0].length - 1 : grid[0].length - word.length;
    const maxStartY = direction.deltaY === 0 ? grid.length - 1 : grid.length - word.length;
    const startX = Math.floor(Math.random() * (maxStartX + 1));
    const startY = Math.floor(Math.random() * (maxStartY + 1));
    return { startX, startY, deltaX: direction.deltaX, deltaY: direction.deltaY };
}

function canPlaceWord(grid, word, startX, startY, deltaX, deltaY) {
    for (let i = 0; i < word.length; i++) {
        const x = startX + i * deltaX;
        const y = startY + i * deltaY;
        if (x < 0 || x >= grid[0].length || y < 0 || y >= grid.length) {
            return false;
        }
        if (grid[y][x] !== '' && grid[y][x] !== word[i]) {
            return false;
        }
    }
    return true;
}

function fillEmptyCells(grid) {
    for (let y = 0; y < grid.length; y++) {
        for (let x = 0; x < grid[y].length; x++) {
            if (grid[y][x] === '') {
                grid[y][x] = hiragana[Math.floor(Math.random() * hiragana.length)];
            }
        }
    }
}

function displayGrid(grid) {
    const gridContainer = document.getElementById('gridContainer');
    grid.forEach(row => {
        row.forEach(cell => {
            const gridItem = document.createElement('div');
            gridItem.className = 'grid-item';
            gridItem.textContent = cell;
            gridContainer.appendChild(gridItem);
        });
    });
}

function displayProblems() {
    const problemList = document.getElementById('problemList');
    problemList.innerHTML = '';
    let row;
    words.forEach((word, index) => {
        if (index % 3 === 0) {
            row = document.createElement('div');
            row.className = 'problem-row';
            problemList.appendChild(row);
        }
        const problemItem = document.createElement('div');
        problemItem.className = 'problem-item';
        const missingIndex = Math.floor(Math.random() * word.length);
        const displayWord = word.split('').map((char, i) => (i === missingIndex ? '__' : char)).join('');
        problemItem.textContent = displayWord;
        row.appendChild(problemItem);
    });
}

function displayError(message) {
    const errorContainer = document.getElementById('errorContainer');
    errorContainer.textContent = message;
}

function clearError() {
    const errorContainer = document.getElementById('errorContainer');
    errorContainer.textContent = '';
}

function printContent() {
    const originalContent = document.body.innerHTML;
    const gridContent = document.getElementById('gridContainer').outerHTML;
    const problemContent = document.getElementById('problemList').outerHTML;
    document.body.innerHTML = `<div>${gridContent}</div><div>${problemContent}</div>`;
    window.print();
    document.body.innerHTML = originalContent;
}

document.getElementById('wordInput').addEventListener('keypress', function (event) {
    if (event.key === 'Enter') {
        event.preventDefault();
        addWord();
    }
});

document.addEventListener('DOMContentLoaded', displayWords);
