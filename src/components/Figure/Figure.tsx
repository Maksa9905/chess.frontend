import { EFigure, ETeam } from '#/models/game'

export type FigureProps = {
  figure: EFigure
  team: ETeam
  size: number
}

const Figure = ({ figure, team, size }: FigureProps) => {
  return (
    <figure
      style={{
        background: `url("/assets/${team}_${figure}.png")`,
        width: size,
        height: size,
      }}
    ></figure>
  )
}

export default Figure
