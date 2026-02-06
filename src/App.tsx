import { useEffect, useRef, useState } from 'react';
import './App.css'
import SelectGame from './components/SelectGame';
import UltimateTicTacToe from './components/UltimateTicTacToe';
import { type SocketResponse } from './types/ws';

function App() {

  const [selectedGameId, setSelectedGameId] = useState<string | null>(null)
  const [wsMessage, setWsMessage] = useState<SocketResponse>()
  const wsRef = useRef<WebSocket>(null)

  useEffect(() => {
    const ws = new WebSocket('ws://localhost:3000/ws')
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
        {/* <button onClick={() => fetch('http://localhost:3000/debug')}>debug</button> */}
        <h3>Ultimate Tic-Tac-Toe!</h3>
        {selectedGameId ?
          <UltimateTicTacToe
            selectedGameId={selectedGameId}
            setSelectedGameId={setSelectedGameId}
            wsMessage={wsMessage}
            wsRef={wsRef}
          /> :
          <SelectGame setSelectedGameId={setSelectedGameId} wsMessage={wsMessage} wsRef={wsRef}/>}
      </div>
    </>
  )
}

export default App;
