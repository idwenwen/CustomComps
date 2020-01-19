import { callHook } from './lifeCycle'

export default function InitDrawing(Layer) {
  Layer.prototype._InitDrawing = function() {
    callHook.call(this, 'beforeDrawing')
    if (!this._$parent) {
      drawing.call(this)
    }
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
  clearDrawing.call(lay)
  lay._$path()
  if (Object.getOwnPropertyNames(lay._$children).length > 0) {
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

function clearDrawing() {
  const lay = this
  if (lay._$clear) {
    lay._$clear()
  } else if (lay.$actualWidth && lay.$actualHeight) {
    lay.$ctx.clearRect(0, 0, lay.$actualWidth, lay.$actualHeight)
  }
}
