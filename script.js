
const game = (function() {
  let board = ["","","","","","","","",""]
  let gameDone = false
  let winner = undefined
  let playerGamesWon = 0
  let computerGamesWon = 0
  let getPlayerGamesWon = () => playerGamesWon
  let getComputerGamesWon = () => computerGamesWon
  let getBoard = () => board
  let isGameDone = () => gameDone
  let placeMarker = (marker, index) => board[index] = marker
  let init = () => {
    board = ["","","","","","","","",""];
    gameDone = false
  }
  let findWinner = () => {
    win = getWinner()
    if (win === "X") {
      winner = "X"
      playerGamesWon++
      gameDone = true
      console.log("Winner is", winner);
    } else if (win === "O") {
      winner = "O"
        computerGamesWon++
        gameDone = true
        console.log("Winner is", winner)
    }
  }
  let getWinner = () => {
    const win_combos = [
      [0,1,2],[3,4,5],[6,7,8], // Horizontal
      [0,3,6],[1,4,7],[2,5,8], // Vertical
      [0,4,8],[2,4,6]          // Diagonal
    ]

    for (combo of win_combos) {
      let mappedCombo = combo.map((i) => board[i]).reduce((t, v) => t + v)
      if (mappedCombo === "XXX") {
        return "X"
      } else if (mappedCombo === "OOO") {
        return "O"
      }
    }
    return false
  }

  let getValidMoves = () => {
    let moves = []
    for ([i,e] of game.getBoard().entries()) {
      if (e === "") moves.push(i)
    }
    return moves
  }
  return {
    getPlayerGamesWon, getComputerGamesWon, isGameDone, getBoard, placeMarker, init, findWinner, getWinner, getValidMoves
  }
})()

function displayBoard() {
  const wrapper = document.querySelector("div.gameBoard")
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

function computerPlay() {
  let move = getMediumMove()
  game.placeMarker("O", move)
  displayBoard()
}

function getMediumMove() {
  let validMoves = game.getValidMoves()
  
  for (player of ["O", "X"]) {
    for (move of validMoves) {
      game.placeMarker(player, move)
      if (game.getWinner() === player) {
        return move
      }
      game.placeMarker("", move)
    }
  }

  if (validMoves.includes(4)) {
    console.log("4");
    
    return 4
  }
  console.log("random move");
  
  return Math.floor(Math.random() * validMoves.length)

}

function clickEvent(e) {
  if(e.target.hasAttribute("id") && e.target.textContent === "") {
    if (!game.isGameDone()) {
      boxId = parseInt(e.target.id)
      game.placeMarker("X", boxId)
      displayBoard()
      game.findWinner()
    }
    if (!game.isGameDone()) {
      computerPlay()
      game.findWinner()
    }
    if (game.isGameDone()) {
      let button = document.querySelector("button")
      button.removeAttribute("hidden")
    }
  }
}

function resetGame(e) {
  game.init()
  displayBoard()
  e.target.setAttribute("hidden", null)
}

displayBoard()