/**
 * state: {
 *  point: {x, y}
 *  width: Number,
 *  height: Number,
 *  img: Object,
 * }
 */
import Layer from '../Basic'

const iconComp = {
  drawIcon(obj, parent, name) {
    obj.canvas = parent ? parent.$canvas : obj.canvas
    obj.path = path
    if (parent) {
      if (!name) {
        name = Layer.getUUID('icon')
      }
      parent.drawLayer(name, obj)
      return name
    } else {
      return new Layer(obj)
    }
  }
}

function path() {
  image(this)
}

export function image(lay) {
  const ctx = lay.$ctx
  ctx.beginPath()
  const x = lay.point.x || lay.point[0] || 0
  const y = lay.point.y || lay.point[1] || 0
  const w = lay.width
  const h = lay.height || w
  ctx.drawImage(lay.img, x - w / 2, y - h / 2, w, h)
  ctx.closePath()
}

export default iconComp

