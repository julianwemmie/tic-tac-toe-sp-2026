import { getGameWinner } from "../ultimate-tic-tac-toe";
import { TIE } from "../types/ultimateTicTacToe";
import MainBoard from './MainBoard';
import { RequestType, type EndRequest, type MoveRequest, type SocketRequest } from "../types/ws";
import type { Room as RoomType } from "../types/server";

type UltimateTicTacToeProps = {
  sendRequest: (request: SocketRequest) => void,
  room: RoomType,
  currentPlayer: string,
}

export default function UltimateTicTacToe({sendRequest, room, currentPlayer }: UltimateTicTacToeProps) {
  
  const gameState = room.games.find(game => game.id === room.currentGame)
  const winner = gameState ? getGameWinner(gameState) : undefined

  const handleClick = (mainBoardIndex: number, subIndex: number): void => {
    const moveRequest: MoveRequest = {
      type: RequestType.MOVE,
      roomId: room.roomId,
      gameId: room.currentGame!,
      mainIndex: mainBoardIndex,
      subIndex: subIndex
    }

    sendRequest(moveRequest)
  }

  const handleEndGame = () => {
    const endRequest: EndRequest = {
      type: RequestType.END,
      roomId: room.roomId,
      gameId: room.currentGame!
    }
    sendRequest(endRequest)
  }

  const getGameInfoText = () => {
    if (winner === TIE) {
      return 'GAME OVER! The game ended in a TIE!'
    }
    if (winner) {
      return 'GAME OVER! The winner was: ' + winner
    }
    return `Current player: ${gameState?.currentPlayer}`
  }

  const getPlayerSymbol = () => {
    if (room.playerX?.name === currentPlayer) {
      return 'X'
    }
    if (room.playerO?.name === currentPlayer) {
      return 'O'
    }
    return 'spectator'
  }

  if (!gameState) {
    return <div>Loading...</div>
  }

  return (
    <>
      <div style={{
        paddingBottom: '2rem'
      }}>
        You are: {getPlayerSymbol()}
      </div>
      <div style={{
        paddingBottom: '2rem'
      }}>
        {getGameInfoText()}
      </div>
      <MainBoard
        gameState={gameState}
        makeMove={handleClick}
      />
      <button onClick={handleEndGame}>End Game</button>
    </>
  )
}