/**
 * state: {
 *  point: {x, y}, // 绘制位置
 *  text: String, // 展示内容
 *  breakLine: Number, // 最大行数
 *  angle: Number, // 弧度制角度， 旋转角度（0-2PI）
 *  position: ENUM:[] // 通过对象传递的参数内容
 *  width: Number, // 可以不传递
 *  height: Number, // 最大高度
 *  style: Object,
 * }
 */

import { uuidSupport } from '@u'
import COMMON from './common'
import { rotate } from '../tools/translate'
import Layer from '../Basic'

const textComp = {
  drawText(obj, parent, name) {
    obj.canvas = parent ? parent._$canvas : obj.canvas
    obj.path = path
    obj.translate = translate
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
  LEFT: COMMON.LEFT,
  RIGHT: COMMON.RIGHT,
  CENTER: COMMON.CENTER
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
  lay.width = lay.width ? lay.width * times : 0
  lay.height = lay.height ? lay.height * times : 0
  lay.point = { x: cx + bx, y: cy + by }
  lay.style.font && (lay.style.font.replace(parseInt(lay.style.font) + '', parseInt(lay.style.font) * times + ''))
  lay._times = 1
  lay._controlPoint = { x: 0, y: 0 }
}

function path() {
  debugger
  const lay = this
  const style = JSON.parse(JSON.stringify(lay.style))
  style.textBaseline = COMMON.TEXTBASELINE
  style.textAlign = 'left'
  if (lay.position === textComp.RIGHT) {
    style.textAlign = 'right'
  } else if (lay.position === textComp.CENTER) {
    style.textAlign = 'center'
  }
  lay.style = style
  text.call(this)
}

export function text() {
  const lay = this
  const ctx = lay.$ctx
  const textInfo = measureText(ctx, lay.text, lay.style)
  const lineWidth = lay.width || parseInt(textInfo.width)
  const lineHeight = parseInt(lay.style.font)
  const breakLine = lay.breakLine
    ? (lay.height
      ? (Math.floor(lay.height / (lineHeight + COMMON.BETWEEN_TEXT_LINE)) > lay.breakLine
        ? lay.breakLine
        : Math.floor(lay.height / (lineHeight + COMMON.BETWEEN_TEXT_LINE)))
      : lay.breakLine)
    : 1
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
