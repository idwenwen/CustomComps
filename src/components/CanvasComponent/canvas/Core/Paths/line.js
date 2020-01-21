/**
 * state: {
 *  point: [{x, y}]
 *  style: {},
 *  curve: boolean,
 *  stroke: boolean
 * }
 */
import { uuidSupport } from '@u'
import { stroke } from '../tools'
import Layer from '../Basic'

const lineComp = {
  drawLine(obj, parent, name) {
    obj.canvas = parent ? parent._$canvas : obj.canvas
    obj.path = path
    if (parent) {
      if (!name) {
        name = uuidSupport('line')
      }
      parent.drawLayer(name, obj)
      return name
    } else {
      return new Layer(obj)
    }
  }
}

// path for line-drawing component
function path() {
  const lay = this
  if (lay.curve || lay.point.length <= 2) {
    brokeLine.call(this)
  } else {
    curve.call(this)
  }
}

export function brokeLine() {
  const lay = this
  const ctx = lay.$ctx
  stroke(ctx, lay.style, (ctx) => {
    for (let i = 0; i < lay.point.length; i++) {
      const x = lay.point[i].x || lay.point[i][0]
      const y = lay.point[i].y || lay.point[i][1]
      if (i === 0) {
        ctx.moveTo(x, y)
      } else {
        ctx.lineTo(x, y)
      }
    }
  })
}

export function curve() {
  const lay = this
  const ctx = lay.$ctx
  stroke(ctx, lay.style, (ctx) => {
    for (let i = 0; i < lay.point.length; i++) {
      const x = lay.point[i].x || lay.point[i][0]
      const y = lay.point[i].y || lay.point[i][1]
      if (i === 0) {
        ctx.moveTo(x, y)
      } else {
        if (lay.point[i + 1]) {
          let endX = 0
          let endY = 0
          if (lay.point[i + 2]) {
            endX = (x + (lay.point[i + 1].x || lay.point[i + 1][0])) / 2
            endY = (y + (lay.point[i + 1].y || lay.point[i + 1][1])) / 2
          } else {
            endX = lay.point[i + 1].x || lay.point[i + 1][0]
            endY = lay.point[i + 1].y || lay.point[i + 1][1]
          }
          ctx.quadraticCurveTo(x, y, endX, endY)
        } else {
          ctx.lineTo(x, y)
        }
      }
    }
  })
}

export function calculation(startP, endP, distance) {
  const finalPoints = []
  finalPoints.push(startP)
  const sx = startP.x || startP[0]
  const sy = startP.y || startP[1]
  const ex = endP.x || endP[0]
  const ey = endP.y || endP[1]
  finalPoints.push({ x: sx, y: ey > sy ? sy + 0.25 * distance : sy - 0.25 * distance })
  finalPoints.push({ x: ex, y: ey > sy ? ey - 0.25 * distance : ey + 0.25 * distance })
  finalPoints.push(endP)
}

export default lineComp
