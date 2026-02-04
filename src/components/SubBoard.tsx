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
        position: 'relative',
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        padding: '5px',
        marginRight: '3px',
        marginBottom: '3px'
      }}>
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
              color: highlighted ? 'black' : 'rgb(139, 139, 139)',
              ...getTTTBordersByIndex(
                index,
                highlighted ? '2px' : '1px',
                highlighted ? 'rgb(0,0,0)' : 'rgb(200,200,200)'
              )
            }}
            onClick={() => handleClick(mainIndex, index)}
          >{cell}</div>
        ))}
      </div>
    </>
  )
}