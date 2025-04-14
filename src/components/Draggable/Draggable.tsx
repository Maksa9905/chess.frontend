import React, {
  MouseEvent as ReactMouseEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { TDraggablePosition } from './types'
import { IndexPosition, PixelPosition } from './utils'
import { TPosition } from '#/models/game/types'

export type DraggableProps = {
  onMoved: (position: TDraggablePosition) => void
  position: TDraggablePosition
  size: number
  children?: React.ReactNode
  isStatic?: boolean
  className?: string
  container: HTMLDivElement
}

const Draggable = ({
  onMoved,
  position,
  size,
  children,
  isStatic,
  className,
  container,
}: DraggableProps) => {
  const indexPosition = new IndexPosition(position.xPos, position.yPos, size)

  const ref = useRef<HTMLDivElement>(null)
  const [grabbed, setGrabbed] = useState(false)
  const [mousePosition, setMousePosition] = useState<TDraggablePosition>(
    indexPosition.toPixelPosition(),
  )

  const [offsetPosition, setOffsetPosition] = useState<TPosition>({
    xPos: 0,
    yPos: 0,
  })

  const handleMouseMove = useCallback(
    (event: MouseEvent) => {
      const containerRect = container.getBoundingClientRect()

      if (grabbed) {
        setMousePosition({
          xPos: event.clientX - containerRect.x + offsetPosition.xPos,
          yPos: event.clientY - containerRect.y + offsetPosition.yPos,
        })
      }
    },
    [container, grabbed, offsetPosition.xPos, offsetPosition.yPos],
  )

  useEffect(() => {
    container.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [container, handleMouseMove])

  const handleMouseDown = useCallback(
    (event: ReactMouseEvent<HTMLDivElement, MouseEvent>) => {
      setGrabbed((prevGrabbed) => (prevGrabbed ? false : true))

      const containerRect = container.getBoundingClientRect()

      const pixelPosition = new IndexPosition(
        position.xPos,
        position.yPos,
        size,
      ).toPixelPosition()

      setMousePosition({
        xPos: pixelPosition.xPos,
        yPos: pixelPosition.yPos,
      })

      setOffsetPosition({
        xPos: pixelPosition.xPos - event.clientX + containerRect.x,
        yPos: pixelPosition.yPos - event.clientY + containerRect.y,
      })
    },
    [container, position.xPos, position.yPos, size],
  )

  const handleMouseUp = useCallback(
    (event: ReactMouseEvent<HTMLDivElement, MouseEvent>) => {
      setGrabbed(false)

      const containerRect = container.getBoundingClientRect()

      const newPixelPosition = new PixelPosition(
        event.clientX - containerRect.x,
        event.clientY - containerRect.y,
        size,
      )

      onMoved(newPixelPosition.toIndexPosition())

      const newMousePosition = new PixelPosition(
        mousePosition.xPos,
        mousePosition.yPos,
        size,
      )
      setMousePosition(newMousePosition.toIndexPosition().toPixelPosition())
    },
    [container, mousePosition.xPos, mousePosition.yPos, onMoved, size],
  )

  const grabbedStyles: React.CSSProperties = useMemo(
    () => ({
      position: 'absolute' as const,
      top: `${mousePosition?.yPos}px`,
      left: `${mousePosition?.xPos}px`,
      width: `${size}px`,
      height: `${size}px`,
      cursor: 'grabbing',
    }),
    [mousePosition?.xPos, mousePosition?.yPos, size],
  )

  const defaultStyles: React.CSSProperties = useMemo(
    () => ({
      gridColumn: position.xPos + 1,
      gridRow: position.yPos + 1,
      width: `${size}px`,
      height: `${size}px`,
      cursor: isStatic ? 'default' : 'grab',
    }),
    [isStatic, position.xPos, position.yPos, size],
  )

  return (
    <div
      ref={ref}
      className={className}
      onMouseDown={isStatic ? undefined : handleMouseDown}
      onMouseUp={isStatic ? undefined : handleMouseUp}
      style={grabbed && !isStatic ? grabbedStyles : defaultStyles}
    >
      {children}
    </div>
  )
}

export default Draggable
