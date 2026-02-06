import { useEffect, useRef, useState } from 'react';
import './App.css'
import SelectGame from './components/SelectGame';
import UltimateTicTacToe from './components/UltimateTicTacToe';

function App() {

  const [selectedGameId, setSelectedGameId] = useState<string | null>(null)
  const wsRef = useRef<WebSocket>(null)

  useEffect(() => {
    const ws = new WebSocket('ws://localhost:3000/ws')
    ws.onmessage = (event) => {
      console.log(event.data.toString())
    }
    wsRef.current = ws
    return () => ws.close()
  },[])


  return (
    <>
      <div style={{
        paddingTop: '10vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        <button onClick={() => wsRef.current?.send(JSON.stringify({type: 'test'}))}>websocket</button>
        <h3>Ultimate Tic-Tac-Toe!</h3>
        {selectedGameId ?
          <UltimateTicTacToe
            selectedGameId={selectedGameId}
            setSelectedGameId={setSelectedGameId}
          /> :
          <SelectGame setSelectedGameId={setSelectedGameId} />}
      </div>
    </>
  )
}

export default App;
