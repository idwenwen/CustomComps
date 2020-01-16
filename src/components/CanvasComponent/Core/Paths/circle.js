/**
 * state: {
 *  point: {x, y}
 *  radius: Number,
 *  position: enum [LEFT_UP, LEFT_DOWN, RIGHT_UP, RIGHT_DOWN],
 *  sAngle: Number,
 *  eAngle: Number,
 *  wise: Boolean,
 *  style: Object,
 *  stroke: Boolean,
 *  fill: Boolean,
 *  justPath: Boolean
 * }
 */
import { uuidSupport } from '@u'
import { commonDrawing } from '../tools'
import COMMON from './common'

const arcComp = {
  drawArc(lay, name, obj) {
    if (typeof name === 'object') {
      obj = name
      name = uuidSupport('arc')
    }
    obj.path = path
    lay.drawLayer(name, obj)
    return name
  },
  LEFT_UP: COMMON.LEFT_UP,
  RIGHT_UP: COMMON.RIGHT_UP,
  LEFT_DOWN: COMMON.LEFT_DOWN,
  RIGHT_DOWM: COMMON.RIGHT_DOWM
}

function path() {
  const lay = this
  const x = lay.point.x || lay.point[0]
  const y = lay.point.y || lay.point[1]
  const r = lay.radius || COMMON._RADIUS
  if (lay.position === arcComp.LEFT_UP) {
    lay.point = { x: x + r, y: y + r }
  } else if (lay.position === arcComp.RIGHT_UP) {
    lay.point = { x, y: y + r }
  } else if (lay.position === arcComp.LEFT_DOWN) {
    lay.point = { x: x + r, y }
  }
  arc(lay)
}

export function arc(lay) {
  const basicPath = (ctx) => {
    const x = lay.point.x || lay.point[0]
    const y = lay.point.y || lay.point[1]
    const r = lay.radius || COMMON._RADIUS
    const sAngle = lay.sAngle || COMMON._SANGLE
    const eAngle = lay.eAngle || COMMON._EANGLE
    const wise = !!lay.wise
    ctx.arc(x, y, r, sAngle, eAngle, wise)
  }
  commonDrawing(lay, basicPath)
}

export default arcComp

