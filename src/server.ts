import express, { json } from "express";
import expressWs from 'express-ws'
import ViteExpress from "vite-express";
import cors from 'cors';
import WebSocket from 'ws'


import { createGame, makeMove } from './ultimate-tic-tac-toe.ts'
import { Player } from "./types/ultimateTicTacToe.ts";
import { RequestType, ResponseType, type CreateRoomResponse, type JoinRoomResponse, type RoomUpdateResponse, type SetNameResponse, type SocketRequest, type SocketResponse } from "./types/ws.ts";
import type { Room, User } from "./types/server.ts";

const PORT = 3000

const createRoomId = (length: number) => {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
    let result = ""
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length))
    }
    return result
}

export function createServer() {
    const { app } = expressWs(express())
    app.use(json())
    app.use(cors({
        origin: '*',
        methods: '*',
    }))

    const rooms = new Map<string, Room>() // roomId : Room
    const connections = new Map<string, WebSocket>() // connectionId : WebSocket

    const sendResponseToAll = (users: User[], message: SocketResponse) => {
        users.forEach(user => {
            const connection = connections.get(user.connectionId)
            if (connection) {
                connection.send(JSON.stringify(message))
            }
        })
    }

    app.get('/debug', (_, res) => {
        console.log('------------DEBUG----------------------------------------------------')
        console.log(rooms)
        res.send('ok')
    })

    app.ws('/ws', (ws, _) => {
        const connectionId = crypto.randomUUID()
        connections.set(connectionId, ws)
        const user: User = {
            name: '',
            connectionId: connectionId
        }

        const sendResponse = (response: SocketResponse) => {
            ws.send(JSON.stringify(response))
        }

        ws.onmessage = (event) => {
            const eventString = event.data.toString()
            const request = JSON.parse(eventString) as SocketRequest

            if (request.type === RequestType.JOIN_ROOM) {
                const roomId = request.roomId
                const room = rooms.get(roomId)
                if (room && !room.users.includes(user)) {
                    room.users.push(user)
                }
                const joinRoomResponse: JoinRoomResponse = {
                    type: ResponseType.JOIN_ROOM,
                    room: room ?? null
                }
                sendResponse(joinRoomResponse)
            }
            else if (request.type === RequestType.CREATE_ROOM) {
                const newRoom: Room = {
                    roomId: createRoomId(5),
                    games: [],
                    currentGame: null,
                    users: [user],
                    playerX: user,
                    playerO: null
                }
                rooms.set(newRoom.roomId, newRoom)

                const createRoomResponse: CreateRoomResponse = {
                    type: ResponseType.CREATE_ROOM,
                    room: newRoom
                }
                sendResponse(createRoomResponse)
            }
            else if (request.type === RequestType.SET_NAME) {
                user.name = request.name
                const setNameResponse: SetNameResponse = {
                    type: ResponseType.SET_NAME,
                    name: request.name
                }
                sendResponse(setNameResponse)
            }
            else if (request.type === RequestType.JOIN_X) {
                const roomId = request.roomId
                const room = rooms.get(roomId)
                if (room && room.users.includes(user) && !room.playerX) {
                    room.playerX = user
                    const roomUpdateResponse: RoomUpdateResponse = {
                        type: ResponseType.ROOM_UPDATE,
                        room: room
                    }
                    sendResponseToAll(room.users, roomUpdateResponse)
                }
            }
            else if (request.type === RequestType.JOIN_O) {
                const roomId = request.roomId
                const room = rooms.get(roomId)
                if (room && room.users.includes(user) && !room.playerO) {
                    room.playerO = user
                    const roomUpdateResponse: RoomUpdateResponse = {
                        type: ResponseType.ROOM_UPDATE,
                        room: room
                    }
                    sendResponseToAll(room.users, roomUpdateResponse)
                }
            }
            else if (request.type === RequestType.CREATE_GAME) {
                const roomId = request.roomId
                const room = rooms.get(roomId)
                if (room &&
                    room.users.includes(user) &&
                    room.playerX &&
                    room.playerO &&
                    (room.playerX === user || room.playerO === user)
                ) {
                    const newGame = createGame()
                    room.games.push(newGame)
                    room.currentGame = newGame.id

                    const roomUpdateResponse: RoomUpdateResponse = {
                        type: ResponseType.ROOM_UPDATE,
                        room: room
                    }
                    sendResponseToAll(room.users, roomUpdateResponse)
                }
            }
            else if (request.type === RequestType.MOVE) {
                const roomId = request.roomId
                const gameId = request.gameId
                const mainIndex = request.mainIndex
                const subIndex = request.subIndex

                const room = rooms.get(roomId)
                if (!room) {
                    return
                }
                const game = room.games.find(game => game.id === gameId)
                if (!game) {
                    return
                }
                if (room.users.includes(user) &&
                    room.currentGame === game.id &&
                    room.playerX &&
                    room.playerO
                ) {
                    if ((game.currentPlayer === Player.X && room.playerX === user) ||
                        (game.currentPlayer === Player.O && room.playerO === user)
                    ) {
                        const move = makeMove(game, mainIndex, subIndex)
                        game.board = move.board
                        game.currentPlayer = move.currentPlayer
                        game.requiredBoardIndex = move.requiredBoardIndex
                        game.updatedTimestamp = move.updatedTimestamp

                        const roomUpdateResponse: RoomUpdateResponse = {
                            type: ResponseType.ROOM_UPDATE,
                            room: room
                        }
                        sendResponseToAll(room.users, roomUpdateResponse)
                    }
                }
            }
            else if (request.type === RequestType.END) {
                const roomId = request.roomId
                const gameId = request.gameId

                const room = rooms.get(roomId)
                if (!room) {
                    return
                }
                const game = room.games.find(game => game.id === gameId)
                if (!game) {
                    return
                }
                if (room.users.includes(user) &&
                    room.currentGame === game.id &&
                    room.playerX &&
                    room.playerO &&
                    (room.playerX === user || room.playerO === user)
                ) {
                    room.currentGame = null

                    const roomUpdateResponse: RoomUpdateResponse = {
                        type: ResponseType.ROOM_UPDATE,
                        room: room
                    }
                    sendResponseToAll(room.users, roomUpdateResponse)
                }
            }
        }

        ws.onclose = () => {
            rooms.forEach((room) => {
                const userIndex = room.users.findIndex(u => u === user)
                if (userIndex === -1) {
                    return
                }

                room.users.splice(userIndex, 1)

                if (room.playerX === user) {
                    room.playerX = null
                }
                if (room.playerO === user) {
                    room.playerO = null
                }

                const roomUpdateResponse: RoomUpdateResponse = {
                    type: ResponseType.ROOM_UPDATE,
                    room: room
                }
                sendResponseToAll(room.users, roomUpdateResponse)
            })
            
            connections.delete(connectionId)
        }
    })

    return app
}


if (require.main === module) {
    const app = createServer()
    ViteExpress.listen(app as any, PORT, () => console.log(`Server is listening on port: ${PORT}`));
}
