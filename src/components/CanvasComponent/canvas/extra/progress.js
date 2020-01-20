/**
 * state: {
 *  point: {x, y}
 *  width: Number,
 *  Height: Number,
 *  status: ENUMS:[],
 *  choose：Boolean || false,
 *  disable: Boolean,
 *  dataInput: Boolean,
 *  dataOutput: Boolean,
 *  modelInput: Boolean,
 *  modelOutput: Boolean,
 *  time: string,
 * }
 */

import { uuidSupport } from '@u'
import Layer from '../Core'

const LINEWIDTH = 3
const CHOOSE = '#494ece'
const SUCCESS = '#24b68b'
const RUNNING = '#24b68b'
const ERROR = '#ff6464'
const UNRUN = '#e8e8ef'
const COULDNOTRUN = '#BBBBC8'

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
    return RUNNING
  } else if (type === progressComp.status.FAIL) {
    return ERROR
  } else if (type === progressComp.status.UNRUN) {
    return UNRUN
  }
}

function _getStyle(lay) {
  const style = { container: {
    lineWidth: LINEWIDTH,
    strokeStyle: _getColor(lay.type || progressComp.status.UNRUN, !!lay.choose, lay.disable)
  }, content: {}, text: {}, icon: {}}
  return style
}

function path() {
  const lay = this
  const dataInput = !(lay.dataInput === false)
  const dataOutput = !(lay.dataOutput === false)
  const modelInput = !(lay.modelInput === false)
  const modelOutput = !(lay.modelOutput === false)
  const x = lay.point.x || lay.point[0]
  const y = lay.point.y || lay.point[1]

  Layer.component.rect.drawRect({

  })
}

export default progressComp
