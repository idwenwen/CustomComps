/**
 * point: {x, y},
 * width: number,
 * content: String,
 * featureX: String,
 * featureY: String
 * color: String,
 * fontSize: Number,
 * disable: Boolean
 */

import Layer from '../Core'
import { measureText } from '../Core/Paths/text'

const CONTENT_PADDING = 0.1
const CHOOSE_STYLE = '#000'

const FONT_FAMILY = 'Lato'
const FONT_COLOR = '#000'

const DISABLE_STLYE = 'rgba(62,64,82,0.6)'

const TOOLTIP_BACKGROUND = 'rgba(62,64,82,0.8)'
const TOOLTIP_TEXT_COLOR = '#fff'
const TOOLTIP_PADDING = 6
const TOOLTIP_TEXT_FONT = 12
const TOOLTIP_RADIUS = 4
const DISTANCE = 5
const TOOLTIP_TRANGLE_SIZE = 5
const LENGTH = 6

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
      if (lay.disable) {
        if (lay.$children.get('tooltip').$visiable) {
          const tooltip = lay.$children.get('tooltip')
          tooltip.emit('$hide')
        }
        if (!lay.$children.get('disable').$visiable) {
          const tooltip = lay.$children.get('disable')
          tooltip.emit('$showing')
        }
      } else {
        if (lay.$here(point)) {
          lay.setCus('showTips', () => {
            const trans = lay.$meta.get('$translate') || { x: 0, y: 0 }
            lay.$children.get('inner').emit('$showing')
            lay.containerStyle = CHOOSE_STYLE
            const tooltip = lay.$children.get('tooltip')
            lay.tooltipPoint = { x: point.x - trans.x, y: point.y - DISTANCE - trans.y }
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
      }
    },
    // scale(time, point = { x: 0, y: 0 }) {
    //   const lay = this
    //   lay._scale = (!lay._scale ? 1 : lay._scale) * time
    //   lay.setCus('scale', () => {
    //     lay.point = Layer.scaleDistanceForPoint(lay.point, point, time)
    //     lay.width = Layer.toFixed(lay.width * time)
    //     // lay.padding = Layer.toFixed(lay.padding * time)
    //     // lay.toolFont = Layer.toFixed(lay.toolFont * time)
    //     // if (lay.toolFont < TOOLTIP_TEXT_FONT || lay._scale < 1) {
    //     //   lay.toolFont = TOOLTIP_TEXT_FONT
    //     // }
    //     // lay.tooltipPadding = Layer.toFixed(lay.tooltipPadding * time)
    //     // if (lay.tooltipPadding < TOOLTIP_PADDING || lay._scale < 1) {
    //     //   lay.tooltipPadding = TOOLTIP_PADDING
    //     // }
    //     // lay.tooltipRadius = Layer.toFixed(lay.tooltipRadius * time)
    //     // if (lay.tooltipRadius < TOOLTIP_RADIUS || lay._scale < 1) {
    //     //   lay.tooltipRadius = TOOLTIP_RADIUS
    //     // }
    //     // lay.fontSize = Layer.toFixed(lay.fontSize * time)
    //     // lay.tipTrangleSize = Layer.toFixed(lay.tipTrangleSize * time)
    //     // if (lay.tipTrangleSize < TOOLTIP_TRANGLE_SIZE || lay._scale < 1) {
    //     //   lay.tipTrangleSize = TOOLTIP_TRANGLE_SIZE
    //     // }
    //     // lay.tooltipPoint = getTooltipPoint(lay.point, lay.width)
    //   })
    // },
    showContent(showing = false) {
      const lay = this
      if (!lay.disable) {
        lay.setCus('showContent', () => {
          lay.$children.get('text').emit('$' + (showing ? 'showing' : 'hide'))
        })
      }
    },
    setDisable(props) {
      const lay = this
      lay.setCus('setDisable', () => {
        lay.disable = props !== undefined ? props : !lay.disable
        lay.$children.get('disable').emit('$' + (lay.disable ? 'showing' : 'hide'))
        if (lay.$children.get('text').$visiable && lay.disable) {
          lay.$children.get('text').emit('$hide')
        }
        if (lay.$children.get('tooltip').$visiable && lay.disable) {
          lay.$children.get('tooltip').emit('$hide')
        }
      })
    }
  }
}

export function getSuitableFont(ctx, text, maxWidth, family = 'Lato') {
  text = -Math.abs(parseFloat(parseFloat(text).toFixed(LENGTH)))
  maxWidth -= maxWidth * CONTENT_PADDING
  const ErrorRange = 1
  let fontSize = 16
  while (fontSize > 0) {
    const style = {
      font: fontSize + 'px ' + family
    }
    const fontWidth = Math.ceil(measureText(ctx, text.toString(), style).width)
    if (fontWidth + ErrorRange < maxWidth || fontWidth > maxWidth) {
      fontSize += (maxWidth - fontWidth) / text.toString().length
    } else {
      break
    }
  }
  return fontSize
}

function getTooltipPoint(point, width) {
  return { x: point.x, y: point.y - width / 2 }
}

function struct() {
  const lay = this
  lay.contentStyle = lay.contentStyle || lay.color
  lay.fontSize = lay.fontSize || getSuitableFont(lay.$ctx, lay.content, lay.width, FONT_FAMILY)
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
      width: width - width * CONTENT_PADDING,
      height: width - width * CONTENT_PADDING,
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

  // disable
  Layer.component.rect.drawRect({
    props: {
      point: lay.point,
      radius: 0,
      width: width,
      height: width,
      position: Layer.component.rect.CENTER,
      style: {
        fillStyle: DISABLE_STLYE
      },
      fill: true
    },
    visiable: !!lay.disable
  }, lay, 'disable')

  Layer.component.tooltip.drawTooltip({
    props: {
      point: lay.tooltipPoint,
      position: Layer.component.tooltip.BOTTOM,
      text: ['Features: ' + lay.featureX + ', ' + lay.featureY, 'Coefficient: ' + lay.content],
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
