import { useCallback, useEffect, useRef, useState } from 'react'
import styles from './Field.module.css'
import {
  checkShahCondition,
  getNewGameState,
  TMovedFigureEvent,
  checkMateCondition,
  ETeam,
  TGame,
} from '#/models/game'
import { Figure } from '#/components/Figure'
import { Draggable } from '#/components/Draggable'
import { Cell } from '#/components/Cell'
import { FieldProps } from './Field.types'

const Field = ({ game, onChange }: FieldProps) => {
  const [container, setContainer] = useState<HTMLDivElement | null>(null)

  const { currentMove, field } = game

  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (ref.current) setContainer(ref.current)
  }, [])

  const handleMoveFigure = useCallback(
    (event: TMovedFigureEvent) => {
      const newField = getNewGameState(field, event, currentMove)

      const newCurrentMove =
        currentMove === ETeam.WHITE ? ETeam.BLACK : ETeam.WHITE
      const shah = checkShahCondition(newField)
      const mate = checkMateCondition(newField, newCurrentMove)

      onChange({
        field: newField,
        currentMove: newCurrentMove,
        shah,
        mate,
      } as TGame)
    },
    [field, currentMove],
  )

  const renderField = () => {
    return [...Array(8)].map((_, yIndex) =>
      [...Array(8)].map((_, xIndex) => {
        const figure = field.find(
          (fig) => fig.position.xPos === xIndex && fig.position.yPos === yIndex,
        )

        if (!figure || !container) return <Cell />

        return (
          <Cell>
            <Draggable
              container={container}
              key={figure.id}
              position={figure.position}
              onMoved={(position) =>
                handleMoveFigure({ ...position, id: figure.id })
              }
              size={100}
              isStatic={currentMove !== figure.team}
            >
              <Figure
                size={100}
                {...figure}
              />
            </Draggable>
          </Cell>
        )
      }),
    )
  }

  if (!game || !onChange) return <>Not provided value and onChange</>

  return (
    <div
      ref={ref}
      className={styles['field-container']}
    >
      {renderField()}
    </div>
  )
}

export default Field
