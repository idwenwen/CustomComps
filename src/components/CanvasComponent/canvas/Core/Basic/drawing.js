import { callHook } from './lifeCycle'

export default function InitDrawing(Layer) {
  Layer.prototype.drawing = function() {
    callHook.call(this, 'beforeDrawing')
    drawing.call(this)
  }

  // Setting children layer
  Layer.prototype.drawLayer = function(name, operation) {
    const lay = this
    let op = operation
    if (typeof operation === 'function') {
      op = { canvas: this._$canvas, path: operation }
    }
    op._parent = lay
    if (!lay._$children[name]) {
      lay.addChild(name, new Layer(op))
    } else {
      lay._$children[name].setProps(op)
    }
  }

  Layer.prototype.reDrawing = function(force) {
    const lay = this
    if (force) {
      lay.updated()
    }
    if (lay._$updated) {
      drawing.call(lay)
    }
  }
}

function drawing() {
  const lay = this
  const drawingList = []
  if (lay._$updated) {
    clearDrawing.call(lay)
    let props = Object.getOwnPropertyNames(lay._$children)
    if (props.length === 0 || props[0] === '__ob__') { // It is empty or just have __ob__ property in vue
      typeof lay.$translate === 'function' && lay.$translate()
      lay._$path()
    }
    props = Object.getOwnPropertyNames(lay._$children)
    if ((props.length >= 2) || (props.length === 1 && props[0] !== '__ob__')) {
      if (lay.$visable) {
        for (const key in lay._$children) {
          drawingList.push({ name: key, index: lay._$children[key].$zIndex })
        }
        drawingList.sort((a, b) => {
          if (a.index < b.index) {
            return -1
          } else if (a.index > b.index) {
            return 1
          } else {
            return 0
          }
        })
        for (const val of drawingList) {
          drawing.call(lay._$children[val.name])
        }
      }
    }
    lay._$updated = false
  }
}

function clearDrawing() {
  const lay = this
  if (lay._$clear) {
    lay._$clear()
  } else if (lay.$actualWidth && lay.$actualHeight) {
    lay.$ctx.clearRect(0, 0, lay.$actualWidth, lay.$actualHeight)
  }
}
