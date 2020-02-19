/**
 * point: {x, y},
 * width: number,
 * content: String,
 * featureX: String,
 * featureY: String
 * color: String,
 * fontSize: Number
 */

import Layer from '../Core'
import { measureText } from '../Core/Paths/text'

const CONTENT_PADDING = 4
const CHOOSE_STYLE = '#000'

const FONT_FAMILY = 'Lato'
const FONT_COLOR = '#000'

const TOOLTIP_BACKGROUND = 'rgba(255,165,0,0.8)'
const TOOLTIP_TEXT_COLOR = '#000'
const TOOLTIP_PADDING = 6
const TOOLTIP_TEXT_FONT = 12
const TOOLTIP_RADIUS = 4
const DISTANCE = 10
const TOOLTIP_TRANGLE_SIZE = 5

const squareComp = {
  drawSquare(obj, parent, name) {
    obj.canvas = parent ? parent.$canvas : obj.canvas
    obj.struct = struct
    if (parent) {
      if (!name) {
        name = Layer.getUUID('text')
      }
      parent.drawLayer(name, obj)
      return name
    } else {
      return new Layer(obj)
    }
  },
  getSuitableFont,
  events: {
    showTips(point) {
      const lay = this
      if (lay.$here(point)) {
        lay.setCus('showTips', () => {
          const trans = lay.$meta.get('$translate') || { x: 0, y: 0 }
          lay.$children.get('inner').emit('$showing')
          lay.containerStyle = CHOOSE_STYLE
          const tooltip = lay.$children.get('tooltip')
          lay.tooltipPoint = { x: point.x + DISTANCE - trans.x, y: point.y - trans.y }
          tooltip.emit('$showing')
        })
      } else {
        if (lay.$children.get('tooltip').$visiable) {
          lay.setCus('hideTips', () => {
            lay.$children.get('inner').emit('$hide')
            lay.containerStyle = lay.color
            const tooltip = lay.$children.get('tooltip')
            tooltip.emit('$hide')
          })
        }
      }
    },
    scale(time, point = { x: 0, y: 0 }) {
      const lay = this
      lay.setCus('scale', () => {
        lay.point = Layer.scaleDistanceForPoint(lay.point, point, time)
        lay.width = Layer.toFixed(lay.width * time)
        lay.padding = Layer.toFixed(lay.padding * time)
        lay.toolFont = Layer.toFixed(lay.toolFont * time)
        if (lay.toolFont < TOOLTIP_TEXT_FONT) {
          lay.toolFont = TOOLTIP_TEXT_FONT
        }
        lay.tooltipPadding = Layer.toFixed(lay.tooltipPadding * time)
        if (lay.tooltipPadding < TOOLTIP_PADDING) {
          lay.tooltipPadding = TOOLTIP_PADDING
        }
        lay.tooltipRadius = Layer.toFixed(lay.tooltipRadius * time)
        if (lay.tooltipRadius < TOOLTIP_RADIUS) {
          lay.tooltipRadius = TOOLTIP_RADIUS
        }
        lay.fontSize = Layer.toFixed(lay.fontSize * time)
        lay.tipTrangleSize = Layer.toFixed(lay.tipTrangleSize * time)
        if (lay.tipTrangleSize < TOOLTIP_TRANGLE_SIZE) {
          lay.tipTrangleSize = TOOLTIP_TRANGLE_SIZE
        }
        lay.tooltipPoint = getTooltipPoint(lay.point, lay.width)
      })
    },
    showContent(showing = false) {
      const lay = this
      lay.setCus('showContent', () => {
        lay.$children.get('text').emit('$' + (showing ? 'showing' : 'hide'))
      })
    },
    showSquare(showing) {
      const lay = this
      lay.$visiable = showing
    }
  }
}

export function getSuitableFont(ctx, text, maxWidth, family = 'Lato') {
  const ErrorRange = 1
  let fontSize = 16
  while (fontSize) {
    const style = {
      font: fontSize + 'px ' + family
    }
    const fontWidth = Math.ceil(measureText(ctx, text, style).width)
    if (fontWidth + ErrorRange < maxWidth || fontWidth - ErrorRange > maxWidth) {
      fontSize += (maxWidth - fontWidth) / text.length
    } else {
      break
    }
  }
  return fontSize
}

function getTooltipPoint(point, width) {
  return { x: point.x + width / 2, y: point.y }
}

function struct() {
  const lay = this
  lay.padding = lay.padding || CONTENT_PADDING
  lay.contentStyle = lay.contentStyle || lay.color
  lay.fontSize = lay.fontSize || getSuitableFont(lay.$ctx, lay.content, lay.width - lay.padding * 1.5, FONT_FAMILY)
  lay.tooltipPoint = lay.tooltipPoint || getTooltipPoint(lay.point, lay.width)
  lay.tooltipPadding = lay.tooltipPadding || TOOLTIP_PADDING
  lay.toolFont = lay.toolFont || TOOLTIP_TEXT_FONT
  lay.tooltipRadius = lay.tooltipRadius || TOOLTIP_RADIUS
  lay.tipTrangleSize = lay.tipTrangleSize || TOOLTIP_TRANGLE_SIZE
  lay.containerStyle = lay.containerStyle || lay.color
  const width = lay.width
  Layer.component.rect.drawRect({
    props: {
      point: lay.point,
      radius: 0,
      width: width,
      height: width,
      position: Layer.component.rect.CENTER,
      style: {
        fillStyle: lay.containerStyle
      },
      fill: true
    }
  }, lay, 'content')
  Layer.component.rect.drawRect({
    props: {
      point: lay.point,
      radius: 0,
      width: width - lay.padding,
      height: width - lay.padding,
      position: Layer.component.rect.CENTER,
      style: {
        fillStyle: lay.color
      },
      fill: true
    },
    visiable: false
  }, lay, 'inner')
  Layer.component.text.drawText({
    props: {
      point: lay.point,
      text: lay.content,
      style: {
        font: lay.fontSize + 'px ' + FONT_FAMILY,
        fillStyle: FONT_COLOR
      },
      position: Layer.component.text.CENTER
    },
    visiable: false
  }, lay, 'text')

  Layer.component.tooltip.drawTooltip({
    props: {
      point: lay.tooltipPoint,
      position: Layer.component.tooltip.LEFT,
      text: ['Features:' + lay.featureX + ', ' + lay.featureY, 'Coefficient:' + lay.content],
      trangleSize: lay.tipTrangleSize,
      radius: lay.tooltipRadius,
      padding: lay.tooltipPadding,
      containerStyle: {
        fillStyle: TOOLTIP_BACKGROUND
      },
      textStyle: {
        font: lay.toolFont + 'px ' + FONT_FAMILY,
        fillStyle: TOOLTIP_TEXT_COLOR
      }
    },
    zindex: 1,
    visiable: false
  }, lay, 'tooltip')
}

export default squareComp
