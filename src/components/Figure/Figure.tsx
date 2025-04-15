import { EFigure, ETeam } from '#/models/game'
import { figuresImages } from './figuresImages'

export type FigureProps = {
  figure: EFigure
  team: ETeam
  size: number
}

const Figure = ({ figure, team, size }: FigureProps) => {
  return (
    <figure
      style={{
        background: `url(${figuresImages[team][figure]})`,
        width: size,
        height: size,
      }}
    ></figure>
  )
}

export default Figure
