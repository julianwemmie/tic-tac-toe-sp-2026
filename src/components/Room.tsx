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
        <>
          <div>Room: {room.roomId}</div>
          <div>Hey! {nickname}</div>
          <div style={{
            display: 'flex',
            alignItems: 'center',
          }}>
            {room.playerX ? (
              <div>X Player: {room.playerX.name}</div>
            ) : (
              <button
                onClick={handleJoinX}
                style={{ height: '20px' }}
              >
                Join X
              </button>
            )}
          </div>
          <div style={{
            display: 'flex',
            alignItems: 'center',
          }}>
            {room.playerO ? (
              <div>O Player: {room.playerO.name}</div>
            ) : (
              <button
                onClick={handleJoinO}
                style={{ height: '20px' }}
              >
                Join O
              </button>
            )}
          </div>
          <button onClick={handleStartGame}>start game</button>
          <div className="select-game--grid">
            {room.games?.map((game) => (
              <div
                key={game.id}
                // onClick={() => setSelectedGameId(game.id)}
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