import {
  EFigure,
  ETeam,
  TFigure,
  TGameField,
  TMovedFigureEvent,
  TPosition,
} from './types'

export const findFigure = (position: TPosition, gameState: TGameField) => {
  return gameState.find(
    (fig) =>
      fig.position.xPos === position.xPos &&
      fig.position.yPos === position.yPos,
  )
}

export const getPawnAvailableCells = (
  figure: TFigure,
  gameState: TGameField,
) => {
  const availableCells: TPosition[] = []

  if (figure.team === ETeam.BLACK) {
    // Проверка обычного хода на 1 клетку вперед
    const forwardOne = {
      xPos: figure.position.xPos,
      yPos: figure.position.yPos + 1,
    }
    if (!findFigure(forwardOne, gameState)) {
      availableCells.push(forwardOne)

      // Проверка хода на 2 клетки вперед (только если первая клетка свободна)
      if (!figure.isDirty) {
        const forwardTwo = {
          xPos: figure.position.xPos,
          yPos: figure.position.yPos + 2,
        }
        if (!findFigure(forwardTwo, gameState)) {
          availableCells.push(forwardTwo)
        }
      }
    }

    // Проверка взятия по диагонали
    const checkCapture = (xOffset: number) => {
      const targetPos = {
        xPos: figure.position.xPos + xOffset,
        yPos: figure.position.yPos + 1,
      }
      const targetFigure = findFigure(targetPos, gameState)
      if (targetFigure && targetFigure.team === ETeam.WHITE) {
        availableCells.push(targetPos)
      }
    }

    checkCapture(-1) // Влево
    checkCapture(1) // Вправо
  } else {
    // Аналогичная логика для белых фигур
    const forwardOne = {
      xPos: figure.position.xPos,
      yPos: figure.position.yPos - 1,
    }
    if (!findFigure(forwardOne, gameState)) {
      availableCells.push(forwardOne)

      if (!figure.isDirty) {
        const forwardTwo = {
          xPos: figure.position.xPos,
          yPos: figure.position.yPos - 2,
        }
        if (!findFigure(forwardTwo, gameState)) {
          availableCells.push(forwardTwo)
        }
      }
    }

    const checkCapture = (xOffset: number) => {
      const targetPos = {
        xPos: figure.position.xPos + xOffset,
        yPos: figure.position.yPos - 1,
      }
      const targetFigure = findFigure(targetPos, gameState)
      if (targetFigure && targetFigure.team === ETeam.BLACK) {
        availableCells.push(targetPos)
      }
    }

    checkCapture(-1)
    checkCapture(1)
  }

  return availableCells
}

const getKnightAvailableCells = (figure: TFigure, gameState: TGameField) => {
  const possiblePositions = [
    { xPos: figure.position.xPos + 2, yPos: figure.position.yPos + 1 },
    { xPos: figure.position.xPos - 2, yPos: figure.position.yPos + 1 },
    { xPos: figure.position.xPos + 2, yPos: figure.position.yPos - 1 },
    { xPos: figure.position.xPos - 2, yPos: figure.position.yPos - 1 },
    { xPos: figure.position.xPos + 1, yPos: figure.position.yPos + 2 },
    { xPos: figure.position.xPos - 1, yPos: figure.position.yPos + 2 },
    { xPos: figure.position.xPos + 1, yPos: figure.position.yPos - 2 },
    { xPos: figure.position.xPos - 1, yPos: figure.position.yPos - 2 },
  ]

  return possiblePositions.filter((pos) => {
    const deletingFigure = findFigure(
      { xPos: pos.xPos, yPos: pos.yPos },
      gameState,
    )

    return !deletingFigure || deletingFigure.team !== figure.team
  })
}

const getRookAvailableCells = (figure: TFigure, gameState: TGameField) => {
  const xPos = figure.position.xPos
  const yPos = figure.position.yPos

  const possibleXLinePositions: TPosition[] = [...Array(8)].map((_, xPos) => ({
    xPos,
    yPos,
  }))

  const possibleYLinePositions: TPosition[] = [...Array(8)].map((_, yPos) => ({
    xPos,
    yPos,
  }))

  const xLineFigures = gameState
    .filter((fig) => fig.position.yPos === figure.position.yPos)
    .sort((fig1, fig2) => fig1.position.xPos - fig2.position.xPos)

  const yLineFigures = gameState
    .filter((fig) => fig.position.xPos === figure.position.xPos)
    .sort((fig1, fig2) => fig1.position.yPos - fig2.position.yPos)

  const xLineFigureIndex = xLineFigures.findIndex((fig) => fig.id === figure.id)

  const yLineFigureIndex = yLineFigures.findIndex((fig) => fig.id === figure.id)

  const minXPos = xLineFigures[xLineFigureIndex - 1]
    ? xLineFigures[xLineFigureIndex - 1].position.xPos
    : 0

  const maxXPos = xLineFigures[xLineFigureIndex + 1]
    ? xLineFigures[xLineFigureIndex + 1].position.xPos
    : 7

  const minYPos = yLineFigures[yLineFigureIndex - 1]
    ? yLineFigures[yLineFigureIndex - 1].position.yPos
    : 0

  const maxYPos = yLineFigures[yLineFigureIndex + 1]
    ? yLineFigures[yLineFigureIndex + 1].position.yPos
    : 7

  const possiblePositions = [
    ...possibleXLinePositions.filter(
      (position) => position.xPos >= minXPos && position.xPos <= maxXPos,
    ),
    ...possibleYLinePositions.filter(
      (position) => position.yPos >= minYPos && position.yPos <= maxYPos,
    ),
  ]

  return possiblePositions.filter((position) => {
    const deletingFigure = findFigure(
      {
        xPos: position.xPos,
        yPos: position.yPos,
      },
      gameState,
    )

    return !deletingFigure || deletingFigure.team !== figure.team
  })
}

export const getKingAvailableCells = (
  figure: TFigure,
  gameState: TGameField,
) => {
  const possiblePositions: TPosition[] = [
    { xPos: figure.position.xPos, yPos: figure.position.yPos + 1 },
    { xPos: figure.position.xPos, yPos: figure.position.yPos - 1 },
    { xPos: figure.position.xPos + 1, yPos: figure.position.yPos },
    { xPos: figure.position.xPos + 1, yPos: figure.position.yPos + 1 },
    { xPos: figure.position.xPos + 1, yPos: figure.position.yPos - 1 },
    { xPos: figure.position.xPos - 1, yPos: figure.position.yPos },
    { xPos: figure.position.xPos - 1, yPos: figure.position.yPos + 1 },
    { xPos: figure.position.xPos - 1, yPos: figure.position.yPos - 1 },
  ]

  return possiblePositions.filter((position) => {
    const deletingFigure = findFigure(
      {
        xPos: position.xPos,
        yPos: position.yPos,
      },
      gameState,
    )

    return !deletingFigure || deletingFigure.team !== figure.team
  })
}

export const getBishopAvailableCells = (
  figure: TFigure,
  gameState: TGameField,
) => {
  let diagonalOffset = figure.position.xPos - figure.position.yPos

  let tempXPos = 0
  let tempYPos = tempXPos - diagonalOffset

  const firstDiagonalPositions: TPosition[] = []
  const secondDiagonalPositions: TPosition[] = []

  while (tempXPos < 8 && tempYPos < 8) {
    if (tempXPos >= 0 && tempYPos >= 0 && tempXPos < 8 && tempYPos < 8)
      firstDiagonalPositions.push({ xPos: tempXPos, yPos: tempYPos })

    tempXPos += 1
    tempYPos += 1
  }

  diagonalOffset = figure.position.yPos - (7 - figure.position.xPos)
  tempYPos = 0
  tempXPos = 7 + tempYPos + diagonalOffset

  while (tempXPos >= 0 && tempYPos < 8) {
    if (tempXPos >= 0 && tempYPos >= 0 && tempXPos < 8 && tempYPos < 8)
      secondDiagonalPositions.push({ xPos: tempXPos, yPos: tempYPos })

    tempXPos -= 1
    tempYPos += 1
  }

  const firstDiagonalFigures = gameState
    .filter((fig) =>
      firstDiagonalPositions.find(
        (position) =>
          position.xPos === fig.position.xPos &&
          position.yPos === fig.position.yPos,
      ),
    )
    .sort((fig1, fig2) => fig1.position.xPos - fig2.position.xPos)

  const secondDiagonalFigures = gameState
    .filter((fig) =>
      secondDiagonalPositions.find(
        (position) =>
          position.xPos === fig.position.xPos &&
          position.yPos === fig.position.yPos,
      ),
    )
    .sort((fig1, fig2) => fig1.position.xPos - fig2.position.xPos)

  const firstDiagonalInd = firstDiagonalFigures.findIndex(
    (fig) => fig.id === figure.id,
  )

  const secondDiagonalInd = secondDiagonalFigures.findIndex(
    (fig) => fig.id === figure.id,
  )

  const firstDiagonalMinXPos = firstDiagonalFigures[firstDiagonalInd - 1]
    ? firstDiagonalFigures[firstDiagonalInd - 1].position.xPos
    : Math.min(...firstDiagonalPositions.map((pos) => pos.xPos))

  const firstDiagonalMaxXPos = firstDiagonalFigures[firstDiagonalInd + 1]
    ? firstDiagonalFigures[firstDiagonalInd + 1].position.xPos
    : Math.max(...firstDiagonalPositions.map((pos) => pos.xPos))

  const secondDiagonalMinXPos = secondDiagonalFigures[secondDiagonalInd - 1]
    ? secondDiagonalFigures[secondDiagonalInd - 1].position.xPos
    : Math.min(...secondDiagonalPositions.map((pos) => pos.xPos))

  const secondDiagonalMaxXPos = secondDiagonalFigures[secondDiagonalInd + 1]
    ? secondDiagonalFigures[secondDiagonalInd + 1].position.xPos
    : Math.max(...secondDiagonalPositions.map((pos) => pos.xPos))

  const availableCells = [
    ...firstDiagonalPositions.filter(
      (position) =>
        position.xPos >= firstDiagonalMinXPos &&
        position.xPos <= firstDiagonalMaxXPos,
    ),
    ...secondDiagonalPositions.filter(
      (position) =>
        position.xPos >= secondDiagonalMinXPos &&
        position.xPos <= secondDiagonalMaxXPos,
    ),
  ]

  return availableCells.filter((pos) => {
    const deletingFigure = findFigure(
      {
        xPos: pos.xPos,
        yPos: pos.yPos,
      },
      gameState,
    )

    return !deletingFigure || deletingFigure.team !== figure.team
  })
}

const getAvailableCells = (figure: TFigure, gameState: TGameField) => {
  switch (figure.figure) {
    case EFigure.PAWN:
      return getPawnAvailableCells(figure, gameState)
    case EFigure.KNIGHT:
      return getKnightAvailableCells(figure, gameState)
    case EFigure.ROOK:
      return getRookAvailableCells(figure, gameState)
    case EFigure.BISHOP:
      return getBishopAvailableCells(figure, gameState)
    case EFigure.KING:
      return getKingAvailableCells(figure, gameState)
    case EFigure.QUEEN:
      return [
        ...getBishopAvailableCells(figure, gameState),
        ...getRookAvailableCells(figure, gameState),
      ]
    default:
      return []
  }
}

export const checkMovingEvent = (
  event: TMovedFigureEvent,
  gameState: TGameField,
) => {
  const figure = gameState.find((fig) => fig.id === event.id)

  if (event.xPos > 7 || event.xPos < 0 || event.yPos > 7 || event.yPos < 0)
    return false

  if (!figure) return false

  const availableCells = getAvailableCells(figure, gameState)

  return availableCells?.find(
    (pos) => pos.xPos === event.xPos && pos.yPos === event.yPos,
  )
}

export const canEat = (
  figure1: TFigure,
  figure2: TFigure,
  gameState: TGameField,
) => {
  return Boolean(
    getAvailableCells(figure1, gameState)?.find(
      (cell) =>
        cell.xPos === figure2?.position.xPos &&
        cell.yPos === figure2.position.yPos,
    ),
  )
}

export const checkShahCondition = (gameState: TGameField) => {
  const whiteKing = gameState.find(
    (fig) => fig.figure === EFigure.KING && fig.team === ETeam.WHITE,
  )
  const blackKing = gameState.find(
    (fig) => fig.figure === EFigure.KING && fig.team === ETeam.BLACK,
  )

  if (!whiteKing || !blackKing) return null

  if (gameState.find((figure) => canEat(figure, whiteKing, gameState))) {
    return ETeam.WHITE
  }

  if (gameState.find((figure) => canEat(figure, blackKing, gameState))) {
    return ETeam.BLACK
  }

  return null
}

export const getNewGameState = (
  gameState: TGameField,
  payload: TMovedFigureEvent,
  currentMove: ETeam,
) => {
  const figure = gameState.find((fig) => fig.id === payload.id)
  const figureIndex = gameState.findIndex((fig) => fig.id === payload.id)

  if (!checkMovingEvent(payload, gameState)) return gameState

  if (!figure) return gameState

  const deletingFigure = gameState.find(
    (fig) =>
      fig.position.xPos === payload.xPos && fig.position.yPos === payload.yPos,
  )

  const newGameState = [
    ...gameState.slice(0, figureIndex),
    {
      ...figure,
      isDirty: true,
      position: payload,
    },
    ...gameState.slice(figureIndex + 1),
  ].filter((el) => el.id !== deletingFigure?.id)

  const shah = checkShahCondition(newGameState)
  const mate = checkMateCondition(newGameState, currentMove)

  if (shah && shah === currentMove) return gameState
  if (shah && shah === currentMove && mate) return gameState

  return newGameState
}

export const checkMateCondition = (
  gameState: TGameField,
  currentMove: ETeam,
): boolean => {
  const opponentTeam = currentMove === ETeam.WHITE ? ETeam.BLACK : ETeam.WHITE
  const shah = checkShahCondition(gameState)

  if (shah !== opponentTeam) return false

  const opponentFigures = gameState.filter((fig) => fig.team === opponentTeam)

  for (const figure of opponentFigures) {
    const possibleMoves = getAvailableCells(figure, gameState)

    for (const move of possibleMoves) {
      const simulatedGameState = getNewGameState(
        gameState,
        {
          id: figure.id,
          xPos: move.xPos,
          yPos: move.yPos,
        },
        opponentTeam,
      )

      // Если после хода шах исчезает — значит мата нет
      if (checkShahCondition(simulatedGameState) !== opponentTeam) {
        return false
      }
    }
  }

  // Все возможные ходы сохраняют шах — это мат
  return true
}
