/**
 * state: {
 *  point: {x, y}
 *  width: Number,
 *  height: Number,
 *  img: Object,
 * }
 */
import { uuidSupport } from '@u'
import Layer from '../Basic'

const arcComp = {
  drawIcon(obj, parent, name) {
    obj.canvas = parent ? parent._$canvas : obj.canvas
    obj.path = path
    obj.translate = translate
    if (parent) {
      if (!name) {
        name = uuidSupport('icon')
      }
      parent.drawLayer(name, obj)
      return name
    } else {
      return new Layer(obj)
    }
  }
}

function translate() {
  const lay = this
  const controlPoint = lay._controlPoint
  const times = lay._times
  const x = lay.point.x || lay.point[0]
  const y = lay.point.y || lay.point[1]
  const cx = controlPoint.x || controlPoint[0]
  const cy = controlPoint.y || controlPoint[1]
  const bx = (x - cx) * times
  const by = (y - cy) * times
  lay.width = lay.width + times
  lay.height = (lay.height || lay.width) * times
  lay.point = { x: cx + bx, y: cy + by }
  lay._times = 1
  lay._controlPoint = { x: 0, y: 0 }
}

function path() {
  image.call(this)
}

export function image(lay) {
  const ctx = lay.$ctx
  ctx.beginPath()
  const x = lay.point.x || lay.point[0]
  const y = lay.point.y || lay.point[1]
  const w = lay.width
  const h = lay.height || w
  ctx.drawImage(lay.img, x - w / 2, y - h / 2, w, h)
  ctx.closePath()
}

export default arcComp

