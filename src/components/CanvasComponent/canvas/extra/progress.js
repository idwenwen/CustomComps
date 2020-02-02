/**
 * state: {
 *  point: {x, y}
 *  width: Number,
 *  Height: Number,
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
 *  text: String
 * }
 */

import { uuidSupport } from '@u'
import Layer from '../Core'
import { fromTo } from '../Core/tools/translate'

const LINEWIDTH = 8
const COMP_HEIGHT_PADDING = 10
const BACKGROUND = '#ffffff'
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
const FONT_SIZE = 16
const FONT_FAMILY = 'lato'
const TIME_TEXT = '#cccccc'

const BETWEEN = 6
const ICON_PADDING = 10
const CONTENT_PADDING = 4

const PORT_WIDTH = 20
const PORT_HEIGHT = 6
const PORT_RADIUS = 2
const PORT_BETWEEN = 2
const DATA_PORT_COLOR = '#E6B258'
const MODEL_PORT_COLOR = '#00cbff'
const DISABLE_INIT_COLOR = '#00cbff'
const DISABLE_NO_INIT_COLOR = '#7F7D8E'

const progressComp = {
  drawProgress(obj, parent, name) {
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
  type: {
    UNRUN: 'UNRUN',
    RUNNING: 'RUNNING',
    FAIL: 'FAIL',
    SUCCESS: 'SUCCESS'
  },
  animation: {
    loading(lay, name = 'loading') {
      const changes = {
        'progress': {
          to: 1,
          between: 0.02,
          time: 100
        },
        'style.fillStyle': {
          to: 'rgba(36,182,139,1)',
          between: 0.04,
          time: 500
        }
      }
      fromTo(lay._$children['content'], name, changes)
      lay._$children['content'].startAnimation(name)
      return name
    },
    success(lay, name = 'success') {
      const changesForContainer = {
        'style.fillStyle': {
          to: SUCCESS,
          between:
        }
      }
    }
  }
}

function _getColor(type, choose, disable, part) {
  if (choose) {
    return CHOOSE
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

function _getStyle(lay) {
  const times = lay._times || 1
  const style = { container: {
    fillStyle: _getColor(lay.type || progressComp.type.UNRUN, !!lay.choose, lay.disable)
  }, content: {
    fillStyle: _getColor(lay.type || progressComp.type.UNRUN, !!lay.choose, lay.disable, 'content')
  }, text: {
    font: FONT_SIZE * times + 'px ' + FONT_FAMILY,
    fillStyle: _getTextColor(lay.type || progressComp.type.UNRUN, !!lay.choose, lay.disable)
  }, time: {
    fillStyle: TIME_TEXT
  }}
  lay.style = style
  return lay.style
}

function path() {
  const lay = this
  const times = lay._times || 1
  const dataInput = !(lay.dataInput === false)
  const dataOutput = !(lay.dataOutput === false)
  const modelInput = !(lay.modelInput === false)
  const modelOutput = !(lay.modelOutput === false)

  const x = lay.point.x || lay.point[0] || 0
  const y = lay.point.y || lay.point[1] || 0
  const w = lay.width
  const h = lay.height || FONT_SIZE * times + COMP_HEIGHT_PADDING * times
  const type = lay.type

  const drawingStyle = _getStyle(lay)
  const iconW = h - (ICON_PADDING * times)
  const betweenIconWithContent = BETWEEN * times
  // drawing maintain
  Layer.component.rect.drawRect({
    data: {
      point: { x, y },
      width: w,
      height: h,
      style: drawingStyle.container,
      fill: true
    }
  }, lay, 'container')
  Layer.component.rect.drawRect({
    data: {
      point: { x, y },
      width: w - LINEWIDTH * times,
      height: h - LINEWIDTH * times,
      style: {
        fillStyle: BACKGROUND
      },
      fill: true
    }
  }, lay, 'containerInner')
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
      width: w - LINEWIDTH * times - CONTENT_PADDING * times,
      style: drawingStyle.text,
      position: Layer.component.text.CENTER
    }
  }, lay, 'text')

  // drawing appendix
  if ((type === progressComp.SUCCESS || type === progressComp.FAIL) && lay.img) {
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
        text: lay.time,
        style: drawingStyle.time
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
        radius: PORT_RADIUS * times,
        style: { fillStyle: lay.disable
          ? (type !== progressComp.UNRUN
            ? DISABLE_INIT_COLOR
            : DISABLE_NO_INIT_COLOR)
          : DATA_PORT_COLOR },
        fill: true
      }
    }, lay, 'dataInput')
    Layer.component.tooltip.drawTooltip({
      data: {
        point: { x: x - w / 4, y: y - h / 2 - PORT_HEIGHT * times - PORT_BETWEEN * times },
        position: Layer.component.tooltip.BOTTOM,
        text: 'Data Input',
        containerStyle: {
          fillStyle: 'rgba(255,165,0,0.8)'
        },
        textStyle: {
          font: '12px arial'
        },
        visable: false
      }
    }, lay, 'dataInputTooltip')
  }

  if (dataOutput) {
    Layer.component.rect.drawRect({
      data: {
        point: { x: x - w / 4, y: y + h / 2 + PORT_HEIGHT * times / 2 },
        width: PORT_WIDTH * times,
        height: PORT_HEIGHT * times,
        radius: PORT_RADIUS * times,
        style: { fillStyle: lay.disable
          ? (type !== progressComp.UNRUN
            ? DISABLE_INIT_COLOR
            : DISABLE_NO_INIT_COLOR)
          : DATA_PORT_COLOR },
        fill: true
      }
    }, lay, 'dataOutput')
    Layer.component.tooltip.drawTooltip({
      data: {
        point: { x: x - w / 4, y: y + h / 2 + PORT_HEIGHT * times + PORT_BETWEEN * times },
        position: Layer.component.tooltip.UP,
        text: 'Data Output',
        containerStyle: {
          fillStyle: 'rgba(255,165,0,0.8)'
        },
        textStyle: {
          font: '12px arial'
        },
        visable: false
      }
    }, lay, 'dataOutputTooltip')
  }

  if (modelInput) {
    Layer.component.rect.drawRect({
      data: {
        point: { x: x + w / 4, y: y - h / 2 - PORT_HEIGHT * times / 2 },
        width: PORT_WIDTH * times,
        height: PORT_HEIGHT * times,
        radius: PORT_RADIUS * times,
        style: { fillStyle: lay.disable
          ? (type !== progressComp.UNRUN
            ? DISABLE_INIT_COLOR
            : DISABLE_NO_INIT_COLOR)
          : MODEL_PORT_COLOR },
        fill: true
      }
    }, lay, 'modelInput')
    Layer.component.tooltip.drawTooltip({
      data: {
        point: { x: x + w / 4, y: y - h / 2 - PORT_HEIGHT * times - PORT_BETWEEN * times },
        position: Layer.component.tooltip.BOTTOM,
        text: 'Model Input',
        containerStyle: {
          fillStyle: 'rgba(255,165,0,0.8)'
        },
        textStyle: {
          font: '12px arial'
        },
        visable: false
      }
    }, lay, 'modelInputTooltip')
  }

  if (modelOutput) {
    Layer.component.rect.drawRect({
      data: {
        point: { x: x + w / 4, y: y + h / 2 + PORT_HEIGHT * times / 2 },
        width: PORT_WIDTH * times,
        height: PORT_HEIGHT * times,
        radius: PORT_RADIUS * times,
        style: { fillStyle: lay.disable
          ? (type !== progressComp.UNRUN
            ? DISABLE_INIT_COLOR
            : DISABLE_NO_INIT_COLOR)
          : MODEL_PORT_COLOR },
        fill: true
      }
    }, lay, 'modelOutput')
    Layer.component.tooltip.drawTooltip({
      data: {
        point: { x: x + w / 4, y: y + h / 2 + PORT_HEIGHT * times + PORT_BETWEEN * times },
        position: Layer.component.tooltip.UP,
        text: 'Model Output',
        containerStyle: {
          fillStyle: 'rgba(255,165,0,0.8)'
        },
        textStyle: {
          font: '12px arial'
        },
        visable: false
      }
    }, lay, 'modelOutputTooltip')
  }
}

export default progressComp
