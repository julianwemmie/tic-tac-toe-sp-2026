import './App.css'
import { useEffect, useState } from "react";
import { createGame, getGameWinner, TIE, type GameState } from "./ultimate-tic-tac-toe";
import MainBoard from './components/MainBoard';

function App() {
  const [gameState, setGameState] = useState<GameState>(createGame())
  const [loading, setLoading] = useState(false)
  const winner = gameState ? getGameWinner(gameState) : undefined

  useEffect(() => {
    setLoading(true)
    fetch('http://localhost:3000/game')
      .then(res => res.json())
      .then(gameState => setGameState(gameState))
      .finally(() => setLoading(false))
  }, [])

  const handleClick = (mainBoardIndex: number, subIndex: number): void => {
    fetch('http://localhost:3000/move', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ mainIndex: mainBoardIndex, subIndex: subIndex })
    })
      .then(res => res.json())
      .then(gameState => setGameState(gameState))
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

  if (loading) {
    return <p>loading...</p>
  }

  return (
    <>
      <div style={{
        paddingTop: '10vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        <h3>Ultimate Tic-Tac-Toe!</h3>
        <div style={{
          paddingBottom: '2rem'
        }}
        >{getGameInfoText()}</div>
        <MainBoard
          gameState={gameState}
          makeMove={handleClick}
        />
      </div>
    </>
  )
}

export default App;
