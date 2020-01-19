/**
 * state: {
 *  point: {x, y}, // 绘制位置
 *  text: String, // 展示内容
 *  breakLine: Number, // 最大行数
 *  angle: Number, // 弧度制角度， 旋转角度（0-2PI）
 *  position: ENUM:[] // 通过对象传递的参数内容
 *  width: Number, // 可以不传递
 *  style: Object,
 * }
 */

import { uuidSupport } from '@u'
import COMMON from './common'
import { rotate } from '../tools/animationsPreSet'
import Layer from '../Basic'

const textComp = {
  drawText(obj, parent, name) {
    obj.path = path
    if (parent) {
      if (!name) {
        name = uuidSupport('text')
      }
      parent.drawLayer(name, obj)
      return name
    } else {
      return new Layer(obj)
    }
  },
  LEFT: COMMON.LEFT_UP,
  RIGHT: COMMON.RIGHT_UP,
  CENTER: COMMON.CENTER
}

function path() {
  const lay = this
  const ctx = lay.$ctx
  const textInfo = measureText(ctx, lay.text, lay.style)
  const finalWidth = (lay.width && textInfo.width > lay.width) ? lay.width : textInfo.width
  const sin = Math.sin(lay.angle)
  const cos = Math.cos(lay.angle)
  const x = lay.point.x || lay.point[0]
  const y = lay.point.y || lay.point[1]
  if (lay.postion === textComp.RIGHT) {
    lay.point = { x: x + cos * finalWidth, y: y - sin * finalWidth }
  } else if (lay.postion === textComp.CENTER) {
    lay.point = { x: x + cos * finalWidth / 2, y: y - sin * finalWidth / 2 }
  }
  text(this)
}

export function text(lay) {
  const ctx = lay.$ctx
  const textInfo = measureText(ctx, lay.text, lay.style)
  const lineWidth = lay.width || parseInt(textInfo.width)
  const lineHeight = parseInt(lay.style.font)
  const breakLine = lay.breakLine || 1
  const finalLine = (lay.width && Math.ceil(parseInt(textInfo.width) / lay.width) < breakLine)
    ? Math.ceil(parseInt(textInfo.width) / lay.width)
    : breakLine
  const overFlow = finalLine * lineWidth < parseInt(textInfo.width)
  const x = lay.point.x || lay.point[0]
  const y = lay.point.y || lay.point[1]
  const lines = []
  let pos = 0
  for (let i = 0; i < finalLine; i++) {
    let lengthCheck = Math.floor(lay.text.length * (lineWidth * breakLine) / parseInt(textInfo.width))
    while (parseFloat(measureText(ctx, lay.text.substr(pos, lengthCheck), lay.style).width) > lineWidth) {
      lengthCheck--
    }
    lines.push(lay.text.substr(pos, lengthCheck))
    pos += lengthCheck
  }
  if (overFlow) {
    const middle = lines[lines.length - 1].split('')
    middle.splice(-3, 3, '...')
    lines[lines.length - 1] = middle.join('')
  }
  ctx.save()
  for (const key in lay.style) {
    ctx[key] = lay.style[key]
  }
  if (lay.angle) rotate(ctx, lay.point, lay.angle)
  for (let i = 0; i < lines.length; i++) {
    ctx.fillText(lines[i], x, y + i * lineHeight + COMMON.BETWEEN_TEXT_LINE)
  }
  ctx.restore()
}

export function measureText(ctx, text, style) {
  let final = null
  ctx.save()
  for (const key in style) {
    ctx[key] = style[key]
  }
  final = ctx.measureText(text)
  ctx.restore()
  return final
}

export default textComp
