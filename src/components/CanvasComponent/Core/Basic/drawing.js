import { callHook } from './lifeCycle'

export default function InitDrawing(Layer) {
  Layer.prototype._InitDrawing = function() {
    callHook.call(this, 'beforeDrawing')
    drawing.call(this)
  }

  // Setting children layer
  Layer.prototype.drawLayer = function(name, operation) {
    const lay = this
    if (!lay._$children[name]) {
      lay._$children.push(new Layer(operation))
    } else {
      lay._$children[name].setProps(operation)
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
  // TODO
}
