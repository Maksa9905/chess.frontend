import { createEvent } from 'effector'
import { TMovedFigureEvent } from './types'

export const movedFigure = createEvent<TMovedFigureEvent>()
