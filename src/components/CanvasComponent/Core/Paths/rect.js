/**
 * state: {
 *  point:{x, y},
 *  radius: Number,
 *  width: Number,
 *  height: Number,
 *  progress: Number (0 - 1)
 *  position: enum:[LEFT_UP, LEFT_DOWN, RIGHT_UP, RIGHT_DOWN, CENTER]
 *  style: {}
 *  stroke: boolaan
 *  fill: boolean
 *  justPath: boolean
 * }
 */

import { uuidSupport } from '@u'
import COMMON from './common'
import { commonDrawing } from '../tools'
import Layer from '../Basic'

const rectComp = {
  drawRect(obj, parent, name) {
    obj.path = path
    if (parent) {
      if (!name) {
        name = uuidSupport('rect')
      }
      parent.drawLayer(name, obj)
      return name
    } else {
      return new Layer(obj)
    }
  },
  LEFT_UP: COMMON.LEFT_UP,
  RIGHT_UP: COMMON.RIGHT_UP,
  LEFT_DOWN: COMMON.LEFT_DOWN,
  RIGHT_DOWM: COMMON.RIGHT_DOWM,
  CENTER: COMMON.CENTER,
  animation: {

  }
}

function path() {
  const lay = this
  const x = lay.point.x || lay.point[0]
  const y = lay.point.y || lay.point[1]
  const w = lay.width
  const h = lay.height
  if (lay.position === rectComp.LEFT_UP) {
    lay.point = { x: x + w / 2, y: y + h / 2 }
  } else if (lay.position === rectComp.RIGHT_UP) {
    lay.point = { x: x - w / 2, y: y + h / 2 }
  } else if (lay.position === rectComp.LEFT_DOWN) {
    lay.point = { x: x + w / 2, y: y - h / 2 }
  } else if (lay.position === rectComp.RIGHT_DOWM) {
    lay.point = { x: x - w / 2, y: y - h / 2 }
  }
  rect(lay)
}

export function rect(lay) {
  const basicPath = (ctx) => {
    const x = lay.point.x || lay.point[0]
    const y = lay.point.y || lay.point[1]
    const r = lay.radius || COMMON._RADIUS
    const w = lay.width
    const h = lay.height
    const p = lay.progress || 1

    if (p <= 0) {
      return
    }

    let nextX = x - w / 2
    let nextY = y - h / 2 + r
    ctx.moveTo(nextX, nextY)

    let arcX = nextX + r
    let arcY = nextY
    let sAng = 1 * Math.PI
    let eAng = (w * p < r) ? (sAng + Math.acos((r - w * p) / r)) : (1.5 * Math.PI)
    ctx.arc(arcX, arcY, r, sAng, eAng, false)

    if (w * p > r) {
      nextX = (w * p) > (w - r) ? nextX + w - 2 * r : nextX + w * p
      nextY = nextY - r
      ctx.lineTo(nextX, nextY)

      if (w * p > w - r) {
        arcX = nextX
        arcY = nextY + r
        sAng = 1.5 * Math.PI
        eAng = p < 1 ? sAng + Math.acos((r - (w - w * p)) / r) : 0
        ctx.arc(arcX, arcY, r, sAng, eAng, false)

        nextX = nextX + (r - (w - w * p))
        nextY = nextY + h - r - Math.cos(0.5 * Math.PI - Math.acos((r - (w - w * p)) / r)) * r
        ctx.lineTo(nextX, nextY)

        arcY = arcY + h - 2 * r
        sAng = 0
        eAng = p < 1 ? sAng + Math.acos((r - (w - w * p)) / r) : 0.5 * Math.PI
        ctx.arc(arcX, arcY, r, sAng, eAng, false)

        nextX = arcX - w + 3 * r
        nextY = arcY + r
        ctx.lineTo(nextX, nextY)
      } else {
        nextY = nextY + h
        ctx.lineTo(nextX, nextY)

        nextX = nextX - w * p + r
        ctx.lineTo(nextX, nextY)
      }
      arcX = nextX
      arcY = nextY - r
      ctx.arc(arcX, arcY, r, 0.5 * Math.PI, 1 * Math.PI, false)
    } else {
      nextX = nextX + w * p
      nextY = nextY + h - 2 * r + Math.sin(0.5 * Math.PI - Math.acos((r - w * p) / r)) * r
      ctx.lineTo(nextX, nextY)

      arcY = arcY + h - 2 * r
      sAng = 1 * Math.PI - Math.acos((r - w * p) / r)
      eAng = 1 * Math.PI
      ctx.arc(arcX, arcY, r, sAng, eAng, false)
    }

    nextX = x - w / 2
    nextY = y - h / 2 + r
    ctx.lineTo(nextX, nextY)
  }
  commonDrawing(lay, basicPath)
}

export default rectComp