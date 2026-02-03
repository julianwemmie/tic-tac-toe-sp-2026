import './App.css'
import { useState } from "react";
import { createGame, getGameWinner, makeMove, TIE, type Player} from "./ultimate-tic-tac-toe";
import SubBoard from "./components/SubBoard"

function App() {
  const [gameState, setGameState] = useState(getInitialGame())
  const winner = getGameWinner(gameState)

  const onClick = (mainIndex: number, subIndex: number) => {
    const nextState = makeMove(gameState, mainIndex, subIndex)
    setGameState(nextState)
  }

  const getGameInfoText = () => {
    if (winner === TIE
    ) {
      return 'GAME OVER! The game ended in a TIE!'
    }
    if (winner) {
      return 'GAME OVER! The winner was: ' + winner
    }
    return 'Ultimate Tic-Tac-Toe! Current player: ' 
      + gameState.currentPlayer 
      + ' | Available square: ' 
      + (gameState.nextAvailableIndex ?? 'Any')
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
        <div style={{
          padding: '2rem',
        }}
          >{getGameInfoText()}</div>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)'
        }}>
          {gameState.board.map((_, index) => (
            <SubBoard 
              gameState={gameState}
              mainIndex={index}
              onClick={onClick}
            />
          ))}

        </div>
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
