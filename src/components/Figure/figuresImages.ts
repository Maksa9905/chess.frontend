import WHITE_PAWN from '/assets/WHITE_PAWN.png'
import BLACK_PAWN from '/assets/BLACK_PAWN.png'
import WHITE_BISHOP from '/assets/WHITE_BISHOP.png'
import BLACK_BISHOP from '/assets/BLACK_BISHOP.png'
import WHITE_KNIGHT from '/assets/WHITE_KNIGHT.png'
import BLACK_KNIGHT from '/assets/BLACK_KNIGHT.png'
import WHITE_ROOK from '/assets/WHITE_ROOK.png'
import BLACK_ROOK from '/assets/BLACK_ROOK.png'
import WHITE_QUEEN from '/assets/WHITE_QUEEN.png'
import BLACK_QUEEN from '/assets/BLACK_QUEEN.png'
import WHITE_KING from '/assets/WHITE_KING.png'
import BLACK_KING from '/assets/BLACK_KING.png'
import { EFigure, ETeam } from '#/models/game'

export const figuresImages = {
  [ETeam.WHITE]: {
    [EFigure.PAWN]: WHITE_PAWN,
    [EFigure.BISHOP]: WHITE_BISHOP,
    [EFigure.KNIGHT]: WHITE_KNIGHT,
    [EFigure.ROOK]: WHITE_ROOK,
    [EFigure.QUEEN]: WHITE_QUEEN,
    [EFigure.KING]: WHITE_KING,
  },
  [ETeam.BLACK]: {
    [EFigure.PAWN]: BLACK_PAWN,
    [EFigure.BISHOP]: BLACK_BISHOP,
    [EFigure.KNIGHT]: BLACK_KNIGHT,
    [EFigure.ROOK]: BLACK_ROOK,
    [EFigure.QUEEN]: BLACK_QUEEN,
    [EFigure.KING]: BLACK_KING,
  },
}
