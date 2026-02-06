import { useEffect, useState } from "react"
import type { GameState } from "../types/ultimateTicTacToe"
import GameThumbnail from "./GameThumbnail"
import { timestampToLocalDateTime } from "../utils/date"


type SelectGameProps = {
  setSelectedGameId: React.Dispatch<React.SetStateAction<string | null>>
}

export default function SelectGame({ setSelectedGameId }: SelectGameProps) {

  const [games, setGames] = useState<GameState[]>()

  useEffect(() => {
    fetch('http://localhost:3000/games')
      .then(res => res.json())
      .then(games => {
        const gamesList = Object.values<GameState>(games)
        setGames(gamesList.sort((a, b) => (b.createdTimestamp - a.createdTimestamp)))
      })
  }, [])

  const createNewGame = () => {
    fetch('http://localhost:3000/create')
      .then(res => res.json())
      .then(game => setSelectedGameId(game.id))
  }

  return (
    <>
      <button onClick={createNewGame}>New Game</button>
      <p>Select Game</p>
      <div className="select-game--grid">
        {games?.map((game) => (
          <div
            key={game.id}
            onClick={() => setSelectedGameId(game.id)}
            className="select-game--button"
            style={{
              padding: '0.5rem',
              position: 'relative'
            }}
          >
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              zIndex: '4'
            }}></div>
            <div style={{
              fontSize: '0.75rem',
              textAlign: 'center'
            }}>
              {timestampToLocalDateTime(game.createdTimestamp)}
            </div>
            <GameThumbnail gameState={game} />
          </div>
        ))}
      </div>
    </>
  )
}