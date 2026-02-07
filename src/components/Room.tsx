import { RequestType, ResponseType, type CreateGameRequest, type JoinORequest, type JoinXRequest, type SocketRequest, type SocketResponse } from "../types/ws"
import type { Room as RoomType } from '../types/server'
import { useEffect } from "react"
import UltimateTicTacToe from "./UltimateTicTacToe"
import { timestampToLocalDateTime } from "../utils/date"
import GameThumbnail from "./GameThumbnail"

type RoomProps = {
  wsMessage: SocketResponse | undefined,
  sendRequest: (request: SocketRequest) => void
  room: RoomType,
  setRoom: React.Dispatch<React.SetStateAction<RoomType | null>>,
  nickname: string,
}

export default function Room({ wsMessage, sendRequest, room, setRoom, nickname }: RoomProps) {

  useEffect(() => {
    if (wsMessage?.type === ResponseType.ROOM_UPDATE) {
      setRoom(wsMessage.room)
    }
  }, [wsMessage])

  const handleJoinX = () => {
    const joinXRequest: JoinXRequest = {
      type: RequestType.JOIN_X,
      roomId: room.roomId
    }
    sendRequest(joinXRequest)
  }

  const handleJoinO = () => {
    const joinORequest: JoinORequest = {
      type: RequestType.JOIN_O,
      roomId: room.roomId
    }
    sendRequest(joinORequest)
  }

  const handleStartGame = () => {
    const createGameRequest: CreateGameRequest = {
      type: RequestType.CREATE_GAME,
      roomId: room.roomId
    }
    sendRequest(createGameRequest)
  }

  return (
    <>
      {!room.currentGame ? (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "1.5rem", maxWidth: '400px', margin: '0 auto' }}>
          <div className="room-code">{room.roomId}</div>
          <p style={{ margin: 0, color: '#7a7265' }}>Welcome, <strong style={{ color: '#3d3529' }}>{nickname}</strong></p>

          <div className="card" style={{ width: '100%' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <span style={{ fontWeight: 500 }}>Players</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {room.playerX ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem', backgroundColor: '#eef1f5', borderRadius: '6px' }}>
                  <span className="player-x" style={{ fontWeight: 700 }}>X</span>
                  <span>{room.playerX.name}</span>
                </div>
              ) : (
                <button onClick={handleJoinX} className="btn-x" style={{ width: '100%' }}>
                  Join as X
                </button>
              )}
              {room.playerO ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem', backgroundColor: '#f7f0ee', borderRadius: '6px' }}>
                  <span className="player-o" style={{ fontWeight: 700 }}>O</span>
                  <span>{room.playerO.name}</span>
                </div>
              ) : (
                <button onClick={handleJoinO} className="btn-o" style={{ width: '100%' }}>
                  Join as O
                </button>
              )}
            </div>
          </div>

          <button onClick={handleStartGame} className="btn-primary" style={{ width: '100%', padding: '0.75rem' }}>
            Start Game
          </button>

          {room.games && room.games.length > 0 && (
            <div style={{ width: '100%' }}>
              <p style={{ margin: '0 0 0.75rem', fontWeight: 500, color: '#7a7265', fontSize: '0.875rem' }}>Previous Games</p>
              <div className="select-game--grid">
                {room.games.map((game) => (
                  <div
                    key={game.id}
                    className="select-game--button"
                    style={{ padding: '0.75rem' }}
                  >
                    <div style={{ fontSize: '0.7rem', textAlign: 'center', color: '#7a7265', marginBottom: '0.5rem' }}>
                      {timestampToLocalDateTime(game.createdTimestamp)}
                    </div>
                    <GameThumbnail gameState={game} />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        <UltimateTicTacToe
          sendRequest={sendRequest}
          room={room}
          currentPlayer={nickname}
        />
      )}
    </>
  )
}