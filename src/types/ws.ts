import type { GameState } from "./ultimateTicTacToe"

// ----------- REQUEST -----------

export enum RequestType {
    MOVE = 'move',
    JOIN = 'join',
    LEAVE = 'leave'
}


interface SocketRequestBase {
    type: RequestType
}


export interface MoveRequest extends SocketRequestBase {
    type: RequestType.MOVE,
    gameId: string,
    mainIndex: number,
    subIndex: number
}

export interface JoinRequest extends SocketRequestBase {
    type: RequestType.JOIN,
    gameId: string
}

export interface LeaveRequest extends SocketRequestBase {
    type: RequestType.LEAVE,
    gameId: string
}

export type SocketRequest = MoveRequest | JoinRequest | LeaveRequest

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