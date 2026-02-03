export enum Player {
  X = "X",
  O = "O"
}

export const TIE = 'TIE' as const

export type Cell = Player | null;

export type SubBoard = [Cell, Cell, Cell, Cell, Cell, Cell, Cell, Cell, Cell];

export type Board = [SubBoard, SubBoard, SubBoard, SubBoard, SubBoard, SubBoard, SubBoard, SubBoard, SubBoard]

export type GameState = {
  board: Board,
  currentPlayer: Player,
  nextAvailableIndex: number | null
}

export function createGame(): GameState {
  return {
    board: Array(9).fill(null).map(() => Array(9).fill(null)) as Board,
    currentPlayer: Player.X,
    nextAvailableIndex: null
  };
}

export function makeMove(state: GameState, mainIndex: number, subIndex: number): GameState {
  // TODO: double check invalid moves. 
  if (state.nextAvailableIndex !== null && state.nextAvailableIndex !== mainIndex) {
    return state
  }
  if (state.board[mainIndex][subIndex] !== null) {
    return state
  }

  const newBoard = structuredClone(state.board)
  newBoard[mainIndex][subIndex] = state.currentPlayer
  const newState: GameState = {
    board: [...newBoard] as Board,
    currentPlayer: state.currentPlayer === Player.X ? Player.O : Player.X,
    nextAvailableIndex: subIndex
  }

  if (getSubGameWinner(newState, subIndex)) {
    newState.nextAvailableIndex = null
  }

  return newState
}

export function getSubGameWinner(state: GameState, mainIndex: number): Player | null | typeof TIE {
  const subBoard = state.board[mainIndex]
  const groups = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
    [0, 4, 8], [2, 4, 6]             // diagonals
  ]
  let winner = null
  groups.forEach(group => {
    const tmpRow = subBoard.filter((_, index) => group.includes(index))
    if (tmpRow.every(cell => cell === Player.X)) {
      winner = Player.X
    }
    if (tmpRow.every(cell => cell === Player.O)) {
      winner = Player.O
    }
  });
  if (!winner && subBoard.filter(cell => cell !== null).length === 9) {
    winner = TIE
  }
  return winner
}

export function getGameWinner(state: GameState): Player | null | typeof TIE {
  const groups = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
    [0, 4, 8], [2, 4, 6]             // diagonals
  ]
  let winner = null
  groups.forEach(group => {
    const subGameWinners = group.map(subGameIndex => getSubGameWinner(state, subGameIndex))
    if (subGameWinners.every(subGameWinner => subGameWinner === Player.X)) {
      winner = Player.X
    }
    if (subGameWinners.every(subGameWinner => subGameWinner === Player.O)) {
      winner = Player.O
    }
  });
  if (!winner) {
    const subGameWinners = state.board.map((_, index) => getSubGameWinner(state, index))
    if (subGameWinners.every(subGameWinner => subGameWinner !== null)) {
      winner = TIE
    }
  }
  return winner
}


