
export enum Player {
  X = "X",
  O = "O"
}

export const TIE = 'TIE' as const;

export type Cell = Player | null;

export type SubBoard = [Cell, Cell, Cell, Cell, Cell, Cell, Cell, Cell, Cell];

export type Board = [SubBoard, SubBoard, SubBoard, SubBoard, SubBoard, SubBoard, SubBoard, SubBoard, SubBoard];

export type GameState = {
  id: string;
  createdTimestamp: number;
  updatedTimestamp: number;
  board: Board;
  currentPlayer: Player;
  requiredBoardIndex: number | null;
};
