import { type GameState } from "../types/ultimateTicTacToe"
import { getTTTBordersByIndex } from "../utils/styling"
import SubBoard from "./SubBoard"

type MainBoardProps = {
  gameState: GameState,
  makeMove: (mainBoardIndex: number, subIndex: number) => void
}

export default function MainBoard({gameState, makeMove}: MainBoardProps) {

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)'
    }}>
      {gameState.board.map((_, index) => (
        <div
          key={index}
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignContent: 'center',
            ...getTTTBordersByIndex(index, '3px', 'rgb(79, 79, 79)')
          }}
        >
          <SubBoard
            gameState={gameState}
            mainIndex={index}
            makeMove={makeMove}
            highlighted={gameState.requiredBoardIndex === null || gameState.requiredBoardIndex === index}
          />
        </div>
      ))}
    </div>
  )
}