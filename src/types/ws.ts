import type { GameState } from "./ultimateTicTacToe"

// ----------- REQUEST -----------

export enum RequestType {
    MOVE = 'move',
    JOIN = 'join',
}


interface SocketRequestBase {
    type: RequestType
}


interface MoveRequest extends SocketRequestBase {
    type: RequestType.MOVE,
    gameId: string,
    mainIndex: number,
    subIndex: number
}

interface SubscribeRequest extends SocketRequestBase {
    type: RequestType.JOIN,
    gameId: string
}

export type SocketRequest = MoveRequest | SubscribeRequest

// ------------- RESPONSE ----------------

export enum ResponseType {
    GAME_UPDATE = 'game_update',
    ERROR = 'error'
}

interface SocketResponseBase {
    type: ResponseType
}

interface GameUpdateResponse extends SocketResponseBase {
    type: ResponseType.GAME_UPDATE
    gameState: GameState
}

export interface ErrorResponse extends SocketResponseBase {
    type: ResponseType.ERROR,
    message: string
}

export type SocketResponse = GameUpdateResponse | ErrorResponse