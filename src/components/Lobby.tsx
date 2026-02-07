import { useEffect, useState } from "react"
import { RequestType, ResponseType, type CreateRoomRequest, type JoinRoomRequest, type SetNameRequest, type SocketRequest, type SocketResponse } from "../types/ws"
import type { Room as RoomType } from '../types/server'


type LobbyProps = {
  wsMessage: SocketResponse | undefined,
  sendRequest: (request: SocketRequest) => void
  setRoom: React.Dispatch<React.SetStateAction<RoomType | null>>,
  nickname: string,
  setNickname: React.Dispatch<React.SetStateAction<string>>
}


export default function Lobby({ wsMessage, sendRequest, setRoom, nickname, setNickname }: LobbyProps) {
  const [roomCodeInput, setRoomCodeInput] = useState('')

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value.toUpperCase()
    if (/^[A-Z]*$/.test(value)) {
      setRoomCodeInput(value)
    }
  }

  useEffect(() => {
    if (wsMessage?.type === ResponseType.SET_NAME) {
      setNickname(wsMessage.name)
    }
    else if (wsMessage?.type === ResponseType.CREATE_ROOM) {
      setRoom(wsMessage.room)
    }
    else if (wsMessage?.type === ResponseType.JOIN_ROOM) {
      if (!wsMessage.room) {
        alert('Room not found')
      } else {
        setRoom(wsMessage.room)
      }
    }
  }, [wsMessage])

  const createRoom = () => {
    if (!nickname) {
      alert('Please set a nickname before creating a room')
      return
    }
    const createRoom: CreateRoomRequest = {
      type: RequestType.CREATE_ROOM
    }
    sendRequest(createRoom)
  }

  const joinRoom = () => {
    if (!nickname) {
      alert('Please set a nickname before joining a room')
      return
    }
    if (roomCodeInput.length !== 5) {
      alert('Room code must be 5 letters')
      return
    }
    const joinRoom: JoinRoomRequest = {
      type: RequestType.JOIN_ROOM,
      roomId: roomCodeInput
    }
    sendRequest(joinRoom)
  }

  const handleSetNickname = (name: string) => {
    const request: SetNameRequest = {
      type: RequestType.SET_NAME,
      name: name
    }
    sendRequest(request)
  }

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '1.5rem',
      maxWidth: '320px',
      margin: '0 auto'
    }}>
      <div className="card" style={{ width: '100%', textAlign: 'center' }}>
        {nickname ? (
          <p style={{ margin: 0, fontSize: '1rem' }}>
            Playing as <strong>{nickname}</strong>
          </p>
        ) : (
          <>
            <p style={{ margin: '0 0 0.75rem', color: '#7a7265' }}>Set your nickname to play</p>
            <button
              onClick={() => handleSetNickname(prompt('Enter your nickname:') || '')}
              className="btn-primary"
              style={{ width: '100%' }}
            >
              Set Nickname
            </button>
          </>
        )}
      </div>

      <div className="card" style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        <button
          onClick={createRoom}
          className="btn-primary"
          style={{ width: '100%' }}
        >
          Create Room
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <div style={{ flex: 1, height: '1px', backgroundColor: '#e0dbd2' }}></div>
          <span style={{ color: '#a09789', fontSize: '0.75rem' }}>or</span>
          <div style={{ flex: 1, height: '1px', backgroundColor: '#e0dbd2' }}></div>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <input
            type="text"
            maxLength={5}
            value={roomCodeInput}
            onChange={handleInputChange}
            placeholder="ABCDE"
            style={{ flex: 1, textAlign: 'center', letterSpacing: '0.1em', fontWeight: 500 }}
          />
          <button onClick={joinRoom}>
            Join
          </button>
        </div>
      </div>
    </div>
  )
}