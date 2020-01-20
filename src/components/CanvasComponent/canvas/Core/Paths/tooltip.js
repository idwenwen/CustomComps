/**
 * state: {
 *  point: {x, y},
 *  position: enum,
 *  text: String,
 *  containerStyle: {},
 *  textStyle: {}
 *  width: Number,
 *  height: Number,
 *  showing: Boolean
 * }
 */

import { uuidSupport } from '@u'
import COMMON from './common'
import Layer from '../Basic'
import Trangle from './trangle'
import Rect from './rect'
import Text from './text'

const tooltipComp = {
  drawTooltip(obj, parent, name) {
    obj.canvas = parent ? parent._$canvas : obj.canvas
    obj.path = path
    if (parent) {
      if (!name) {
        name = uuidSupport('tooltip')
      }
      parent.drawLayer(name, obj)
      return name
    } else {
      return new Layer(obj)
    }
  },
  LEFT: COMMON.LEFT,
  RIGHT: COMMON.RIGHT,
  UP: COMMON.CENTER,
  BOTTOM: COMMON.BOTTOM
}

function path() {
  const lay = this
  if (lay.showing) {
    const x = lay.point.x || lay.point[0]
    const y = lay.point.y || lay.point[1]
    const tranglePoint = {}
    const contentPoint = {}
    let contentHeight = lay.height
    let contentWidth = lay.width
    if (lay.position === tooltipComp.RIGHT) {
      tranglePoint.x = x - COMMON.TOLLTIP_BETWEEN
      tranglePoint.y = y
      contentPoint.x = x - COMMON.TOLLTIP_BETWEEN - COMMON.TOLLTIP_TANGLE_SIZE - (lay.width - COMMON.TOLLTIP_TANGLE_SIZE) / 2
      contentPoint.y = y
      contentWidth -= COMMON.TOLLTIP_TANGLE_SIZE
    } else if (lay.position === tooltipComp.UP) {
      tranglePoint.x = x
      tranglePoint.y = y + COMMON.TOLLTIP_BETWEEN
      contentPoint.x = x
      contentPoint.y = y + COMMON.TOLLTIP_BETWEEN + COMMON.TOLLTIP_TANGLE_SIZE + (lay.height - COMMON.TOLLTIP_TANGLE_SIZE) / 2
      contentHeight -= COMMON.TOLLTIP_TANGLE_SIZE
    } else if (lay.position === tooltipComp.BOTTOM) {
      tranglePoint.x = x
      tranglePoint.y = y - COMMON.TOLLTIP_BETWEEN
      contentPoint.x = x
      contentPoint.y = y - COMMON.TOLLTIP_BETWEEN - COMMON.TOLLTIP_TANGLE_SIZE - (lay.height - COMMON.TOLLTIP_TANGLE_SIZE) / 2
      contentHeight -= COMMON.TOLLTIP_TANGLE_SIZE
    } else {
      tranglePoint.x = x + COMMON.TOLLTIP_BETWEEN
      tranglePoint.y = y
      contentPoint.x = x + COMMON.TOLLTIP_BETWEEN + COMMON.TOLLTIP_TANGLE_SIZE + (lay.width - COMMON.TOLLTIP_TANGLE_SIZE) / 2
      contentPoint.y = y
      contentWidth -= COMMON.TOLLTIP_TANGLE_SIZE
    }
    Trangle.drawTrangle({
      data: {
        point: tranglePoint,
        height: COMMON.TOLLTIP_TANGLE_SIZE,
        style: lay.containerStyle || lay.style,
        position: lay.position || COMMON.LEFT,
        fill: true
      }
    }, this)
    Rect.drawRect({
      data: {
        point: contentPoint,
        width: contentWidth,
        height: contentHeight,
        position: Rect.CENTER,
        style: lay.containerStyle || lay.style,
        fill: true
      }
    }, this)
    Text.drawText({
      data: {
        text: lay.text,
        point: contentPoint,
        width: contentWidth - COMMON.TOLLTIP_PADDING * 2,
        height: contentHeight - COMMON.TOLLTIP_PADDING * 2,
        position: Text.CENTER,
        style: lay.textStyle || lay.style
      }
    }, this)
  }
}

export default tooltipComp
