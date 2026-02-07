import { useEffect, useRef, useState } from 'react';
import './App.css'
import { type SocketRequest, type SocketResponse } from './types/ws';
import Lobby from './components/Lobby';
import type { Room as RoomType } from './types/server';
import Room from './components/Room';
const VITE_API_HOST = import.meta.env.VITE_API_HOST || 'localhost:3000'
const VITE_API_USE_HTTPS = import.meta.env.VITE_API_USE_HTTPS === 'true'

// const HTTP_BASE_URL = `${VITE_API_USE_HTTPS ? 'https' : 'http'}://${VITE_API_HOST}:${VITE_API_PORT}`
const WS_BASE_URL = `${VITE_API_USE_HTTPS ? 'wss' : 'ws'}://${VITE_API_HOST}`

function App() {

  const [room, setRoom] = useState<RoomType | null>(null)
  const [nickname, setNickname] = useState('')
  const [wsMessage, setWsMessage] = useState<SocketResponse>()
  const wsRef = useRef<WebSocket>(null)
  const sendRequest = (request: SocketRequest) => {
    wsRef.current?.send(JSON.stringify(request))
  }

  useEffect(() => {
    const ws = new WebSocket(WS_BASE_URL + '/ws')
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
        paddingTop: '5vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        {/* <button onClick={() => fetch(`${HTTP_BASE_URL}/debug`)}>debug</button> */}
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
