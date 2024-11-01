
const Game = function() {
  let board = new Array()
  const getBoard = () => board
  const resetBoard = () => board = new Array()
  const placeMarker = (marker, index) => board[index] = marker
  
  const findWinner = () => {
    let win = getWinner()
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
  const getWinner = () => {
    const win_combos = [
      [0,1,2],[3,4,5],[6,7,8], // Horizontal
      [0,3,6],[1,4,7],[2,5,8], // Vertical
      [0,4,8],[2,4,6]          // Diagonal
    ]

    for (let combo of win_combos) {
      const mappedCombo = combo.map((i) => board[i]).reduce((t, v) => t + v)
      if (mappedCombo === "XXX") {
        return "X"
      } else if (mappedCombo === "OOO") {
        return "O"
      }
    }
    return false
  }

  const getValidMoves = () => {
    const moves = []
    for (let [i,e] of board.entries()) {
      if (!e) moves.push(i)
    }
    return moves
  }
  return {
    getBoard, placeMarker, findWinner, getWinner, getValidMoves, resetBoard
  }
}

const gameController = (function () {
  let game = Game()
  let gameDone = false
  let winner = undefined
  let gamesWon = { player1: 0, player2: 0 }
  const getGamesWon = () => gamesWon
  const isGameDone = () => gameDone
  const getWinner = () => winner

  return { getGamesWon, isGameDone, getWinner, ...game }
})()

function displayBoard() {
  const wrapper = document.querySelector("div.gameBoard")
  wrapper.textContent = ""
  let board = gameController.getBoard()
  for (let mark in board) {
    const markDiv = document.createElement("div")
    if (board[mark] === "X" || board[mark] === "O") {
      const markImg = document.createElement("img")
      markImg.src = board[mark] === "X" ? "images/x.svg" : "images/o.svg"
      markDiv.appendChild(markImg)
    }
    markDiv.id = mark
    wrapper.appendChild(markDiv)
  }
}

function computerPlay() {
  const move = getMediumMove()
  gameController.placeMarker("O", move)
  displayBoard()
}

function getMediumMove() {
  const validMoves = gameController.getValidMoves()
  
  for (let player of ["O", "X"]) {
    for (let move of validMoves) {
      gameController.placeMarker(player, move)
      if (gameController.getWinner() === player) {
        return move
      }
      gameController.placeMarker("", move)
    }
  }

  if (validMoves.includes(4)) {
    return 4
  }

  return Math.floor(Math.random() * validMoves.length)
}

function clickEvent(e) {
  if(e.target.hasAttribute("id") && !e.target.hasChildNodes()) {
    if (!gameController.isGameDone()) {
      let boxId = parseInt(e.target.id)
      gameController.placeMarker("X", boxId)
      displayBoard()
      gameController.findWinner()
    }
    if (!gameController.isGameDone()) {
      computerPlay()
      gameController.findWinner()
    }
    if (gameController.isGameDone()) {
      const button = document.querySelector("button")
      button.removeAttribute("hidden")
    }
  }
}

function resetGame(e) {
  gameController.init()
  displayBoard()
  e.target.setAttribute("hidden", null)
}