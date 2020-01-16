/**
 * state: {
 *  point:{x, y},
 *  radius: Number,
 *  width: Number,
 *  height: Number,
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

const rectComp = {
  drawRect(lay, name, obj) {
    if (typeof name === 'object') {
      obj = name
      name = uuidSupport('rect')
    }
    obj.path = path
    lay.drawLayer(name, obj)
    return name
  },
  LEFT_UP: COMMON.LEFT_UP,
  RIGHT_UP: COMMON.RIGHT_UP,
  LEFT_DOWN: COMMON.LEFT_DOWN,
  RIGHT_DOWM: COMMON.RIGHT_DOWM,
  CENTER: COMMON.CENTER
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

    const startX = x - w / 2 + r
    const startY = y - h / 2
    ctx.moveTo(startX, startY)

    let nextX = startX + w - 2 * r
    let nextY = startY
    ctx.lineTo(nextX, nextY)

    let arcX = nextX
    let arcY = nextY + r
    ctx.arc(arcX, arcY, r, 1.5 * Math.PI, 0, false)

    nextX = nextX + r
    nextY = nextY + h - r
    ctx.lineTo(nextX, nextY)

    arcX = nextX - r
    arcY = nextY
    ctx.arc(arcX, arcY, r, 0, 0.5 * Math.PI, false)

    nextX = nextX - w + r
    nextY = nextY + r
    ctx.lineTo(nextX, nextY)

    arcX = nextX
    arcY = nextY - r
    ctx.arc(arcX, arcY, r, 0.5 * Math.PI, 1 * Math.PI, false)

    nextX = nextX - r
    nextY = nextY - h + r
    ctx.lineTo(nextX, nextY)

    arcX = nextX + r
    arcY = nextY
    ctx.arc(arcX, arcY, r, 1 * Math.PI, 1.5 * Math.PI, false)
  }
  commonDrawing(lay, basicPath)
}

export default rectComp
