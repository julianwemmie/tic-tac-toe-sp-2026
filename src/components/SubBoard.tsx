import { getSubGameWinner, isWinnerTie } from "../ultimate-tic-tac-toe"
import { type GameState } from "../types/ultimateTicTacToe"
import { getTTTBordersByIndex } from "../utils/styling"

type SubBoardProps = {
  gameState: GameState,
  mainIndex: number,
  makeMove: (mainBoardIndex: number, subIndex: number) => void
  highlighted: boolean
}

const getPlayerColor = (player: string | null, faded = false) => {
  if (player === 'X') return faded ? 'rgba(92, 109, 138, 0.5)' : '#5c6d8a'
  if (player === 'O') return faded ? 'rgba(182, 123, 107, 0.5)' : '#b67b6b'
  return faded ? 'rgba(122, 114, 101, 0.5)' : '#7a7265'
}

export default function SubBoard({ gameState, mainIndex, makeMove, highlighted }: SubBoardProps) {
  const winner = getSubGameWinner(gameState, mainIndex)

  return (
    <>
      <div style={{
        position: 'relative',
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        padding: '5px',
        marginRight: '3px',
        marginBottom: '3px',
        backgroundColor: highlighted && !winner ? 'rgba(61, 53, 41, 0.06)' : 'transparent',
        borderRadius: '4px',
        transition: 'background-color 0.2s ease'
      }}>
        {winner && (
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
              fontSize: isWinnerTie(winner) ? '4rem' : '7rem',
              margin: '0',
              textAlign: 'center',
              color: getPlayerColor(winner),
              fontWeight: 'bold'
            }}>{winner}</p>
          </div>
        )}
        {gameState.board[mainIndex].map((cell, index) => (
          <div
            key={`${mainIndex}-${index}`}
            className="tic-tac-toe--button"
            style={{
              height: '2.5rem',
              width: '2.5rem',
              textAlign: 'center',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              fontSize: '25px',
              fontWeight: 600,
              color: highlighted ? getPlayerColor(cell) : getPlayerColor(cell, true),
              cursor: highlighted && !winner && !cell ? 'pointer' : 'default',
              ...getTTTBordersByIndex(
                index,
                highlighted ? '2px' : '1px',
                highlighted ? 'rgb(125, 125, 125)' : 'rgb(200,200,200)'
              )
            }}
            onClick={() => makeMove(mainIndex, index)}
          >{cell}</div>
        ))}
      </div>
    </>
  )
}