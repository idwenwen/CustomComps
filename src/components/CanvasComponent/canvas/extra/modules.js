/**
 * state: {
 *  point: {x, y}
 *  width: Number,
 *  Height: Number, | padding: Number
 *  type: ENUMS:[],
 *  choose：Boolean || false,
 *  disable: Boolean,
 *  progress: Number,
 *  img: imageObject,
 *  dataInput: Boolean,
 *  dataOutput: Boolean,
 *  modelInput: Boolean,
 *  modelOutput: Boolean,
 *  time: string,
 *  text: String,
 *  radius: Number
 * }
 */

import Layer from '../Core'
import { measureText } from '../Core/Paths/text'

const LINEWIDTH = 8
const COMP_PADDING = 10
const BACKGROUND = '#ffffff'
const CHOOSE = '#494ece'
const SUCCESS = '#24b68b'
const PROGRESS = 'rgba(36,182,139,0.6)'
const DISABLE_PROGRESS = 'rgba(187,187,200,0.6)'
const ERROR = '#ff6464'
const UNRUN = '#e8e8ef'
const COULDNOTRUN = '#BBBBC8'
const RECT_RADIUS = 4

const BALCK_TEXT = '#7f7d8e'
const WHITE_TEXT = '#ffffff'
const DISABLE_TEXT = '#534C77'
export const FONT_SIZE = 16
export const FONT_FAMILY = 'lato'
const TIME_TEXT = '#cccccc'

const BETWEEN_ICON_WITH_CONTENT = 6
const ICON_PADDING = 10

const PORT_WIDTH = 20
const PORT_HEIGHT = 6
const PORT_RADIUS = 2
const PORT_BETWEEN = 2
const TOOLTIP_FONT = 12
const TRANGLE_SIZE = 5
const TOOLTIP_PADDING = 6
const TOOLTIP_RADIUS = 4
const TOOLTIP_BACKGROUND = 'rgba(127,125,142,0.7)'
const TOOLTIP_FONT_STYLE = 'rgba(255,255,255,1)'
const DATA_PORT_COLOR = '#E6B258'
const MODEL_PORT_COLOR = '#00cbff'
const DISABLE_INIT_COLOR = '#7F7D8E'
const DISABLE_NO_INIT_COLOR = '#7F7D8E'

const progressComp = {
  drawProgress(obj, parent, name) {
    obj.canvas = parent ? parent.$canvas : obj.canvas
    obj.struct = struct
    if (parent) {
      if (!name) {
        name = Layer.getUUID('progress')
      }
      parent.drawLayer(name, obj)
      return name
    } else {
      return new Layer(obj)
    }
  },
  clear,
  type: {
    UNRUN: 'UNRUN',
    RUNNING: 'RUNNING',
    FAIL: 'FAIL|ERROR',
    SUCCESS: 'SUCCESS|COMPLETE'
  },
  events: {
    choose(point, afterChoose, ...props) {
      const lay = this
      lay.setCus('choose', () => {
        if (lay.$here(point)) {
          lay.choose = true
        } else {
          lay.choose = false
        }
        lay.containerStyle = _getContainerColor(lay.type, !!lay.choose, lay.disable)
        lay.contentStyle = _getContainerColor(lay.type, !!lay.choose, lay.disable, 'content')
        lay.fontStyle = _getTextColor(lay.type, !!lay.choose, lay.disable)
        if (afterChoose && typeof afterChoose === 'function') afterChoose(lay.text, lay.$here(point))
      })
    },
    scale(time, point = { x: 0, y: 0 }) {
      const lay = this
      lay._scale = (!lay._scale ? 1 : lay._scale) * time
      lay.setCus('scale', () => {
        lay.point = Layer.scaleDistanceForPoint(lay.point, point, time)
        if (lay.width) lay.width = Layer.toFixed(lay.width * time)
        if (lay.height) lay.height = Layer.toFixed(lay.height * time)
        if (lay.padding) lay.padding = Layer.toFixed(lay.padding * time)
        lay.contentFontSize = Layer.toFixed(lay.contentFontSize * time)
        lay.iconPadding = Layer.toFixed(lay.iconPadding * time)
        lay.betweenIconWithContent = Layer.toFixed(lay.betweenIconWithContent * time)
        lay.lineWidth = Layer.toFixed(lay.lineWidth * time)
        lay.portWidth = Layer.toFixed(lay.portWidth * time)
        lay.portHeight = Layer.toFixed(lay.portHeight * time)
        lay.portRadius = Layer.toFixed(lay.portRadius * time)
        lay.betweenPortWidthTooltip = Layer.toFixed(lay.betweenPortWidthTooltip * time)
        lay.tooltipFont = Layer.toFixed(lay.tooltipFont * time)
        if (lay.tooltipFont < TOOLTIP_FONT || lay._scale < 1) lay.tooltipFont = TOOLTIP_FONT
        lay.tipTrangleSize = Layer.toFixed(lay.tipTrangleSize * time)
        if (lay.tipTrangleSize < TRANGLE_SIZE || lay._scale < 1) lay.tipTrangleSize = TRANGLE_SIZE
        lay.radius = Layer.toFixed(lay.radius * time)
        lay.tooltipPadding = Layer.toFixed(lay.tooltipPadding * time)
        if (lay.tooltipPadding < TOOLTIP_PADDING || lay._scale < 1) lay.tooltipPadding = TOOLTIP_PADDING
        lay.tooltipRadius = Layer.toFixed(lay.tooltipRadius * time)
        if (lay.tooltipRadius < TOOLTIP_RADIUS || lay._scale < 1) lay.tooltipRadius = TOOLTIP_RADIUS
      })
    },
    showTips(point) {
      const lay = this
      const check = function(name) {
        const tip = lay.$children.get(name)
        if (tip) {
          if (tip.$here(point)) {
            tip.setCus('showToolTip', () => {
              lay.$children.get(name + 'Tooltip').emit('$showing')
            })
          } else {
            if (lay.$children.get(name + 'Tooltip').$visiable) {
              tip.setCus('hideTooltip', () => {
                lay.$children.get(name + 'Tooltip').emit('$hide')
              })
            }
          }
        }
      }
      check('dataInput')
      check('dataOutput')
      check('modelInput')
      check('modelOutput')
    }
  },
  animations: {
    tictok() {
      const lay = this
      lay.registerChainTranslate('tictok', true, lay.settingCus(() => {
        if (!lay.time.match(':')) {
          lay.time = exchangeTime(lay.time)
        }
        const time = lay.time.split(':')
        let hou = parseInt(time[0])
        let min = parseInt(time[1])
        let sec = parseInt(time[2])
        if (sec + 1 >= 60) {
          sec = 0
          if (min + 1 >= 60) {
            min = 0
            hou += 1
          } else {
            min += 1
          }
        } else {
          sec += 1
        }
        hou = (hou.toString().length < 2 ? '0' : '') + hou
        min = (min.toString().length < 2 ? '0' : '') + min
        sec = (sec.toString().length < 2 ? '0' : '') + sec
        lay.time = hou + ':' + min + ':' + sec
      }, 1000))
    },
    loading() {
      const lay = this
      const changeList = []
      changeList.push(lay.settingRGBA(lay.contentStyle, 'rgba(36,182,139,0)', (to) => { lay.contentStyle = to }, 500))
      changeList.push(lay.settingCus(() => {
        lay.progress = 0
        lay.contentStyle = _getContainerColor(lay.type || progressComp.type.UNRUN, !!lay.choose, lay.disable, 'content')
      }))
      changeList.push(lay.settingNum(0, 1, (to) => { lay.progress = to }, 3000, 20))
      lay.registerChainTranslate('loading', true, ...changeList)
    },
    toNewType(type, timeOrPic) {
      const lay = this
      if (type === lay.type) return
      const changeList = { toNewTypeContent: [], toNewTypeContainer: [], toNewTypeText: [] }
      if (type !== progressComp.type.RUNNING) {
        lay.deleteChainTranslate('loading')
        lay.deleteChainTranslate('tictok')
        changeList.toNewTypeContent.push(lay.settingNum(lay.progress || 1, 1, (to) => { lay.progress = to }, 200))
      }
      const toColor = _getContainerColor(type, !!lay.choose, lay.disable, 'content')
      changeList.toNewTypeContent.push(lay.settingRGBA(lay.contentStyle, toColor, (to) => { lay.contentStyle = to }, 200))
      changeList.toNewTypeContent.push(lay.settingCus(() => {
        lay.type = type
        if (type === progressComp.type.RUNNING) {
          lay.progress = 0
          lay.time = timeOrPic || lay.time || '00:00:00'
          progressComp.animations.tictok.call(lay)
          progressComp.animations.loading.call(lay)
        }
        if (type === progressComp.type.SUCCESS || type === progressComp.type.FAIL) {
          lay.img = timeOrPic
        }
      }))
      const toContainerColor = _getContainerColor(type, !!lay.choose, lay.disable)
      changeList.toNewTypeContainer.push(lay.settingRGBA(lay.containerStyle, toContainerColor, (to) => { lay.containerStyle = to }, 200))
      const toFontStyle = _getTextColor(type, !!lay.choose, lay.disable)
      changeList.toNewTypeText.push(lay.settingRGBA(lay.fontStyle, toFontStyle, (to) => { lay.fontStyle = to }, 200))
      for (const key in changeList) {
        lay.registerChainTranslate(key, false, ...changeList[key])
      }
    }
  }
}

function _getContainerColor(type, choose, disable, part) {
  if (choose) {
    if (part === 'content' && type === progressComp.type.RUNNING) {
      if (disable) {
        return DISABLE_PROGRESS
      } else {
        return PROGRESS
      }
    } else {
      return CHOOSE
    }
  } else if (disable && type !== progressComp.type.UNRUN) {
    return UNRUN
  } else if (disable && type === progressComp.type.UNRUN) {
    return COULDNOTRUN
  } else if (type === progressComp.type.SUCCESS) {
    return SUCCESS
  } else if (type === progressComp.type.RUNNING) {
    if (part === 'content') {
      if (disable) {
        return DISABLE_PROGRESS
      } else {
        return PROGRESS
      }
    } else {
      return SUCCESS
    }
  } else if (type === progressComp.type.FAIL) {
    return ERROR
  } else if (type === progressComp.type.UNRUN) {
    return UNRUN
  }
}

function _getTextColor(type, choose, disable) {
  if (disable && type !== progressComp.type.UNRUN) {
    if (choose) {
      return WHITE_TEXT
    } else {
      return BALCK_TEXT
    }
  } else if (disable && type === progressComp.type.UNRUN) {
    if (choose) {
      return WHITE_TEXT
    } else {
      return DISABLE_TEXT
    }
  } else if (type === progressComp.type.SUCCESS) {
    return WHITE_TEXT
  } else if (type === progressComp.type.RUNNING) {
    return BALCK_TEXT
  } else if (type === progressComp.type.FAIL) {
    return WHITE_TEXT
  } else if (type === progressComp.type.UNRUN) {
    return BALCK_TEXT
  }
}

function getStyle(type, choose, disable, lay) {
  if (lay) {
    lay.containerStyle = lay.containerStyle || _getContainerColor(type || progressComp.type.UNRUN, !!choose, disable)
    lay.contentStyle = lay.contentStyle || _getContainerColor(type || progressComp.type.UNRUN, !!choose, disable, 'content')
    lay.fontStyle = lay.fontStyle || _getTextColor(type || progressComp.type.UNRUN, !!choose, disable)
  }
  const style = { container: {
    fillStyle: lay ? lay.containerStyle : _getContainerColor(type || progressComp.type.UNRUN, !!choose, disable)
  }, content: {
    fillStyle: lay ? lay.contentStyle : _getContainerColor(type || progressComp.type.UNRUN, !!choose, disable, 'content')
  }, text: {
    font: lay.contentFontSize + 'px ' + FONT_FAMILY,
    fillStyle: lay.fontStyle
  }, time: {
    font: lay.contentFontSize * 0.8 + 'px ' + FONT_FAMILY,
    fillStyle: TIME_TEXT
  }}
  lay.style = style
  return lay.style
}

function struct() {
  const lay = this
  lay.choose = !!lay.choose
  lay.contentFontSize = lay.contentFontSize || FONT_SIZE
  lay.padding = lay.padding || COMP_PADDING
  lay.tooltipRadius = lay.tooltipRadius || TOOLTIP_RADIUS
  lay.iconPadding = lay.iconPadding || ICON_PADDING
  lay.betweenIconWithContent = lay.betweenIconWithContent || BETWEEN_ICON_WITH_CONTENT
  lay.lineWidth = lay.lineWidth || LINEWIDTH
  lay.portWidth = lay.portWidth || PORT_WIDTH
  lay.portHeight = lay.portHeight || PORT_HEIGHT
  lay.portRadius = lay.portRadius || PORT_RADIUS
  lay.betweenPortWidthTooltip = lay.betweenPortWidthTooltip || PORT_BETWEEN
  lay.tooltipFont = lay.tooltipFont || TOOLTIP_FONT
  lay.tipTrangleSize = lay.tipTrangleSize || TRANGLE_SIZE
  lay.radius = lay.radius || RECT_RADIUS
  lay.tooltipPadding = lay.tooltipPadding || TOOLTIP_PADDING
  if (lay.type === progressComp.type.RUNNING) {
    lay.time = exchangeTime(lay.time) || '00:00:00'
  }

  const dataInput = !!lay.dataInput
  const dataOutput = !!lay.dataOutput
  const modelInput = !!lay.modelInput
  const modelOutput = !!lay.modelOutput
  const x = lay.point.x || lay.point[0] || 0
  const y = lay.point.y || lay.point[1] || 0
  const drawingStyle = getStyle(lay.type, lay.choose, lay.disable, lay)
  const fontStyle = measureText(lay.$ctx, lay.text, drawingStyle.text)
  const w = lay.width || Math.ceil(fontStyle.width) + lay.padding * 2 + lay.lineWidth * 2
  const h = lay.height || lay.contentFontSize + lay.padding
  const type = lay.type
  const inoutPutmap = new Map()

  const iconW = h - (lay.iconPadding)
  const betweenIconWithContent = lay.betweenIconWithContent
  // drawing maintain
  Layer.component.rect.drawRect({
    props: {
      point: { x, y },
      width: w,
      height: h,
      radius: lay.radius,
      style: drawingStyle.container,
      fill: true
    }
  }, lay, 'container')
  Layer.component.rect.drawRect({
    props: {
      point: { x, y },
      width: w - lay.lineWidth,
      height: h - lay.lineWidth,
      radius: lay.radius,
      style: {
        fillStyle: BACKGROUND
      },
      fill: true
    }
  }, lay, 'containerInner')
  Layer.component.rect.drawRect({
    props: {
      point: { x, y },
      width: w - lay.lineWidth * 0.9,
      height: h - lay.lineWidth * 0.9,
      progress: lay.progress !== undefined ? lay.progress : 1,
      radius: lay.radius,
      style: drawingStyle.content,
      fill: true
    }
  }, lay, 'content')
  Layer.component.text.drawText({
    props: {
      point: { x, y },
      text: lay.text,
      style: drawingStyle.text,
      position: Layer.component.text.CENTER
    }
  }, lay, 'text')

  // drawing appendix
  if ((type === progressComp.type.SUCCESS || type === progressComp.type.FAIL) && lay.img) {
    Layer.component.icon.drawIcon({
      props: {
        point: { x: x + w / 2 + betweenIconWithContent + iconW / 2, y },
        width: iconW,
        img: lay.img
      }
    }, lay, 'icon')
  } else if (type === progressComp.type.RUNNING) {
    Layer.component.text.drawText({
      props: {
        point: { x: x + w / 2 + betweenIconWithContent, y },
        text: lay.time,
        style: drawingStyle.time
      }
    }, lay, 'time')
  }

  // drawing in-out put stuff
  if (dataInput) {
    const point = { x: x - w / 4, y: y - h / 2 - lay.portHeight / 2 }
    if (!modelOutput) {
      point.x = x
    }
    Layer.component.rect.drawRect({
      props: {
        point,
        width: lay.portWidth,
        height: lay.portHeight,
        radius: lay.portRadius,
        style: { fillStyle: lay.disable
          ? (type !== progressComp.UNRUN
            ? DISABLE_INIT_COLOR
            : DISABLE_NO_INIT_COLOR)
          : DATA_PORT_COLOR },
        fill: true
      }
    }, lay, 'dataInput')
    inoutPutmap.set('dataInput', point)
    Layer.component.tooltip.drawTooltip({
      props: {
        point: { x: point.x, y: point.y - lay.portHeight / 2 - lay.betweenPortWidthTooltip },
        position: Layer.component.tooltip.BOTTOM,
        text: 'Data Input',
        trangleSize: lay.tipTrangleSize,
        radius: lay.tooltipRadius,
        padding: lay.tooltipPadding,
        containerStyle: {
          fillStyle: TOOLTIP_BACKGROUND
        },
        textStyle: {
          font: lay.tooltipFont + 'px ' + FONT_FAMILY,
          fillStyle: TOOLTIP_FONT_STYLE
        }
      },
      zindex: 1,
      visiable: false
    }, lay, 'dataInputTooltip')
  }

  if (dataOutput) {
    const point = { x: x - w / 4, y: y + h / 2 + lay.portHeight / 2 }
    if (!modelOutput) {
      point.x = x
    }
    Layer.component.rect.drawRect({
      props: {
        point,
        width: lay.portWidth,
        height: lay.portHeight,
        radius: lay.portRadius,
        style: { fillStyle: lay.disable
          ? (type !== progressComp.UNRUN
            ? DISABLE_INIT_COLOR
            : DISABLE_NO_INIT_COLOR)
          : DATA_PORT_COLOR },
        fill: true
      }
    }, lay, 'dataOutput')
    inoutPutmap.set('dataOutput', point)
    Layer.component.tooltip.drawTooltip({
      props: {
        point: { x: point.x, y: point.y + lay.portHeight / 2 + lay.betweenPortWidthTooltip },
        position: Layer.component.tooltip.UP,
        text: 'Data Output',
        trangleSize: lay.tipTrangleSize,
        radius: lay.tooltipRadius,
        padding: lay.tooltipPadding,
        containerStyle: {
          fillStyle: TOOLTIP_BACKGROUND
        },
        textStyle: {
          font: lay.tooltipFont + 'px ' + FONT_FAMILY,
          fillStyle: TOOLTIP_FONT_STYLE
        }
      },
      zindex: 1,
      visiable: false
    }, lay, 'dataOutputTooltip')
  }

  if (modelInput) {
    const point = { x: x + w / 4, y: y - h / 2 - lay.portHeight / 2 }
    if (!dataInput) {
      point.x = x
    }
    Layer.component.rect.drawRect({
      props: {
        point,
        width: lay.portWidth,
        height: lay.portHeight,
        radius: lay.portRadius,
        style: { fillStyle: lay.disable
          ? (type !== progressComp.UNRUN
            ? DISABLE_INIT_COLOR
            : DISABLE_NO_INIT_COLOR)
          : MODEL_PORT_COLOR },
        fill: true
      }
    }, lay, 'modelInput')
    inoutPutmap.set('modelInput', point)
    Layer.component.tooltip.drawTooltip({
      props: {
        point: { x: point.x, y: y - h / 2 - lay.portHeight - lay.betweenPortWidthTooltip },
        position: Layer.component.tooltip.BOTTOM,
        text: 'Model Input',
        trangleSize: lay.tipTrangleSize,
        radius: lay.tooltipRadius,
        padding: lay.tooltipPadding,
        containerStyle: {
          fillStyle: TOOLTIP_BACKGROUND
        },
        textStyle: {
          font: lay.tooltipFont + 'px ' + FONT_FAMILY,
          fillStyle: TOOLTIP_FONT_STYLE
        }
      },
      zindex: 1,
      visiable: false
    }, lay, 'modelInputTooltip')
  }

  if (modelOutput) {
    const point = { x: x + w / 4, y: y + h / 2 + lay.portHeight / 2 }
    if (!dataOutput) {
      point.x = x
    }
    Layer.component.rect.drawRect({
      props: {
        point,
        width: lay.portWidth,
        height: lay.portHeight,
        radius: lay.portRadius,
        style: { fillStyle: lay.disable
          ? (type !== progressComp.UNRUN
            ? DISABLE_INIT_COLOR
            : DISABLE_NO_INIT_COLOR)
          : MODEL_PORT_COLOR },
        fill: true
      }
    }, lay, 'modelOutput')
    inoutPutmap.set('modelOutput', point)
    Layer.component.tooltip.drawTooltip({
      props: {
        point: { x: point.x, y: y + h / 2 + lay.portHeight + lay.betweenPortWidthTooltip },
        position: Layer.component.tooltip.UP,
        text: 'Model Output',
        trangleSize: lay.tipTrangleSize,
        radius: lay.tooltipRadius,
        padding: lay.tooltipPadding,
        containerStyle: {
          fillStyle: TOOLTIP_BACKGROUND
        },
        textStyle: {
          font: lay.tooltipFont + 'px ' + FONT_FAMILY,
          fillStyle: TOOLTIP_FONT_STYLE
        }
      },
      zindex: 1,
      visiable: false
    }, lay, 'modelOutputTooltip')
  }
  lay.$meta.set('port', inoutPutmap)
}

function clear() {
  const lay = this
  lay.$ctx.clearRect(0, 0, lay.$canvas.width, lay.$canvas.height)
}

export function exchangeTime(time) {
  if (time.toString().match(':')) {
    return time
  }
  if (!time) {
    return '00:00:00'
  }
  const t = Math.round(time / 1000)
  let s = t % 60
  const tm = (t - s) / 60
  let m = tm % 60
  let h = (tm - m) / 60
  s = s < 10 ? '0' + s : s
  m = m < 10 ? '0' + m : m
  h = h < 10 ? '0' + h : h
  return h + ':' + m + ':' + s
}

export default progressComp
