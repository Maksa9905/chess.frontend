export type TFigurePosition = {
  xPos: number
  yPos: number
}

export type MoveHandler = (event: TFigurePosition & { id: string }) => void
