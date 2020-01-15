// state: { pos: [{x, y}, {x, y} ...], style:{}, arc:true/false }
const line = {
  drawLine(lay, name, obj) {
    if (typeof name === 'object') {
      obj = name
      name = 'line'
    }
    lay.drawLayer(name, obj)
  },
  path() {
    const lay = this
    if (lay.arc || lay.pos.length <= 2) {
      brokeLine.call(lay)
    } else {
      curve.call(lay)
    }
  }
}

export function brokeLine() {
  const lay = this
  const ctx = lay.$ctx
  ctx.beginPath()
  for (let i = 0; i < lay.pos.length; i++) {
    const x = lay.pos[i].x || lay.pos[i][0]
    const y = lay.pos[i].y || lay.pos[i][1]
    if (i === 0) {
      ctx.moveTo(x, y)
    } else {
      ctx.lineTo(x, y)
    }
  }
  ctx.save()
  for (const key in lay.style) {
    ctx[key] = lay.style
  }
  ctx.stroke()
  ctx.restore()
  ctx.closePath()
}

export function curve() {
  const lay = this
  const ctx = lay.$ctx
  ctx.beginPath()
  for (let i = 0; i < lay.pos.length; i++) {
    const x = lay.pos[i].x || lay.pos[i][0]
    const y = lay.pos[i].y || lay.pos[i][1]
    if (i === 0) {
      ctx.moveTo(x, y)
    } else {
      if (lay.pos[i + 1]) {
        let endX = 0
        let endY = 0
        if (lay.pos[i + 2]) {
          endX = (x + (lay.pos[i + 1].x || lay.pos[i + 1][0])) / 2
          endY = (y + (lay.pos[i + 1].y || lay.pos[i + 1][1])) / 2
        } else {
          endX = lay.pos[i + 1].x || lay.pos[i + 1][0]
          endY = lay.pos[i + 1].y || lay.pos[i + 1][1]
        }
        ctx.quadraticCurveTo(x, y, endX, endY)
      } else {
        ctx.lineTo(x, y)
      }
    }
  }
  ctx.save()
  for (const key in lay.style) {
    ctx[key] = lay.style
  }
  ctx.stroke()
  ctx.restore()
  ctx.closePath()
}

export default line
