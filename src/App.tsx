import './App.css'
import { useState } from "react";
import { createGame, getGameWinner, TIE } from "./ultimate-tic-tac-toe";
import MainBoard from './components/MainBoard';

function App() {
  const [gameState, setGameState] = useState(getInitialGame())
  const winner = getGameWinner(gameState)

  const getGameInfoText = () => {
    if (winner === TIE
    ) {
      return 'GAME OVER! The game ended in a TIE!'
    }
    if (winner) {
      return 'GAME OVER! The winner was: ' + winner
    }
    return `Current player: ${gameState.currentPlayer}`
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
          setGameState={setGameState}
        />
      </div>
    </>
  )
}

function getInitialGame() {
  let initialGameState = createGame()
  // initialGameState = makeMove(initialGameState, 3)
  // initialGameState = makeMove(initialGameState, 0)
  return initialGameState
}

export default App;
