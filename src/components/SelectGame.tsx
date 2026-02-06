import { useEffect, useState } from "react"
import GameThumbnail from "./GameThumbnail"
import { timestampToLocalDateTime } from "../utils/date"
import type { GameState } from "../types/ultimateTicTacToe"
import { RequestType, ResponseType, type CreateRequest, type SocketResponse } from "../types/ws"


type SelectGameProps = {
  setSelectedGameId: React.Dispatch<React.SetStateAction<string | null>>,
  wsMessage: SocketResponse | undefined,
  wsRef: React.RefObject<WebSocket | null>
}

export default function SelectGame({ setSelectedGameId, wsMessage, wsRef }: SelectGameProps) {

  const [games, setGames] = useState<GameState[]>()

  useEffect(() => {
    if (wsMessage?.type === ResponseType.CREATE) {
      setSelectedGameId(wsMessage.gameState.id)
    }
    if (wsMessage?.type === ResponseType.GAME_LIST_UPDATE) {
      const gamesList = Object.values<GameState>(wsMessage.games)
      setGames(gamesList.sort((a, b) => (b.createdTimestamp - a.createdTimestamp)))
    }
  }, [wsMessage])

  useEffect(() => {
    fetch('http://localhost:3000/games')
      .then(res => res.json())
      .then(games => {
        const gamesList = Object.values<GameState>(games)
        setGames(gamesList.sort((a, b) => (b.createdTimestamp - a.createdTimestamp)))
      })
  }, [])

  const createNewGame = () => {
    const createRequest: CreateRequest = {
      type: RequestType.CREATE,
    }
    wsRef.current?.send(JSON.stringify(createRequest))
  }

  return (
    <>
      <button onClick={createNewGame}>New Game</button>
      <p>Select Game</p>
      <div className="select-game--grid">
        {games?.map((game) => (
          <div
            key={game.id}
            onClick={() => setSelectedGameId(game.id)}
            className="select-game--button"
            style={{
              padding: '0.5rem',
              position: 'relative'
            }}
          >
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              zIndex: '4'
            }}></div>
            <div style={{
              fontSize: '0.75rem',
              textAlign: 'center'
            }}>
              {timestampToLocalDateTime(game.createdTimestamp)}
            </div>
            <GameThumbnail gameState={game} />
          </div>
        ))}
      </div>
    </>
  )
}