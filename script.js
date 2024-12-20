const X = 1
const O = -1
const EMPTY = 0

const Game = function () {
  let board = Array(9).fill(EMPTY);
  const getBoard = () => board
  const resetBoard = () => board = Array(9).fill(EMPTY);
  const placeMarker = (marker, index) => board[index] = marker

  const getWinner = () => {
    const win_combos = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8], // Horizontal
      [0, 3, 6], [1, 4, 7], [2, 5, 8], // Vertical
      [0, 4, 8], [2, 4, 6]             // Diagonal
    ]

    for (const combo of win_combos) {
      const mappedCombo = combo.map((i) => board[i]).reduce((t, v) => t + v)
      if (Math.abs(mappedCombo) === 3) return mappedCombo / 3
    }
    return 0
  }

  const getValidMoves = () => {
    const moves = []
    for (const [i, e] of board.entries()) {
      if (!e) moves.push(i)
    }
    return moves
  }
  return {
    getBoard, placeMarker, getWinner, getValidMoves, resetBoard
  }
}

const gameController = (function () {
  const game = Game()
  let difficulty = "easy"
  let gameDone = false
  const gamesWon = { player1: 0, player2: 0 }
  const setDifficulty = (val) => difficulty = val
  const getGamesWon = () => gamesWon
  const isGameDone = () => gameDone
  const processRound = () => {
    const winner = game.getWinner()
    if (winner || !game.getValidMoves().length) {
      if (winner === 1) gamesWon.player1++
      else if (winner === -1) gamesWon.player2++
      gameDone = true
      displayController.updateScores(winner)
    }
  }
  const computerPlay = () => {
    let move
    switch (difficulty) {
      case "easy":
        move = getMove.easy()
        break
      case "medium":
        move = getMove.medium()
        break
      case "hard":
        move = getMove.hard()
        break
      default:
        move = getMove.easy()
        break
    }
    gameController.placeMarker(O, move)
    displayController.updateBoard()
  }
  const init = () => {
    game.resetBoard()
    gameDone = false
  }

  return { setDifficulty, getGamesWon, isGameDone, processRound, computerPlay, init, ...game }
})()

const displayController = (function () {
  function updateBoard() {
    const wrapper = document.querySelector("div.gameBoard")
    const board = gameController.getBoard()
    wrapper.textContent = ""
    for (const mark in board) {
      const markDiv = document.createElement("div")
      if (board[mark] === 1 || board[mark] === -1) {
        const markImg = document.createElement("img")
        markImg.src = board[mark] === 1 ? "images/x.svg" : "images/o.svg"
        markDiv.appendChild(markImg)
      }
      markDiv.id = mark
      wrapper.appendChild(markDiv)
    }
  }
  
  function updateScores(winner) {
    if (winner === 1 ) winner = "X"
    if (winner === -1) winner = "O"
    const gameStatus = document.querySelector("div.gameStatus")
    const p1Wins = document.querySelector("div.p1Wins")
    const p2Wins = document.querySelector("div.p2Wins")
    gameStatus.textContent = winner ? `${winner} has won the game!` : "The game is a tie!"
    p1Wins.textContent = `Player X has won ${gameController.getGamesWon().player1} games`
    p2Wins.textContent = `Player O has won ${gameController.getGamesWon().player2} games`
  }

  return { updateBoard, updateScores }
})()

const getMove = (function () {
  function easy() {
    const validMoves = gameController.getValidMoves()
    return validMoves[Math.floor(Math.random() * validMoves.length)]
  }
  
  function medium() {
    const validMoves = gameController.getValidMoves()
  
    for (const player of [O, X]) {
      for (const move of validMoves) {
        gameController.placeMarker(player, move)
        if (gameController.getWinner() === player) {
          return move
        }
        gameController.placeMarker(EMPTY, move)
      }
    }
  
    if (validMoves.includes(4)) {
      return 4
    }
  
    return validMoves[Math.floor(Math.random() * validMoves.length)]
  }
  
  function hard() {
    return minimax(O)[0]
  }
  
  function minimax(player) {
  
    const validMoves = gameController.getValidMoves()
    let best = [-1, -player]
    const winner = gameController.getWinner()
  
    if (!validMoves.length || winner) return [-1, winner]
  
    for (const choice of validMoves) {
      gameController.placeMarker(player, choice)
      const score = minimax(-player)
      gameController.placeMarker(EMPTY, choice)
      score[0] = choice
  
      if (player === O && (score[1] < best[1])) best = score
      else if (player === X && (score[1] > best[1])) best = score
    }
    return best
  }
  return { easy, medium, hard }
})()

function _clickEvent(e) {
  if (e.target.hasAttribute("id") && !e.target.hasChildNodes()) {
    if (!gameController.isGameDone()) {
      const boxId = parseInt(e.target.id)
      gameController.placeMarker(X, boxId)
      displayController.updateBoard()
      gameController.processRound()
    }
    if (!gameController.isGameDone()) {
      gameController.computerPlay()
      gameController.processRound()
    }
    if (gameController.isGameDone()) {
      const button = document.querySelector("#resetBtn")
      button.removeAttribute("disabled")
    }
  }
}

function _resetGame(e) {
  gameController.init()
  displayController.updateBoard()
  e.target.setAttribute("disabled", null)
}

function _setDifficulty(e) {
  const buttons = document.querySelectorAll(".difficulty>button")
  const difficulty = e.target.textContent.toLowerCase()

  for (const button of buttons) button.className = ""
  e.target.className = "selected"
  gameController.setDifficulty(difficulty)
}