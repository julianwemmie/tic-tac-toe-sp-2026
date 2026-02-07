import type { GameState } from "./ultimateTicTacToe"

export type User = {
    name: string,
    connectionId: string,
}

export type Room = {
    roomId: string,
    games: GameState[],
    currentGame: string|null, // gameId
    users: User[],
    playerX: User|null,
    playerO: User|null
}