export function rotate(ctx, center, angle) {
  const x = center.x || center[0]
  const y = center.y || center[1]
  ctx.translate(x, y)
  ctx.rotate(angle)
  ctx.translate(-x, -y)
}
