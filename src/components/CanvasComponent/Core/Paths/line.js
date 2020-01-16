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

const lineComp = {
  drawLine(lay, name, obj) {
    if (typeof name === 'object') {
      obj = name
      name = uuidSupport('line')
    }
    obj.path = path
    lay.drawLayer(name, obj)
    return name
  }
}

// path for line-drawing component
function path() {
  const lay = this
  if (lay.curve || lay.point.length <= 2) {
    brokeLine(lay)
  } else {
    curve(lay)
  }
}

export function brokeLine(lay) {
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

export function curve(lay) {
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

export default lineComp
