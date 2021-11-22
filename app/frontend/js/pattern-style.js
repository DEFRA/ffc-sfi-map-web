import { DEVICE_PIXEL_RATIO } from 'ol/has'

const canvas = document.createElement('canvas')
const context = canvas.getContext('2d')

const pixelRatio = DEVICE_PIXEL_RATIO

const linesPattern = (strokeStyle, lineIncline = -180, lineWidth = 5) => {
  const max = 30
  let i = 0
  let x = 0
  let z = lineIncline

  context.fillStyle = 'white'
  context.fillRect(0, 0, canvas.width, canvas.height)

  while (i < max) {
    context.beginPath()
    context.moveTo(x, -30)
    context.lineTo(z, canvas.height + 45)
    context.lineWidth = lineWidth
    context.strokeStyle = strokeStyle
    context.stroke()
    x += 15
    z += 15
    i++
  }
  return context.createPattern(canvas, 'repeat')
}

const orangeLinesPattern = (() => {
  return linesPattern('orange')
})()

const redLinesPattern = (() => {
  return linesPattern('red', 0, 12)
})()

const pattern = (() => {
  canvas.width = 8 * pixelRatio
  canvas.height = 8 * pixelRatio
  context.fillStyle = 'green'
  context.fillRect(0, 0, canvas.width, canvas.height)
  context.fillStyle = 'white'
  context.beginPath()
  context.arc(4 * pixelRatio, 4 * pixelRatio, 1.5 * pixelRatio, 0, 2 * Math.PI)
  context.fill()
  return context.createPattern(canvas, 'repeat')
})()

export { pattern, orangeLinesPattern, redLinesPattern }
