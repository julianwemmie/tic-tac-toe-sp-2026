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

  const playerSymbol = getPlayerSymbol()
  const playerColorClass = playerSymbol === 'X' ? 'player-x' : playerSymbol === 'O' ? 'player-o' : ''

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
      <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <span style={{ fontSize: '0.75rem', color: '#7a7265' }}>You are</span>
          <div className={playerColorClass} style={{ fontSize: '1.5rem', fontWeight: 700 }}>{playerSymbol}</div>
        </div>
        <div style={{ width: '1px', height: '2.5rem', backgroundColor: '#e0dbd2' }}></div>
        <div style={{ textAlign: 'center' }}>
          <span style={{ fontSize: '0.75rem', color: '#7a7265' }}>{winner ? 'Result' : 'Turn'}</span>
          <div className={`player-${gameState.currentPlayer.toLowerCase()}`} style={{ fontSize: '1.5rem', fontWeight: 700 }}>
            {winner ? (winner === TIE ? 'Tie' : winner) : gameState.currentPlayer}
          </div>
        </div>
      </div>

      <MainBoard
        gameState={gameState}
        makeMove={handleClick}
      />

      <button onClick={handleEndGame} style={{ marginTop: '0.5rem' }}>
        End Game
      </button>
    </div>
  )
}