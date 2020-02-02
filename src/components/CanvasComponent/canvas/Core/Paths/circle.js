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
import Layer from '../Basic'

const arcComp = {
  drawArc(obj, parent, name) {
    obj.canvas = parent ? parent._$canvas : obj.canvas
    obj.path = path
    obj.translate = translate
    if (parent) {
      if (!name) {
        name = uuidSupport('arc')
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
  RIGHT_DOWM: COMMON.RIGHT_DOWM
}

function translate() {
  const lay = this
  const controlPoint = lay._controlPoint
  const times = lay._times
  const x = lay.point.x || lay.point[0] || 0
  const y = lay.point.y || lay.point[1] || 0
  const cx = controlPoint.x || controlPoint[0] || 0
  const cy = controlPoint.y || controlPoint[1] || 0
  const r = lay.radius || COMMON._RADIUS
  lay.radius = r + times
  const bx = (x - cx) * times
  const by = (y - cy) * times
  lay.point = { x: cx + bx, y: cy + by }
  lay._times = 1
  lay._controlPoint = { x: 0, y: 0 }
}

function path() {
  const lay = this
  const x = lay.point.x || lay.point[0] || 0
  const y = lay.point.y || lay.point[1] || 0
  const r = lay.radius
  if (lay.position === arcComp.LEFT_UP) {
    lay.point = { x: x + r, y: y + r }
  } else if (lay.position === arcComp.RIGHT_UP) {
    lay.point = { x, y: y + r }
  } else if (lay.position === arcComp.LEFT_DOWN) {
    lay.point = { x: x + r, y }
  }
  arc.call(lay)
}

export function arc(lay) {
  const basicPath = (ctx) => {
    const x = lay.point.x || lay.point[0] || 0
    const y = lay.point.y || lay.point[1] || 0
    const r = lay.radius
    const sAngle = lay.sAngle || COMMON._SANGLE
    const eAngle = lay.eAngle || COMMON._EANGLE
    const wise = !!lay.wise
    ctx.arc(x, y, r, sAngle, eAngle, wise)
  }
  commonDrawing(lay, basicPath)
}

export default arcComp

