import { TGame } from '#/models/game'

export type FieldProps = {
  game: TGame
  onChange: (game: TGame) => void
}
