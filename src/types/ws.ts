import type { Room } from "./server"

// ----------- REQUEST -----------

export enum RequestType {
    // lobby
    JOIN_ROOM = 'join_room',
    CREATE_ROOM = 'create_room',

    // user
    SET_NAME = 'set_name',

    // room
    JOIN_X = 'join_x',
    JOIN_O = 'join_o',
    CREATE_GAME = 'create_game',

    // game
    MOVE = 'move',
    END = 'leave'
}


interface SocketRequestBase {
    type: RequestType
}

export interface JoinRoomRequest extends SocketRequestBase {
    type: RequestType.JOIN_ROOM,
    roomId: string
}
export interface CreateRoomRequest extends SocketRequestBase {
    type: RequestType.CREATE_ROOM,
}
export interface SetNameRequest extends SocketRequestBase {
    type: RequestType.SET_NAME,
    name: string
}
export interface JoinXRequest extends SocketRequestBase {
    type: RequestType.JOIN_X,
    roomId: string
}
export interface JoinORequest extends SocketRequestBase {
    type: RequestType.JOIN_O,
    roomId: string
}
export interface CreateGameRequest extends SocketRequestBase {
    type: RequestType.CREATE_GAME,
    roomId: string
}
export interface MoveRequest extends SocketRequestBase {
    type: RequestType.MOVE,
    roomId: string,
    gameId: string,
    mainIndex: number,
    subIndex: number
}
export interface EndRequest extends SocketRequestBase {
    type: RequestType.END,
    roomId: string,
    gameId: string,
}


export type SocketRequest = (
    JoinRoomRequest |
    CreateRoomRequest | 
    SetNameRequest |
    JoinXRequest |
    JoinORequest |
    CreateGameRequest |
    MoveRequest |
    EndRequest
)

// ------------- RESPONSE ----------------

export enum ResponseType {
    CREATE_ROOM = 'create_room',
    JOIN_ROOM = 'join_room',
    SET_NAME = 'set_name',
    ROOM_UPDATE = 'room_update',
}

interface SocketResponseBase {
    type: ResponseType
}

export interface CreateRoomResponse extends SocketResponseBase {
    type: ResponseType.CREATE_ROOM,
    room: Room
}

export interface JoinRoomResponse extends SocketResponseBase {
    type: ResponseType.JOIN_ROOM,
    room: Room|null
}

export interface SetNameResponse extends SocketResponseBase {
    type: ResponseType.SET_NAME,
    name: string
}

export interface RoomUpdateResponse extends SocketResponseBase {
    type: ResponseType.ROOM_UPDATE,
    room: Room
}


export type SocketResponse = (
    CreateRoomResponse | 
    JoinRoomResponse | 
    SetNameResponse |
    RoomUpdateResponse 
)