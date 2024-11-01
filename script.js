
const Game = function() {
  let board = ["","","","","","","","",""]
  let getBoard = () => board
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
    getBoard, placeMarker, init, findWinner, getWinner, getValidMoves
  }
}

const gameController = (function () {
  let game = Game()
  let gameDone = false
  let winner = undefined
  let gamesWon = { player1: 0, player2: 0 }
  let getGamesWon = () => gamesWon
  let isGameDone = () => gameDone
  let getWinner = () => winner

  return { getGamesWon, isGameDone, getWinner }
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
    return 4
  }

  return Math.floor(Math.random() * validMoves.length)
}

function clickEvent(e) {
  if(e.target.hasAttribute("id") && !e.target.hasChildNodes()) {
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