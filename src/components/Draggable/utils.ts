export class Coordinates {
  size: number
  xPos: number
  yPos: number

  constructor(xPos: number, yPos: number, size: number) {
    this.xPos = xPos
    this.yPos = yPos
    this.size = size
  }

  convertIndexToPixels = (index: number) => index * this.size
  convertPixelsToIndex = (pixels: number) => Math.ceil(pixels / this.size) - 1
}

export class PixelPosition extends Coordinates {
  constructor(xPos: number, yPos: number, size: number) {
    super(xPos, yPos, size)
  }

  toIndexPosition = () => {
    return new IndexPosition(
      this.convertPixelsToIndex(this.xPos),
      this.convertPixelsToIndex(this.yPos),
      this.size,
    )
  }
}

export class IndexPosition extends Coordinates {
  constructor(xPos: number, yPos: number, size: number) {
    super(xPos, yPos, size)
  }

  toPixelPosition = () => {
    return new PixelPosition(
      this.convertIndexToPixels(this.xPos),
      this.convertIndexToPixels(this.yPos),
      this.size,
    )
  }
}
