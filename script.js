
const game = (function() {
  let board = ["","","","","","","","",""]
  let gameDone = false
  let winner = undefined
  let playerGamesWon = 0
  let computerGamesWon = 0
  let getPlayerGamesWon = () => playerGamesWon
  let getComputerGamesWon = () => computerGamesWon
  let isGameDone = () => gameDone
  let getBoard = () => {
    return board
  }
  let placeMarker = (marker, index) => {
    board[index] = marker
    displayBoard()
  }
  let resetBoard = () => board = ["","","","","","","","",""];
  let findWinner = () => {
    const win_combos = [
      [0,1,2],[3,4,5],[6,7,8], // Horizontal
      [0,3,6],[1,4,7],[2,5,8], // Vertical
      [0,4,8],[2,4,6]          // Diagonal
    ]
    
    for (combo of win_combos) {
      let mappedCombo = combo.map((i) => board[i]).reduce((t, v) => t + v)
      if (mappedCombo === "XXX") {
        winner = "X"
        playerGamesWon++
        gameDone = true
        console.log("Winner is", winner);
      } else if (mappedCombo === "OOO") {
        winner = "O"
        computerGamesWon++
        gameDone = true
        console.log("Winner is", winner)
      }
    }
  }
  return {
    getPlayerGamesWon, getComputerGamesWon, isGameDone, getBoard, placeMarker, resetBoard, findWinner
  }
})()

function displayBoard() {
  const wrapper = document.querySelector("div.wrapper")
  wrapper.textContent = ""
  board = game.getBoard()
  for (mark in game.getBoard()) {
    const markDiv = document.createElement("div")
    if (board[mark] === "X" || board[mark] === "O") {
      const markImg = document.createElement("img")
      markImg.src = board[mark] === "X" ? "images/x.svg" : "images/o.svg"
      markDiv.appendChild(markImg)
    }
    markDiv.id = mark
    markDiv.addEventListener("click", clickEvent)
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

function clickEvent(e) {
  if(e.target.hasAttribute("id") && e.target.textContent === "") {
    if (!game.isGameDone()) {
      boxId = parseInt(e.target.id)
      game.placeMarker("X", boxId)
      game.findWinner()
    }
    if (!game.isGameDone()) {
      computerPlay()
      game.findWinner()
    }
  }
}

displayBoard()