import type { GameState } from "./ultimateTicTacToe"
import WebSocket from 'ws';

export type User = {
    name: string,
    connection: WebSocket,
}

export type Room = {
    roomId: string,
    games: GameState[],
    currentGame: string|null, // gameId
    users: User[],
    playerX: User|null,
    playerO: User|null
}