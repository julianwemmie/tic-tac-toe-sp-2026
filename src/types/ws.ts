import type { GameState } from "./ultimateTicTacToe"

// ----------- REQUEST -----------

export enum RequestType {
    MOVE = 'move',
    JOIN = 'join',
    LEAVE = 'leave',
    CREATE = 'create'
}


interface SocketRequestBase {
    type: RequestType
}

export interface CreateRequest extends SocketRequestBase {
    type: RequestType.CREATE,
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

export type SocketRequest = CreateRequest | MoveRequest | JoinRequest | LeaveRequest

// ------------- RESPONSE ----------------

export enum ResponseType {
    CREATE = 'create',
    GAME_UPDATE = 'game_update',
    GAME_LIST_UPDATE = 'game_list_update',
    ERROR = 'error'
}

interface SocketResponseBase {
    type: ResponseType
}

export interface CreateResponse extends SocketResponseBase {
    type: ResponseType.CREATE,
    gameState: GameState
}

interface GameUpdateResponse extends SocketResponseBase {
    type: ResponseType.GAME_UPDATE,
    gameState: GameState
}

export interface GameListUpdateResponse extends SocketResponseBase {
    type: ResponseType.GAME_LIST_UPDATE,
    games: {
        [k: string]: GameState;
    }
}

export interface ErrorResponse extends SocketResponseBase {
    type: ResponseType.ERROR,
    message: string
}

export type SocketResponse = CreateResponse | GameUpdateResponse | GameListUpdateResponse | ErrorResponse 