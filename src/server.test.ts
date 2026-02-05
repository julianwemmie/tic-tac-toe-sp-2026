import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import { createServer } from './server';
import { Player } from './ultimate-tic-tac-toe';

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