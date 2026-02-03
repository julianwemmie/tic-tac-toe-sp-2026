import { useState } from "react";
import { createGame, getWinner, isTie, makeMove, type Player} from "./tic-tac-toe";

function App() {
  const [gameState, setGameState] = useState(getInitialGame())
  const [winner, setWinner] = useState<null|Player|'tie'>(null)

  const onClick = (index: number) => {
    const nextState = makeMove(gameState, index)
    setGameState(nextState)

    if (getWinner(nextState)) {
      setWinner(getWinner(nextState))
    }
    if (isTie(nextState)) {
      setWinner('tie')
    }
  }

  const getGameInfoText = () => {
    if (winner === 'tie'
    ) {
      return 'GAME OVER! The game ended in a TIE!'
    }
    if (winner) {
      return 'GAME OVER! The winner was: ' + winner
    }
    return 'Tic-Tac-Toe! Current player: ' + gameState.currentPlayer
  }

  // TODO: display the gameState, and call `makeMove` when a player clicks a button
  return (
    <>
      <div style={{
        paddingTop: '15em',
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
          {gameState.board.map((cell, index) => (
            <button style={{
              height: '5rem',
              width: '5rem',
              fontSize: '20px'
            }}
            onClick={() => onClick(index)}
            >{cell ?? '-'}</button>
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
