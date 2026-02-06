import { getSubGameWinner, isWinnerTie } from "../ultimate-tic-tac-toe"
import { type GameState, Player, TIE } from "../types/ultimateTicTacToe"
import { getTTTBordersByIndex } from "../utils/styling"

type SubBoardProps = {
  gameState: GameState,
  mainIndex: number,
  makeMove: (mainBoardIndex: number, subIndex: number) => void
  highlighted: boolean
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
        marginBottom: '3px'
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
            bottom: 0
          }}>
            <p style={{
              fontSize: isWinnerTie(winner) ? '4rem' : '7rem',
              margin: '0',
              textAlign: 'center'
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
              color: highlighted ? 'black' : 'rgb(139, 139, 139)',
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