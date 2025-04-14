import { createStore, sample } from 'effector'
import { ETeam, TGameField } from './types'
import { movedFigure } from './game.events'
import {
  checkMateCondition,
  checkShahCondition,
  getNewGameState,
} from './utils'
import { defaultValues } from './defaultValues'

export const $game = createStore<TGameField>(defaultValues)

export const $currentMove = createStore<ETeam>(ETeam.WHITE)

export const $shah = createStore<ETeam | null>(null)
export const $mate = createStore<boolean>(false)

$game.on(movedFigure, (state, payload) => {
  const currentMove = $currentMove.getState()

  return getNewGameState(state, payload, currentMove)
})

sample({
  clock: $game,
  source: $currentMove,
  fn: (state) => (state === ETeam.BLACK ? ETeam.WHITE : ETeam.BLACK),
  target: $currentMove,
})

sample({
  clock: $game,
  fn: checkShahCondition,
  target: $shah,
})

sample({
  clock: $game,
  source: $currentMove,
  fn: (currentMove, gameState) => checkMateCondition(gameState, currentMove),
  target: $mate,
})
