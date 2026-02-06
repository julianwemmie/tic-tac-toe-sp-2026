import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import { createServer } from './server';
import { Player } from "./types/ultimateTicTacToe";

let app = createServer()

beforeEach(() => {
    app = createServer()
})

describe('/health', () => {
    it('should return ok', async () => {
        const response = await request(app)
            .get('/health')

        expect(response.status).toBe(200);
        expect(response.text).toEqual('ok');
    });
});

describe('/games', () => {
    it('should return empty object on new server', async () => {
        const response = await request(app)
            .get('/games')

        expect(response.status).toBe(200)
        expect(response.body).toEqual({})
    })

    it('should return populated object when server has games', async () => {
        await request(app).get('/create')
        await request(app).get('/create')
        const games = await request(app)
            .get('/games')

        expect(Object.keys(games.body).length).toBe(2)
    })
})

describe('/create', () => {
    it('should create a new game and add it to games list', async () => {
        const newGame = await request(app).get('/create')
        expect(newGame.body.id).not.toBeNull()
        expect(newGame.body.board).not.toBeNull()
        expect(newGame.body.currentPlayer).toBe(Player.X)
        expect(newGame.body.requiredBoardIndex).toBeNull()

        const games = await request(app)
            .get('/games')

        expect(Object.keys(games.body).length).toBe(1)
    })
})

describe('/game', () => {
    it('should return correct game when given id', async () => {
        const createResponse = await request(app).get('/create')
        const newGame = createResponse.body
        const gameResponse = await request(app).get(`/game/${newGame.id}`)
        const existingGame = gameResponse.body

        expect(newGame).toEqual(existingGame)
        expect(gameResponse.status).toBe(200)
    })

    it('should return 404 when game not found', async () => {
        const gameResponse = await request(app).get(`/game/1`)

        expect(gameResponse.status).toBe(404)
    })

    it('should return 404 when missing id', async () => {
        await request(app).get(`/game`).expect(404)
    })
})

describe('/move', () => {
    it('should make move when given game id and correct parameters', async () => {
        const createResponse = await request(app).get('/create')
        const newGame = createResponse.body
        const moveResponse = await request(app)
            .post(`/move/${newGame.id}`)
            .send({ mainIndex: 0, subIndex: 0 })
            .expect(200)
        const move = moveResponse.body
        expect(move.board[0][0]).toBe(Player.X)
        expect(move.currentPlayer).toBe(Player.O)
    })

    it('should return 404 when game not found', async () => {
        await request(app)
            .post(`/move/1`)
            .send({ mainIndex: 0, subIndex: 0 })
            .expect(404)
    })

    it('should return 400 when missing mainIndex or subIndex', async () => {
        const createResponse = await request(app).get('/create')
        const newGame = createResponse.body
        await request(app)
            .post(`/move/${newGame.id}`)
            .expect(400)
    })
})