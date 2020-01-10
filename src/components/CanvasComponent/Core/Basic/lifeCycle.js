import { destroyOptions } from './options'

export default function InitLifeCycle(layer) {
  layer.prototype._InitLifeCycle = function({ afterInit, beforeDrawing }) {
    const lay = this
    lay._$updated = false
    lay._$destroied = false
    lay._$children = []
    lay._$parent = null
    lay.$afterInit = afterInit
    lay.$beforeDrawing = beforeDrawing
  }

  layer.prototype.updated = function() {
    const lay = this
    if (!this._$updated) {
      lay._$updated = true
      for (const val of lay._$children) {
        val.updated()
      }
      lay._$parent && lay._$parent.updated()
    }
  }

  layer.prototype.setParent = function(parent) {
    this._$parent = parent
  }

  layer.prototype.addChild = function(child) {
    if (Array.isArray(child)) {
      this._$children.push(...child)
    } else {
      this._$children.push(child)
    }
  }

  layer.prototype.removeChild = function(childUUID) {
    this._$children.filter((item) => {
      if (Array.isArray(childUUID)) {
        for (const val of childUUID) {
          if (val === item.$uuid) {
            return false
          }
        }
        return true
      } else {
        if (item.$uuid === childUUID) {
          return false
        }
        return true
      }
    })
  }

  layer.prototyperoy = function() {
    destroyOptions.call(this)
  }
}

export function callHook(name) {
  const lay = this
  if (lay['$' + name]) {
    lay['$' + name]()
  } else {
    // Will throw out an exception
    return false
  }
}
