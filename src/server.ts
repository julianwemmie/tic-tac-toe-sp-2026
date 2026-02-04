import express, { json } from "express";
import ViteExpress from "vite-express";
import cors from 'cors';

import {createGame, makeMove} from './ultimate-tic-tac-toe.ts'

const app = express();
app.use(json())
app.use(cors({
    origin: '*',
    methods: '*',
}))

let gameState = createGame()

app.get("/message", (_, res) => res.send("Hello from express!"));

app.get("/game", (_, res) => {
    res.json(gameState)
})

app.post("/move", (req, res) => {
    const {mainIndex, subIndex} = req.body
    gameState = makeMove(gameState, mainIndex, subIndex)
    res.json(gameState)
})

ViteExpress.listen(app, 3000, () => console.log("Server is listening..."));