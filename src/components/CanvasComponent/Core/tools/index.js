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
