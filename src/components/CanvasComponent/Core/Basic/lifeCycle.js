import { destroyOptions } from './options'
import { mergeObj } from '@u'
import { destoryAnimation } from './animation'
import { destoryEvent } from './event'

export default function InitLifeCycle(layer) {
  layer.prototype._InitLifeCycle = function({ afterInit, beforeDrawing, _parent }) {
    const lay = this
    lay._$updated = false
    lay._$destroied = false
    lay._$children = {}
    lay._$parent = _parent
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

  layer.prototype.addChild = function(name, child) {
    if (typeof name === 'object') {
      mergeObj(this._$children, name)
    } else {
      this._$children[name] = child
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
    this.updated()
  }

  layer.prototype.destory = function() {
    const lay = this
    if (lay._$parent) {
      lay._$parent.removeChild(lay.$uuid)
    }
    destroyOptions.call(lay)
    destoryEvent.call(lay)
    destoryAnimation.call(lay)
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
