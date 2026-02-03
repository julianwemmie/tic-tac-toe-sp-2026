import { type GameState, getSubGameWinner } from "../ultimate-tic-tac-toe"

type SubBoardProps = {
  gameState: GameState,
  mainIndex: number,
  onClick: (mainIndex: number, subIndex: number) => void
}

export default function SubBoard({ gameState, mainIndex, onClick }: SubBoardProps) {
  const winner = getSubGameWinner(gameState, mainIndex)

  const handleClick = (mainIndex: number, subIndex: number) => {
    onClick(mainIndex, subIndex)
  }

  const getBordersByIndex = (index: number) => {
    let borders = {
      borderTop: 'solid',
      borderBottom: 'solid',
      borderLeft: 'solid',
      borderRight: 'solid'
    }
    if ([0, 1, 2].includes(index)) {
      borders = {
        ...borders,
        borderTop: 'none',
      }
    }
    if ([0, 3, 6].includes(index)) {
      borders = {
        ...borders,
        borderLeft: 'none'
      }
    }
    if ([2, 5, 8].includes(index)) {
      borders = {
        ...borders,
        borderRight: 'none'
      }
    }
    if ([6, 7, 8].includes(index)) {
      borders = {
        ...borders,
        borderBottom: 'none'
      }
    }
    return borders
  }

  if (winner) {
    return (
      <p style={{
        fontSize: '75px',
        margin: '0',
        textAlign: 'center'
      }}>{winner}</p>
    )
  }

  return (
    <>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        padding: '2px'
      }}>
        {gameState.board[mainIndex].map((cell, index) => (
          <button
            className="tic-tac-toe--button"
            style={{
              height: '2.5rem',
              width: '2.5rem',
              fontSize: '25px',
              borderColor: 'grey',
              ...getBordersByIndex(index)
            }}
            onClick={() => handleClick(mainIndex, index)}
          >{cell ?? '-'}</button>
        ))}
      </div>
    </>
  )
}