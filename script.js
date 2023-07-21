let row1 = document.querySelector(".row1").children;
let row2 = document.querySelector(".row2").children;
let row3 = document.querySelector(".row3").children;
let board = document.querySelector(".board").children;
let turnmsg = document.querySelector(".message");
let back = document.querySelector(".back");
let forward = document.querySelector(".forward");
let reset = document.querySelector(".reset");
// let nxt = document.querySelector(".nxt");
let turn = 0;
let piece = "✕";
let numturn = 0;

let boardarray = [
    { square: "r1c1", type: "" },
    { square: "r1c2", type: "" },
    { square: "r1c3", type: "" },
    { square: "r2c1", type: "" },
    { square: "r2c2", type: "" },
    { square: "r2c3", type: "" },
    { square: "r3c1", type: "" },
    { square: "r3c2", type: "" },
    { square: "r3c3", type: "" },
];

let emptyboard = [
    { square: "r1c1", type: "" },
    { square: "r1c2", type: "" },
    { square: "r1c3", type: "" },
    { square: "r2c1", type: "" },
    { square: "r2c2", type: "" },
    { square: "r2c3", type: "" },
    { square: "r3c1", type: "" },
    { square: "r3c2", type: "" },
    { square: "r3c3", type: "" },
];

let history = [
    '[{"square":"r1c1","type":""},{"square":"r1c2","type":""},{"square":"r1c3","type":""},{"square":"r2c1","type":""},{"square":"r2c2","type":""},{"square":"r2c3","type":""},{"square":"r3c1","type":""},{"square":"r3c2","type":""},{"square":"r3c3","type":""}]',
];

let win = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
];

function resetGame() {
    back.style.opacity = 0;
    forward.style.opacity = 0;
    reset.style.opacity = 0;
    back.style.cursor = "default";
    forward.style.cursor = "default";
    reset.style.cursor = "default";
    // nxt.style.opacity = 0;
    // nxt.style.cursor = "default";
    back.removeEventListener("click", backHistory);
    forward.removeEventListener("click", forwardHistory);
    reset.removeEventListener("click", resetGame);
    turn = 0;
    numturn = 0;
    history = [
        '[{"square":"r1c1","type":""},{"square":"r1c2","type":""},{"square":"r1c3","type":""},{"square":"r2c1","type":""},{"square":"r2c2","type":""},{"square":"r2c3","type":""},{"square":"r3c1","type":""},{"square":"r3c2","type":""},{"square":"r3c3","type":""}]',
    ];
    boardarray = [
        { square: "r1c1", type: "" },
        { square: "r1c2", type: "" },
        { square: "r1c3", type: "" },
        { square: "r2c1", type: "" },
        { square: "r2c2", type: "" },
        { square: "r2c3", type: "" },
        { square: "r3c1", type: "" },
        { square: "r3c2", type: "" },
        { square: "r3c3", type: "" },
    ];
    loadState(emptyboard);
    playerTurn();
    playerPiece();
    freezeState("off");
}

function freezeState(onoff) {
    if (onoff == "on") {
        
        pieces(row1, "remove");
        pieces(row2, "remove");
        pieces(row3, "remove");
        hoverFunc("remove");
    } else {
        
        pieces(row1, "add");
        pieces(row2, "add");
        pieces(row3, "add");
        hoverFunc("add");
        
    }
}

function checkWin(piece) {
    return win.some((comb) => {
        return comb.every((index) => boardarray[index].type == piece);
    });
}

function pieces(row, addrem) {
    if (addrem == "add") {
        for (let box of row) {
            box.addEventListener("click", clickMe);
        }
    } else {
        for (let box of row) {
            box.removeEventListener("click", clickMe);
        }
    }
}

function clickMe() {
    if (this.innerHTML == "") {
        this.innerHTML = piece;
        turn += 1;
        numturn += 1;
        for (let i = 0; i < boardarray.length; i++) {
            if (boardarray[i].square == this.id) {
                boardarray[i].type = this.innerHTML;
            }
        }
        history.push(JSON.stringify(boardarray));
        playerTurn();

        if (checkWin(piece)) {
            clearClass();
            turnmsg.innerHTML = `${piece} Wins!`;
            back.style.opacity = 1;
            // forward.style.opacity = 1;
            reset.style.opacity = 1;
            back.style.cursor = "pointer";
            // forward.style.cursor = "pointer";
            reset.style.cursor = "pointer";
            // nxt.style.opacity = 1;
            // nxt.style.cursor = "pointer";
            back.addEventListener("click", backHistory);
            forward.addEventListener("click", forwardHistory);
            reset.addEventListener("click", resetGame);
            freezeState("on");
        }
        if (turn == 9 & checkWin(piece) == false) {
            clearClass();
            turnmsg.innerHTML = `Draw`;
            back.style.opacity = 1;
            // forward.style.opacity = 1;
            reset.style.opacity = 1;
            back.style.cursor = "pointer";
            // forward.style.cursor = "pointer";
            reset.style.cursor = "pointer";
            // nxt.style.opacity = 1;
            // nxt.style.cursor = "pointer";
            back.addEventListener("click", backHistory);
            forward.addEventListener("click", forwardHistory);
            reset.addEventListener("click", resetGame);
            freezeState("on");
        }
        playerPiece();
    }
}

function loadState(state) {
    for (let row of board) {
        for (let col of row.children) {
            for (let i = 0; i < state.length; i++) {
                if (state[i].square == col.id) {
                    col.innerHTML = state[i].type;
                }
            }
        }
    }
}

function backHistory() { 
    if (numturn == 0) {
        let obj = JSON.parse(history[0]);
        loadState(obj);
    } else if (numturn > 0) {
        numturn -= 1;
        turn -= 1;
        let obj = JSON.parse(history[numturn]);
        loadState(obj);
        turnOnly();
        playerPiece();
    }
    backCheck();
}

function forwardHistory() {

    if (numturn < history.length - 1) {
        numturn += 1;
        turn += 1;
        let obj = JSON.parse(history[numturn]);
        loadState(obj);
        turnOnly();
        playerPiece();
    }
    forwardCheck();
}

function playerPiece() {
    if (turn % 2 == 0) {
        piece = "✕";
    } else {
        piece = "◯";
    }
}

function playerTurn() {
    if (turn % 2 == 0) {
        turnmsg.innerHTML = `Player one's turn (Turn ${turn + 1})`;
    } else {
        turnmsg.innerHTML = `Player two's turn (Turn ${turn + 1})`;
    }
}

function turnOnly() {
    if (turn % 2 == 0) {
        turnmsg.innerHTML = `Turn ${turn}`;
    } else {
        turnmsg.innerHTML = `Turn ${turn}`;
    }
}


function hoverFunc(addrem) {
    if (addrem == "add") {
        for (let row of board) {
            for (let col of row.children) {
                col.addEventListener("mouseover", mOverEvent);
                col.addEventListener("mouseout", mOutEvent);
                col.addEventListener("click", mClckEvent);
            }
        }
    } else {
        for (let row of board) {
            for (let col of row.children) {
                col.removeEventListener("mouseover", mOverEvent);
                col.removeEventListener("mouseout", mOutEvent);
                col.removeEventListener("click", mClckEvent);
            }
        }
    }
}

function mOverEvent () {
    if (this.innerHTML == "") {
        this.classList.value = piece;
    }
}

function mOutEvent () {
    if (this.innerHTML != "") {
        this.classList.value = "";
    }
}

function mClckEvent () {
    this.classList.value = "";
}

function clearClass () {
    for (let row of board) {
        for (let col of row.children) {
            col.classList.value = "";
        }
    }
}

function backCheck() {
    if (turn == 0) {
        back.style.opacity = 0;
        back.style.cursor = "default";
    } else {
        if (turn != history.length-1) {
            forward.style.opacity = 1;
            forward.style.cursor = "pointer";
        }
    }
}

function forwardCheck() {
    if (turn == history.length-1) {
        forward.style.opacity = 0;
        forward.style.cursor = "default";
    } else {
        if (turn != 0) {
            back.style.opacity = 1;
            back.style.cursor = "pointer";
            
        }
    }
}

hoverFunc("add");
pieces(row1, "add");
pieces(row2, "add");
pieces(row3, "add");
