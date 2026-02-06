import { describe, test, expect, vi } from "vitest";
import { createGame, makeMove } from "./ultimate-tic-tac-toe";
import { Player, type GameState } from "./types/ultimateTicTacToe";
import { randomInt } from "crypto";
import exampleGames from './example-games.json'

describe('create game', () => {
    test('should create game with the correct initial values', () => {
        const game = createGame()
        
        expect(game.currentPlayer).toBe(Player.X)
        expect(game.id).not.toBeNull()
        expect(game.board.length).toBe(9)
        game.board.forEach(subBoard => {
            expect(subBoard.length).toBe(9)
        });
        expect(game.requiredBoardIndex).toBeNull()
    })
})

describe('make move', () => {
    test('should make a valid move when the board is empty', () => {
        let game = createGame()
        const mainIndex = randomInt(9)
        const subIndex = randomInt(9)
        game = makeMove(game, mainIndex, subIndex)

        for (let i = 0; i<game.board.length; i++) {
            for (let j = 0; j<game.board[0].length; j++) {
                if (i === mainIndex && j === subIndex) {
                    expect(game.board[i][j]).toBe(Player.X)
                }
                else {
                    expect(game.board[i][j]).toBeNull()
                }
            }
        }
    })

    test('should not update the board when cell is already occupied', () => {
        let game = createGame()
        const firstMove = makeMove(game, 4, 2)
        const secondMove = makeMove(game, 4, 2)

        expect(firstMove).toEqual(secondMove)
    })

    test('should not update the board when the game is already complete', () => {
        const gameWhereXWins = exampleGames["x-wins"] as GameState
        const move = makeMove(gameWhereXWins, 0,0)
        
        expect(gameWhereXWins).toEqual(move)
    })

    test('should update property updateTimestamp', () => {
        const spy = vi.spyOn(Date, 'now')
        spy.mockReturnValueOnce(1000)
        spy.mockReturnValueOnce(2000)

        let game = createGame()
        const originalUpdated = game.updatedTimestamp
        game = makeMove(game, 0, 0)
        expect(originalUpdated).not.toEqual(game.updatedTimestamp)

        spy.mockRestore()
    })
})

