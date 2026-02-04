import { makeMove, type GameState } from "../ultimate-tic-tac-toe"
import { getTTTBordersByIndex } from "../utils/styling"
import SubBoard from "./SubBoard"

type MainBoardProps = {
  gameState: GameState,
  setGameState: React.Dispatch<React.SetStateAction<GameState>>
}

export default function MainBoard({gameState, setGameState}: MainBoardProps) {
  const onClick = (mainIndex: number, subIndex: number) => {
    const nextState = makeMove(gameState, mainIndex, subIndex)
    setGameState(nextState)
  }

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)'
    }}>
      {gameState.board.map((_, index) => (
        <div
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
            onClick={onClick}
            highlighted={gameState.requiredBoardIndex === null || gameState.requiredBoardIndex === index}
          />
        </div>
      ))}
    </div>
  )
}