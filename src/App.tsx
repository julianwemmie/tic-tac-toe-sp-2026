import { useEffect, useRef, useState } from 'react';
import './App.css'
import { type SocketRequest, type SocketResponse } from './types/ws';
import Lobby from './components/Lobby';
import type { Room as RoomType } from './types/server';
import Room from './components/Room';
const BASE_URL = import.meta.env.VITE_BASE_URL || 'ws://localhost:3000'


function App() {

  const [room, setRoom] = useState<RoomType | null>(null)
  const [nickname, setNickname] = useState('')
  const [wsMessage, setWsMessage] = useState<SocketResponse>()
  const wsRef = useRef<WebSocket>(null)
  const sendRequest = (request: SocketRequest) => {
    wsRef.current?.send(JSON.stringify(request))
  }

  useEffect(() => {
    const ws = new WebSocket(BASE_URL + '/ws')
    ws.onopen = () => {
      wsRef.current = ws
    }
    ws.onmessage = (event) => {
      const response = (JSON.parse(event.data.toString())) as SocketResponse
      setWsMessage(response)
    }
    ws.onclose = () => {
      wsRef.current = null
    }
    return () => {
      ws.close()
      wsRef.current = null
    }
  }, [])

  return (
    <>
      <div style={{
        paddingTop: '10vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        <button onClick={() => fetch('http://localhost:3000/debug')}>debug</button>
        <h3>Ultimate Tic-Tac-Toe!</h3>
        {room ? (
          <Room
            wsMessage={wsMessage}
            sendRequest={sendRequest}
            room={room} 
            setRoom={setRoom}
            nickname={nickname}
            />
        ) :
          <Lobby
            wsMessage={wsMessage}
            sendRequest={sendRequest}
            setRoom={setRoom}
            nickname={nickname}
            setNickname={setNickname}
          />
        }
      </div>
    </>
  )
}

export default App;
