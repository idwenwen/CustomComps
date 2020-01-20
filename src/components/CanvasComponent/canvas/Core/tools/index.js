// Drawing Operation
export function stroke(ctx, style, drawing, justPath = false) {
  (!justPath && ctx.beginPath())
  drawing(ctx)
  if (!justPath) {
    ctx.save()
    for (const key in style) {
      ctx[key] = style[key]
    }
    ctx.stroke()
    ctx.restore()
    ctx.closePath()
  }
}

export function fill(ctx, style, drawing, justPath = false) {
  (!justPath && ctx.beginPath())
  drawing(ctx)
  if (!justPath) {
    ctx.save()
    for (const key in style) {
      ctx[key] = style[key]
    }
    ctx.fill()
    ctx.restore()
    ctx.closePath()
  }
}

export function commonDrawing(lay, drawing) {
  const ctx = lay.$ctx
  if (lay.stroke) {
    stroke(ctx, lay.style, drawing)
  }
  if (lay.fill) {
    fill(ctx, lay.style, drawing)
  }
  if (lay.justPath) {
    drawing(ctx)
  }
}

// Format Number
export function toFixed(num, pos = 6, way = toFixed.UP) {
  if (way === toFixed.CEIL) {
    return parseFloat(num.toFixed(pos))
  } else if (way === toFixed.FLOOR) {
    const extra = Math.pow(10, pos)
    return Math.floor(num * extra) / extra
  } else {
    const extra = Math.pow(10, pos)
    return Math.floor(num * extra) / extra
  }
}

toFixed.UP = 'up'
toFixed.FLOOR = 'floor'
toFixed.CEIL = 'ceil'

export function toRGBA(color, opacity) {
  let sColor = color.toLowerCase()
  const reg = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/
  if (sColor && reg.test(sColor)) {
    if (sColor.length === 4) {
      let sColorNew = '#'
      for (let i = 1; i < 4; i += 1) {
        sColorNew += sColor.slice(i, i + 1).concat(sColor.slice(i, i + 1))
      }
      sColor = sColorNew
    }
    const sColorChange = []
    for (let i = 1; i < 7; i += 2) {
      sColorChange.push(parseInt('0x' + sColor.slice(i, i + 2)))
    }
    return 'rgba(' + sColorChange.join(',') + (opacity ? ',' + opacity : '') + ')'
  }
  return sColor
}
