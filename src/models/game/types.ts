export type TGameField = TFigure[]

export type TFigure = {
  id: string
  team: ETeam
  figure: EFigure
  isDirty: boolean
  position: {
    xPos: number
    yPos: number
  }
}

export enum ETeam {
  WHITE = 'WHITE',
  BLACK = 'BLACK',
}

export enum EFigure {
  PAWN = 'PAWN',
  BISHOP = 'BISHOP',
  KNIGHT = 'KNIGHT',
  ROOK = 'ROOK',
  QUEEN = 'QUEEN',
  KING = 'KING',
}

export type TPosition = {
  xPos: number
  yPos: number
}

export type TMovedFigureEvent = {
  id: string
  xPos: number
  yPos: number
}

export type TCheckMovingEventParams = {
  event: TMovedFigureEvent
  figure: TFigure
  gameState: TGameField
  deletingFigure?: TFigure
}
