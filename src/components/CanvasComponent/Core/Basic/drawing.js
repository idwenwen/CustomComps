import { callHook } from './lifeCycle'

export default function InitDrawing(layer) {
  layer.prototype._InitDrawing = function() {
    callHook.call(this, 'beforeDrawing')
    drawing.call(this)
  }

  // operation may be a function or an object
  layer.prototype.drawLayer = function(operation) {
    // TODO
  }

  layer.prototype.reDrawing = function(force) {
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
  // TODO
}
