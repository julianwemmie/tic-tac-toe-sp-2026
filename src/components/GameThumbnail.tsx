import { getSubGameWinner, isWinnerTie } from "../ultimate-tic-tac-toe"
import { type GameState } from "../types/ultimateTicTacToe"
import { getTTTBordersByIndex } from "../utils/styling"

type GameThumbnailProps = {
  gameState: GameState
}

const getPlayerColor = (player: string | null) => {
  if (player === 'X') return '#5c6d8a'
  if (player === 'O') return '#b67b6b'
  return '#7a7265'
}

export default function GameThumbnail({ gameState }: GameThumbnailProps) {
  return (
    <>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)'
      }}>
        {gameState.board.map((_, mainIndex) => (
          <div
            key={mainIndex}
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignContent: 'center',
              ...getTTTBordersByIndex(mainIndex, '3px', 'rgb(79, 79, 79)')
            }}
          >
            <div style={{
              position: 'relative',
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              padding: '5px',
              marginRight: '3px',
              marginBottom: '3px'
            }}>
              {getSubGameWinner(gameState, mainIndex) && (
                <div style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  backgroundColor: 'rgba(245, 241, 235, 0.3)',
                  borderRadius: '4px'
                }}>
                  <p style={{
                    fontSize: isWinnerTie(getSubGameWinner(gameState, mainIndex)) ? '1rem' : '3rem',
                    margin: '0',
                    textAlign: 'center',
                    color: getPlayerColor(getSubGameWinner(gameState, mainIndex)),
                    fontWeight: 'bold'
                  }}>{getSubGameWinner(gameState, mainIndex)}</p>
                </div>
              )}
              {gameState.board[mainIndex].map((cell, index) => (
                <div
                  key={`${mainIndex}-${index}`}
                  style={{
                    height: '1rem',
                    width: '1rem',
                    textAlign: 'center',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    fontSize: '10px',
                    fontWeight: 600,
                    color: getPlayerColor(cell),
                    ...getTTTBordersByIndex(
                      index,
                      '1px',
                      'rgb(125, 125, 125)'
                    )
                  }}
                >{cell}</div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </>
  )
}