import { getSubGameWinner, isWinnerTie } from "../ultimate-tic-tac-toe"
import { type GameState } from "../types/ultimateTicTacToe"
import { getTTTBordersByIndex } from "../utils/styling"

type GameThumbnailProps = {
  gameState: GameState
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
                  bottom: 0
                }}>
                  <p style={{
                    fontSize: isWinnerTie(getSubGameWinner(gameState, mainIndex)) ? '1rem' : '3rem',
                    margin: '0',
                    textAlign: 'center',
                    color: 'rgb(71, 71, 71)'
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
                    color: 'black',
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