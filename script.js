const WIN_COMBOS = [
  [0,1,2],[3,4,5],[6,7,8], // Horizontal
  [0,3,6],[1,4,7],[2,5,8], // Vertical
  [0,4,8],[2,4,6]          // Diagonal
]

const game = (function() {
  let board = ["","","","","","","","",""];
  let winner = undefined;
  let getBoard = () => {
    return board
  }
  let placeMarker = (marker, index) => {
    board[index] = marker;
    displayBoard()
  }
  let resetBoard = () => board = ["","","","","","","","",""];
  let findWinner = () => {
    for (combo of WIN_COMBOS) {
      let mappedCombo = combo.map((i) => board[i]).reduce((t, v) => t + v)
      if (mappedCombo === "XXX" || mappedCombo === "OOO") {
        console.log("Winner is", mappedCombo);
        winner = mappedCombo === "XXX" ? "X" : "O"
        resetBoard()
        displayBoard()
      }
    }
  }
  return {
    getBoard, placeMarker, resetBoard, findWinner
  }
})()

function displayBoard() {
  wrapper.textContent = ""
  board = game.getBoard()
  for (mark in game.getBoard()) {
    const markDiv = document.createElement("div")
    markDiv.id = mark
    markDiv.textContent = board[mark]
    wrapper.appendChild(markDiv)
  }
}

function getValidMoves() {
  let moves = []
  for ([i,e] of game.getBoard().entries()) {
    if (e === "") moves.push(i)
  }
  return moves
}

function computerPlay() {
  let validMoves = getValidMoves() ;
  if (validMoves) {
    let id = Math.floor(Math.random() * validMoves.length)
    game.placeMarker("O", validMoves[id])
  }
}

const wrapper = document.querySelector("div.wrapper")
wrapper.addEventListener("click", (e) => {
  if(e.target.textContent === "") {
    boxId = parseInt(e.target.id)
    game.placeMarker("X", boxId)
    game.findWinner()
    computerPlay()
    game.findWinner()
  }
  else {
    alert("Choose another square")
  }
})

displayBoard()