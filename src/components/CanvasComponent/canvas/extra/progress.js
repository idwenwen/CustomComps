/**
 * state: {
 *  point: {x, y}
 *  width: Number,
 *  Height: Number,
 *  status: ENUMS:[],
 *  choose：Boolean || false,
 *  disable: Boolean,
 *  progress: Number,
 *  img: imageObject,
 *  dataInput: Boolean,
 *  dataOutput: Boolean,
 *  modelInput: Boolean,
 *  modelOutput: Boolean,
 *  time: string,
 *  text: String
 * }
 */

import { uuidSupport } from '@u'
import Layer from '../Core'

const LINEWIDTH = 3
const CHOOSE = '#494ece'
const SUCCESS = '#24b68b'
const PROGRESS = 'rgba(36,182,139,0.6)'
const DISABLE_PROGRESS = 'rgba(187,187,200,0.6)'
const ERROR = '#ff6464'
const UNRUN = '#e8e8ef'
const COULDNOTRUN = '#BBBBC8'

const BALCK_TEXT = '#7f7d8e'
const WHITE_TEXT = '#ffffff'
const DISABLE_TEXT = '#534C77'
const FONT_SIZE = 8
const FONT_FAMILY = 'lato'
const TIME_TEXT = '#cccccc'

const BETWEEN = 6
const ICON_PADDING = 10

const PORT_WIDTH = 10
const PORT_HEIGHT = 4
const PORT_RADIUS = 1
const DATA_PORT_COLOR = '#E6B258'
const MODEL_PORT_COLOR = '#00cbff'
const DISABLE_INIT_COLOR = '#00cbff'
const DISABLE_NO_INIT_COLOR = '#7F7D8E'

const progressComp = {
  drawArc(obj, parent, name) {
    obj.canvas = parent ? parent._$canvas : obj.canvas
    obj.path = path
    if (parent) {
      if (!name) {
        name = uuidSupport('progress')
      }
      parent.drawLayer(name, obj)
      return name
    } else {
      return new Layer(obj)
    }
  },
  status: {
    UNRUN: 'UNRUN',
    RUNNING: 'RUNNING',
    FAIL: 'FAIL',
    SUCCESS: 'SUCCESS'
  }
}

function _getColor(type, choose, disable) {
  if (choose) {
    return CHOOSE
  } else if (disable && type !== progressComp.status.UNRUN) {
    return UNRUN
  } else if (disable && type === progressComp.status.UNRUN) {
    return COULDNOTRUN
  } else if (type === progressComp.status.SUCCESS) {
    return SUCCESS
  } else if (type === progressComp.status.RUNNING) {
    if (disable) {
      return DISABLE_PROGRESS
    } else {
      return PROGRESS
    }
  } else if (type === progressComp.status.FAIL) {
    return ERROR
  } else if (type === progressComp.status.UNRUN) {
    return UNRUN
  }
}

function _getTextColor(type, choose, disable) {
  if (disable && type !== progressComp.status.UNRUN) {
    if (choose) {
      return WHITE_TEXT
    } else {
      return BALCK_TEXT
    }
  } else if (disable && type === progressComp.status.UNRUN) {
    if (choose) {
      return WHITE_TEXT
    } else {
      return DISABLE_TEXT
    }
  } else if (type === progressComp.status.SUCCESS) {
    return WHITE_TEXT
  } else if (type === progressComp.status.RUNNING) {
    return BALCK_TEXT
  } else if (type === progressComp.status.FAIL) {
    return WHITE_TEXT
  } else if (type === progressComp.status.UNRUN) {
    return BALCK_TEXT
  }
}

function _getStyle(lay) {
  const times = lay._times || 1
  const style = { container: {
    lineWidth: LINEWIDTH * times,
    strokeStyle: _getColor(lay.type || progressComp.status.UNRUN, !!lay.choose, lay.disable)
  }, content: {
    fillStyle: _getColor(lay.type || progressComp.status.UNRUN, !!lay.choose, lay.disable)
  }, text: {
    font: FONT_SIZE * times + 'px ' + FONT_FAMILY,
    fillStyle: _getTextColor(lay.type || progressComp.status.UNRUN, !!lay.choose, lay.disable)
  }, time: {
    fillStyle: TIME_TEXT
  }}
  lay.style = style
  return lay.style
}

function path() {
  const lay = this
  const dataInput = !(lay.dataInput === false)
  const dataOutput = !(lay.dataOutput === false)
  const modelInput = !(lay.modelInput === false)
  const modelOutput = !(lay.modelOutput === false)

  const x = lay.point.x || lay.point[0]
  const y = lay.point.y || lay.point[1]
  const w = lay.width
  const h = lay.height
  const type = lay.type

  const drawingStyle = _getStyle(lay)
  const times = lay._times || 1
  const iconW = h - (ICON_PADDING * times)
  const betweenIconWithContent = BETWEEN * times
  // drawing maintain
  Layer.component.rect.drawRect({
    data: {
      point: { x, y },
      width: w,
      height: h,
      style: drawingStyle.container,
      stroke: true
    }
  }, lay, 'container')
  Layer.component.rect.drawRect({
    data: {
      point: { x, y },
      width: w - LINEWIDTH * times,
      height: h - LINEWIDTH * times,
      progress: lay.progress || 1,
      style: drawingStyle.content,
      fill: true
    }
  }, lay, 'content')
  Layer.component.text.drawText({
    data: {
      point: { x, y },
      text: lay.text,
      style: drawingStyle.text,
      position: Layer.component.text.CENTER
    }
  }, lay, 'text')

  // drawing appendix
  if (type === progressComp.SUCCESS || type === progressComp.FAIL) {
    Layer.component.icon.drawIcon({
      data: {
        point: { x: x + w / 2 + betweenIconWithContent + iconW / 2, y },
        width: iconW,
        img: lay.img
      }
    }, lay, 'icon')
  } else if (type === progressComp.RUNNING) {
    Layer.component.text.drawText({
      data: {
        point: { x: x + w / 2 + betweenIconWithContent, y },
        text: lay.time
      }
    }, lay, 'time')
  }

  // drawing in-out put stuff
  if (dataInput) {
    Layer.component.rect.drawRect({
      data: {
        point: { x: x - w / 4, y: y - h / 2 - PORT_HEIGHT * times / 2 },
        width: PORT_WIDTH * times,
        height: PORT_HEIGHT * times,
        style: { fillStyle: lay.disable
          ? (type !== progressComp.UNRUN
            ? DISABLE_INIT_COLOR
            : DISABLE_NO_INIT_COLOR)
          : DATA_PORT_COLOR }
      }
    }, lay, 'dataInput')
    Layer.component.tooltip.drawTooltip({
      data: {
        
      }
    })
  }
}

export default progressComp
