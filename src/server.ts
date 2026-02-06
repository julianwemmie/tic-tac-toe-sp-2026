import express, { json } from "express";
import expressWs from 'express-ws'
import ViteExpress from "vite-express";
import cors from 'cors';
import WebSocket from 'ws';


import { createGame, makeMove } from './ultimate-tic-tac-toe.ts'
import { type GameState } from "./types/ultimateTicTacToe.ts";
import { RequestType, ResponseType, type CreateResponse, type ErrorResponse, type GameListUpdateResponse, type SocketRequest } from "./types/ws.ts";

const PORT = 3000

export function createServer() {
    const { app } = expressWs(express())
    app.use(json())
    app.use(cors({
        origin: '*',
        methods: '*',
    }))

    const games = new Map<string, GameState>() // gameId : GameState
    const connections = new Map<string, WebSocket>() // clientId : WebSocket
    const subscriptions = new Map<string, string[]>() // gameId : clientId[]

    app.get('/debug', (_, res) => {
        console.log('------------DEBUG----------------------------------------------------')
        console.log('games: ', games.size)
        console.log('connections: ', connections.keys())
        console.log('subscriptions: ', subscriptions)
        res.send('ok')
    })

    app.get("/health", (_, res) => {
        res.send('ok')
    })

    app.get("/games", (_, res) => {
        const gamesObject = Object.fromEntries(games)
        res.json(gamesObject)
    })

    app.get("/create", (_, res) => {
        const newGame = createGame()
        games.set(newGame.id, newGame)
        res.json(newGame)
    })

    app.get("/game/:id", (req, res) => {
        const gameId = req.params.id as string
        if (!games.has(gameId)) {
            res.status(404)
            res.send(`Game with ID ${gameId} doesn't exist!`)
            return
        }
        res.json(games.get(gameId))
    })

    app.post("/move/:id", (req, res) => {
        const gameId = req.params.id as string
        if (req.body?.mainIndex === undefined || req.body?.subIndex === undefined) {
            res.status(400)
            res.send('Missing mainIndex or subIndex!')
            return
        }
        const { mainIndex, subIndex } = req.body
        if (!games.has(gameId)) {
            res.status(404)
            res.send(`Game with ID ${gameId} doesn't exist!`)
            return
        }
        const game = games.get(gameId) as GameState
        const gameState = makeMove(game, mainIndex, subIndex)
        games.set(gameId, gameState)
        res.json(gameState)
    })

    app.ws('/ws', (ws, _) => {
        const clientId = crypto.randomUUID()
        connections.set(clientId, ws)

        ws.onmessage = (event) => {
            const eventString = event.data.toString()
            const request = JSON.parse(eventString) as SocketRequest

            if (request.type === RequestType.CREATE) {
                const newGame = createGame()
                games.set(newGame.id, newGame)
                const createResponse: CreateResponse = {
                    type: ResponseType.CREATE,
                    gameState: newGame
                }
                ws.send(JSON.stringify(createResponse))

                connections.forEach((connectionWebSocket) => {
                    const gameListUpdateResponse: GameListUpdateResponse = {
                        type: ResponseType.GAME_LIST_UPDATE,
                        games: Object.fromEntries(games)
                    }
                    connectionWebSocket.send(JSON.stringify(gameListUpdateResponse))
                })
            }
            else if (request.type === RequestType.JOIN) {
                const gameId = request.gameId
                let subscribers = subscriptions.get(gameId)
                if (!subscribers) {
                    subscribers = []
                    subscriptions.set(gameId, subscribers)
                }
                subscribers.push(clientId)
            }
            else if (request.type === RequestType.LEAVE) {
                subscriptions.forEach((subscribers) => {
                    const index = subscribers.findIndex(subscriber => subscriber === clientId);
                    if (index !== -1) {
                        subscribers.splice(index, 1);
                    }
                })
            }
            else if (request.type === RequestType.MOVE) {
                const gameId = request.gameId
                const mainIndex = request.mainIndex
                const subIndex = request.subIndex

                if (gameId === undefined || mainIndex === undefined || subIndex === undefined) {
                    const error: ErrorResponse = {
                        type: ResponseType.ERROR,
                        message: 'Request must contain gameId, mainIndex, and subIndex'
                    }
                    ws.send(JSON.stringify(error))
                    return
                }

                const game = games.get(gameId)

                if (!game) {
                    const error: ErrorResponse = {
                        type: ResponseType.ERROR,
                        message: `Game with ID ${gameId} doesn't exist!`
                    }
                    ws.send(JSON.stringify(error))
                    return
                }

                const gameState = makeMove(game, mainIndex, subIndex)
                games.set(gameId, gameState)

                const subscribers = subscriptions.get(gameId)
                subscribers?.forEach(subscriber => {
                    const subscriberWebsocket = connections.get(subscriber)
                    subscriberWebsocket?.send(JSON.stringify({
                        type: ResponseType.GAME_UPDATE,
                        gameState: gameState
                    }))
                })
            }

            connections.forEach((connectionWebSocket) => {
                const gameListUpdateResponse: GameListUpdateResponse = {
                    type: ResponseType.GAME_LIST_UPDATE,
                    games: Object.fromEntries(games)
                }
                connectionWebSocket.send(JSON.stringify(gameListUpdateResponse))
            })
        }

        ws.onclose = () => {
            connections.delete(clientId)
            subscriptions.forEach((subscribers) => {
                const index = subscribers.findIndex(subscriber => subscriber === clientId);
                if (index !== -1) {
                    subscribers.splice(index, 1);
                }
            })
        }
    })

    return app
}


if (require.main === module) {
    const app = createServer()
    ViteExpress.listen(app as any, PORT, () => console.log(`Server is listening on port: ${PORT}`));
}
