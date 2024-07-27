function showButton() {
    var button = document.querySelector('.ctaButton');
    button.classList.add('show');
}
setTimeout(showButton, 7000);

setTimeout(function () {
    document.getElementById('swipe').className = 'getOut';
}, 5000);

function handleScreenClick() {
    if (!gameOver) {
        document.getElementById("btnLeft").style.display = "block";
    }
}

document.addEventListener("click", handleScreenClick);


let gameBoard = ["", "", "", "", "", "", "", "", ""];
let currentPlayer = "You";
let cowImage = './images/cow.png';
let milkshakeImage = './images/milk.png';
let gameOver = false;
let congratulated = false;

function resetGame() {
    gameOver = false;
    congratulated = false;
    gameBoard = ["", "", "", "", "", "", "", "", ""];
    renderBoard();
    message.textContent = "";
    currentPlayer = "You";
    message.textContent = "";

    const popup = document.querySelector(".popup");
    if (popup) {
        document.body.removeChild(popup);
    }

    const cells = board.children;
    for (let i = 0; i < cells.length; i++) {
        cells[i].classList.remove("winner-cell");
    }
}

function renderBoard() {
    const winPatterns = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],
        [0, 3, 6], [1, 4, 7], [2, 5, 8],
        [0, 4, 8], [2, 4, 6]
    ];

    winPatterns.forEach(pattern => {
        const [a, b, c] = pattern;
        const cells = board.children;
        if (gameBoard[a] === gameBoard[b] && gameBoard[b] === gameBoard[c] && gameBoard[a] !== "") {
            cells[a].classList.add("winner-cell");
            cells[b].classList.add("winner-cell");
            cells[c].classList.add("winner-cell");
        }
    });

    gameBoard.forEach((value, index) => {
        const cell = board.children[index];
        cell.innerHTML = value === 'You' ? `<img src="${cowImage}" alt="You">` :
            value === 'Milkshake' ? `<img src="${milkshakeImage}" alt="Milkshake">` : '';

    });

    currentPlayer = currentPlayer === "You" ? "Milkshake" : "You";
}

document.addEventListener("DOMContentLoaded", function () {
    const board = document.getElementById("board");
    const message = document.getElementById("message");
    const resetBtn = document.getElementById("resetBtn");

    for (let i = 0; i < 9; i++) {
        const cell = document.createElement("div");
        cell.classList.add("cell");
        cell.setAttribute("data-index", i);
        cell.addEventListener("click", () => makeMove(i));
        board.appendChild(cell);
    }

    function makeMove(index) {
        if (gameBoard[index] === "" && !isGameOver()) {
            gameBoard[index] = currentPlayer;
            renderBoard();
            if (!isGameOver()) {
                computerMove();
            }
        }
    }

    function computerMove() {
        let winningMove = getWinningMove();

        if (winningMove !== null) {
            gameBoard[winningMove] = "Milkshake";
        } else {
            let blockingMove = getBlockingMove();

            if (blockingMove !== null) {
                gameBoard[blockingMove] = "Milkshake";
            } else {
                const emptyCells = gameBoard.reduce((acc, cell, index) => {
                    if (cell === "") {
                        acc.push(index);
                    }
                    return acc;
                }, []);

                const randomIndex = Math.floor(Math.random() * emptyCells.length);
                const computerIndex = emptyCells[randomIndex];
                gameBoard[computerIndex] = "Milkshake";
            }
        }

        renderBoard();
        isGameOver();
    }

    function getWinningMove() {
        for (let i = 0; i < 9; i++) {
            if (gameBoard[i] === "") {
                gameBoard[i] = "Milkshake";
                if (checkWinner("Milkshake")) {
                    gameBoard[i] = "";
                    return i;
                }
                gameBoard[i] = "";
            }
        }
        return null;
    }

    function getBlockingMove() {
        for (let i = 0; i < 9; i++) {
            if (gameBoard[i] === "") {
                gameBoard[i] = "You";
                if (checkWinner("You")) {
                    gameBoard[i] = "";
                    return i;
                }
                gameBoard[i] = "";
            }
        }
        return null;
    }

    function getBestMove() {
        let bestScore = -Infinity;
        let bestMove;

        for (let i = 0; i < 9; i++) {
            if (gameBoard[i] === "") {
                gameBoard[i] = "Milkshake";
                let score = minimax(gameBoard, 0, false);
                gameBoard[i] = "";

                if (score > bestScore) {
                    bestScore = score;
                    bestMove = { index: i };
                }
            }
        }

        return bestMove;
    }

    function minimax(board, depth, isMaximizing) {
        if (checkWinner("You")) {
            return -1;
        } else if (checkWinner("Milkshake")) {
            return 1;
        } else if (!board.includes("")) {
            return 0;
        }

        if (isMaximizing) {
            let bestScore = -Infinity;
            for (let i = 0; i < 9; i++) {
                if (board[i] === "") {
                    board[i] = "Milkshake";
                    let score = minimax(board, depth + 1, false);
                    board[i] = "";
                    bestScore = Math.max(score, bestScore);
                }
            }
            return bestScore;
        } else {
            let bestScore = Infinity;
            for (let i = 0; i < 9; i++) {
                if (board[i] === "") {
                    board[i] = "You";
                    let score = minimax(board, depth + 1, true);
                    board[i] = "";
                    bestScore = Math.min(score, bestScore);
                }
            }
            return bestScore;
        }
    }

    function isGameOver() {
        if (checkWinner("You")) {
            displayMessage("You won the Game.!");
            gameOver = true;
            return true;
        } else if (checkWinner("Milkshake")) {
            displayMessage("Milkshake won the Game.!");
            gameOver = true;
            return true;
        } else if (!gameBoard.includes("")) {
            displayMessage("Hurray! It's a tie.");
            gameOver = true;
            return true;
        }
        return false;
    }

    function checkWinner(player) {
        const winPatterns = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8],
            [0, 3, 6], [1, 4, 7], [2, 5, 8],
            [0, 4, 8], [2, 4, 6]
        ];

        return winPatterns.some(pattern => pattern.every(index => gameBoard[index] === player));
    }

    function displayMessage(msg) {
        message.textContent = msg;

        if (msg.includes("You won the Game.") && !congratulated) {
            const popup = document.createElement("div");
            popup.classList.add("popup");
            popup.textContent = "Congratulations! You won the game...! 😄";
            document.body.appendChild(popup);

            setTimeout(() => {
                document.body.removeChild(popup);
                
                congratulated = true;
                resetGame();
            }, 1500);
        } else if (msg.includes("Milkshake won the Game.")) {
            const popup = document.createElement("div");
            popup.classList.add("popup", "lost");
            popup.textContent = "Oops! You lost the game. 😞";
            document.body.appendChild(popup);
        }
    }
});