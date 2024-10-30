const WIN_COMBOS = [
  [0,1,2],[3,4,5],[6,7,8], // Horizontal
  [0,3,6],[1,4,7],[2,5,8], // Vertical
  [0,4,8],[2,4,6]          // Diagonal
]

const game = (function() {
  let board = ["","","","","","","","",""];
  let winner = undefined;
  let showBoard = () => {
    console.log(board.slice(0,3).toString());
    console.log(board.slice(3,6).toString());
    console.log(board.slice(6).toString());
  }
  let placeMarker = (marker, index) => board[index] = marker;
  let resetBoard = () => board = ["","","","","","","","",""];
  return {
    board, showBoard, placeMarker, resetBoard
  }
})()

function findWinner() {
  for (combo of WIN_COMBOS) {
    let [a,b,c] = combo
    let winner = game.board[a] + game.board[b] + game.board[c]
    if (winner === "XXX" || winner === "OOO") {
      console.log("Winner is", winner);
      game.winner = winner === "XXX" ? "X" : "O"
    }
  }
}

function getValidMoves() {
  let moves = []
  for ([i,e] of game.board.entries()) {
    if (e === "") moves.push(i)
  }
  return moves
}

function computerPlay() {
  let validMoves = getValidMoves() ;
  if (validMoves) {
    let id = Math.floor(Math.random() * validMoves.length)
    game.placeMarker("O", validMoves[id])
    const markDiv = document.getElementById(validMoves[id])
    markDiv.textContent = "O"
  }
  
}

// while (!game.winner) {
//   let place = parseInt(prompt("Enter mark location: "))
//   game.placeMarker("X", place)
//   game.showBoard()
//   findWinner()
// }

const wrapper = document.querySelector("div.wrapper")

for (mark in game.board) {
  const markDiv = document.createElement("div")
  markDiv.id = mark
  markDiv.addEventListener("click", (e) => {
    if(e.target.textContent === "") {
      boxId = parseInt(e.target.id)
      game.placeMarker("X", boxId)
      e.target.textContent = "X"
      computerPlay()
    }
    else {
      alert("Choose another square")
    }
  })
  wrapper.appendChild(markDiv)
}