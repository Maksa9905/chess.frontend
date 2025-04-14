import { useEffect, useRef, useState } from 'react'
import styles from './Field.module.css'
import { useUnit } from 'effector-react'
import { $game, $currentMove, movedFigure } from '#/models/game'
import { Figure } from '#/components/Figure'
import { Draggable } from '#/components/Draggable'
import { Cell } from '../Cell'

const Field = () => {
  const [container, setContainer] = useState<HTMLDivElement | null>(null)

  const ref = useRef<HTMLDivElement>(null)
  const game = useUnit($game)
  const currentMove = useUnit($currentMove)

  useEffect(() => {
    if (ref.current) setContainer(ref.current)
  }, [])

  const renderField = () => {
    return [...Array(64)].map((_, index) => {
      const xPos = index % 8
      const yPos = Math.floor(index / 8)

      const figure = game.find(
        (fig) => fig.position.xPos === xPos && fig.position.yPos === yPos,
      )

      if (figure && container)
        return (
          <Cell>
            <Draggable
              container={container}
              key={figure.id}
              position={figure.position}
              onMoved={(position) =>
                movedFigure({ ...position, id: figure.id })
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
      else return <Cell />
    })
  }

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
