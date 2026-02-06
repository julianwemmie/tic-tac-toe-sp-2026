import express, { json } from "express";
import expressWs from 'express-ws'
import ViteExpress from "vite-express";
import cors from 'cors';
import WebSocket from 'ws';


import { createGame, makeMove, type GameState } from './ultimate-tic-tac-toe.ts'

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
    // const subscriptions = new Map<string, string[]>() // gameId : clientId[]

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
            const eventObject = JSON.parse(eventString)

            // if (eventObject.type === 'move') {
            //     const {gameId, mainIndex, subIndex} = eventObject
            //     if ([gameId, mainIndex, subIndex].some(val => val === undefined)) {
            //         // send error
            //     }

            //     ws.send(JSON.stringify(eventObject))
            // }
            if (eventObject.type === 'test') {
                console.log('test')
                ws.send(JSON.stringify({type:'test', data:'data'}))
            }
        }

        ws.onclose = () => {
            connections.delete(clientId)
        }
    })

    return app
}


if (require.main === module) {
    const app = createServer()
    ViteExpress.listen(app as any, PORT, () => console.log(`Server is listening on port: ${PORT}`));
}
