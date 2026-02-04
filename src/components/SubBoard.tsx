import { type GameState, getSubGameWinner } from "../ultimate-tic-tac-toe"
import { getTTTBordersByIndex } from "../utils/styling"

type SubBoardProps = {
  gameState: GameState,
  mainIndex: number,
  onClick: (mainIndex: number, subIndex: number) => void,
  highlighted: boolean
}

export default function SubBoard({ gameState, mainIndex, onClick, highlighted }: SubBoardProps) {
  const winner = getSubGameWinner(gameState, mainIndex)

  const handleClick = (mainIndex: number, subIndex: number) => {
    onClick(mainIndex, subIndex)
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
      display: 'flex',
      justifyContent: 'center',
      alignContent: 'center'
    }}>

    </div>
      <div style={{
        position: 'relative',
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        padding: '5px',
      }}>
        {highlighted && (
          <div style={{
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            position: 'absolute',
            background: "rgba(66,66,66,0.2)",
            pointerEvents: 'none'
          }}></div>
        )}
        {gameState.board[mainIndex].map((cell, index) => (
          <div
            className="tic-tac-toe--button"
            style={{
              height: '2.5rem',
              width: '2.5rem',
              textAlign: 'center',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              fontSize: '25px',
              borderColor: '#666666',
              borderWidth: '1px',
              ...getTTTBordersByIndex(index)
            }}
            onClick={() => handleClick(mainIndex, index)}
          >{cell}</div>
        ))}
      </div>
    </>
  )
}