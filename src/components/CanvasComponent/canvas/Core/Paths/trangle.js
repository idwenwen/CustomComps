/**
 * state: {
 *  point: [{x, y}|[]] | {x, y}
 *  height: Number
 *  position: enum
 *  style: {}
 *  stroke: Boolean,
 *  fill: Boolean,
 *  justPath: Boolean
 * }
 */

import { uuidSupport } from '@u'
import Layer from '../Basic'
import COMMON from './common'
import { commonDrawing } from '../tools'

const trangleComp = {
  drawTrangle(obj, parent, name) {
    obj.canvas = parent ? parent._$canvas : obj.canvas
    obj.path = path
    obj.translate = translate
    if (parent) {
      if (!name) {
        name = uuidSupport('trangle')
      }
      parent.drawLayer(name, obj)
      return name
    } else {
      return new Layer(obj)
    }
  },
  LEFT: COMMON.LEFT,
  RIGHT: COMMON.RIGHT,
  UP: COMMON.CENTER,
  BOTTOM: COMMON.BOTTOM
}

function translate() {
  const lay = this
  const controlPoint = lay._controlPoint
  const times = lay._times
  const cx = controlPoint.x || controlPoint[0] || 0
  const cy = controlPoint.y || controlPoint[1] || 0
  if (lay.height) {
    const x = lay.point.x || lay.point[0] || 0
    const y = lay.point.y || lay.point[1] || 0
    const bx = (x - cx) * times
    const by = (y - cy) * times
    lay.height = lay.height ? lay.height * times : 0
    lay.point = { x: cx + bx, y: cy + by }
  } else {
    const finalPoint = []
    for (const val of lay.point) {
      const x = val.x.toString() || val[0] || 0
      const y = val.y.toString() || val[1] || 0
      const bx = (x - cx) * times
      const by = (y - cy) * times
      finalPoint.push({ x: cx + bx, y: cy + by })
    }
    lay.point = finalPoint
  }
  lay._times = 1
  lay._controlPoint = { x: 0, y: 0 }
}

function path() {
  if (this.height) {
    equTrangle.call(this)
  } else {
    trangle.call(this)
  }
}

export function trangle() {
  const lay = this
  const basicPath = (ctx) => {
    let index = 0
    for (const val of lay.point) {
      const x = val.x || val[0] || 0
      const y = val.y || val[1] || 0
      if (index === 0) {
        ctx.moveTo(x, y)
      } else {
        ctx.lineTo(x, y)
      }
      index++
    }
    const ex = lay.point[0].x || lay.point[0][0] || 0
    const ey = lay.point[0].y || lay.point[0][1] || 0
    ctx.lineTo(ex, ey)
  }
  commonDrawing(lay, basicPath)
}

export function equTrangle() {
  const lay = this
  const basicPath = (ctx) => {
    const tan = Math.tan(30 * Math.PI / 180)
    const between = tan * lay.height
    const points = []
    const x = lay.point.x || lay.point[0] || 0
    const y = lay.point.y || lay.point[1] || 0
    points.push(lay.point)
    if (lay.position === trangleComp.LEFT) {
      points.push(...[
        { x: x + lay.height, y: y - between },
        { x: x + lay.height, y: y + between }
      ])
    } else if (lay.position === trangleComp.RIGHT) {
      points.push(...[
        { x: x - lay.height, y: y - between },
        { x: x - lay.height, y: y + between }
      ])
    } else if (lay.position === trangleComp.BOTTOM) {
      points.push(...[
        { x: x - between, y: y - lay.height },
        { x: x + between, y: y - lay.height }
      ])
    } else {
      points.push(...[
        { x: x - between, y: y + lay.height },
        { x: x + between, y: y + lay.height }
      ])
    }
    let index = 0
    for (const val of points) {
      const x = val.x || val[0] || 0
      const y = val.y || val[1] || 0
      if (index === 0) {
        ctx.moveTo(x, y)
      } else {
        ctx.lineTo(x, y)
      }
      index++
    }
    const ex = lay.point.x || lay.point[0] || 0
    const ey = lay.point.y || lay.point[1] || 0
    ctx.lineTo(ex, ey)
  }
  commonDrawing(lay, basicPath)
}

export default trangleComp
