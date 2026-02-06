import { type GameState, type Board, Player, TIE } from "./types/ultimateTicTacToe";

export function createGame(): GameState {
  return {
    id: crypto.randomUUID(),
    createdTimestamp: Date.now(),
    updatedTimestamp: Date.now(),
    board: Array(9).fill(null).map(() => Array(9).fill(null)) as Board,
    currentPlayer: Player.X,
    requiredBoardIndex: null
  };
}

export function makeMove(state: GameState, mainBoardIndex: number, subIndex: number): GameState {
  if (getGameWinner(state)) {
    return state
  }
  // if there's a required sqaure
  if (state.requiredBoardIndex !== null && state.requiredBoardIndex !== mainBoardIndex) {
    return state
  }
  if (state.board[mainBoardIndex][subIndex] !== null) {
    return state
  }

  const newBoard = structuredClone(state.board)
  newBoard[mainBoardIndex][subIndex] = state.currentPlayer
  const newState: GameState = {
    id: state.id,
    createdTimestamp: state.createdTimestamp,
    updatedTimestamp: Date.now(),
    board: [...newBoard] as Board,
    currentPlayer: state.currentPlayer === Player.X ? Player.O : Player.X,
    requiredBoardIndex: subIndex
  }

  if (getSubGameWinner(newState, subIndex)) {
    newState.requiredBoardIndex = null
  }

  return newState
}

type AbstractBoard<T> = [T, T, T, T, T, T, T, T, T]

function getWinner<T>(board: AbstractBoard<T>, getCellValue: (cell: T, index: number) => Player|null|typeof TIE) {
  const winningIndices = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
    [0, 4, 8], [2, 4, 6]             // diagonals
  ]
  let winner = null
  winningIndices.forEach(group => {
    const cellValues = group.map(index => getCellValue(board[index], index))
    if (cellValues.every(cellValue => cellValue === Player.X)) {
      winner = Player.X
    }
    if (cellValues.every(cellValue => cellValue === Player.O)) {
      winner = Player.O
    }
  });
  if (!winner) {
    const cellValues = board.map((_, index) => getCellValue(board[index], index))
    if (cellValues.every(cellValue => cellValue !== null)) {
      winner = TIE
    }
  }
  return winner
}

export function getSubGameWinner(state: GameState, mainIndex: number): Player | null | typeof TIE {
  return getWinner(state.board[mainIndex], (cell) => cell)
}

export function getGameWinner(state: GameState): Player | null | typeof TIE {
  return getWinner(state.board, (_, index) => getSubGameWinner(state, index))
}

export function isWinnerTie(winner: Player | null | typeof TIE) {
  return winner !== null && winner !== Player.X && winner !== Player.O
}


