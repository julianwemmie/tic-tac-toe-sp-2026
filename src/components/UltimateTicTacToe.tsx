import { useEffect, useState } from "react";
import { createGame, getGameWinner } from "../ultimate-tic-tac-toe";
import { TIE, type GameState } from "../types/ultimateTicTacToe";
import MainBoard from './MainBoard';

type UltimateTicTacToeProps = {
  selectedGameId: string,
  setSelectedGameId: React.Dispatch<React.SetStateAction<string | null>>
}

export default function UltimateTicTacToe({selectedGameId, setSelectedGameId}: UltimateTicTacToeProps) {

  const [gameState, setGameState] = useState<GameState>(createGame())
  const [loading, setLoading] = useState(false)
  const winner = gameState ? getGameWinner(gameState) : undefined

  useEffect(() => {
    setLoading(true)
    fetch(`http://localhost:3000/game/${selectedGameId}`)
      .then(res => res.json())
      .then(gameState => setGameState(gameState))
      .finally(() => setLoading(false))
  }, [])

  const handleClick = (mainBoardIndex: number, subIndex: number): void => {
    fetch(`http://localhost:3000/move/${selectedGameId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ mainIndex: mainBoardIndex, subIndex: subIndex })
    })
      .then(res => res.json())
      .then(gameState => setGameState(gameState))
  }

  const returnToLobby = () => {
    setGameState(createGame())
    setSelectedGameId(null)
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
        paddingBottom: '2rem'
      }}>
        {getGameInfoText()}
      </div>
      <MainBoard
        gameState={gameState}
        makeMove={handleClick}
      />
      <button onClick={returnToLobby}>Lobby</button>
    </>
  )
}