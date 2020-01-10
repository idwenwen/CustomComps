import { callHook } from './lifeCycle'

let COUNT = 1

/**
 * Initing options for drawing component including
 * @param {canvas, data, path} layer
 */
export default function InitOptions(layer) {
  layer.prototype._InitOptions = function({ canvas, data, path, clear, zIndex = false }) {
    COUNT++
    const lay = this
    initUUID.call(lay)
    initCanvas.call(lay, canvas)
    initData.call(lay, data)
    initPath.call(lay, path)
    initClear.call(lay, clear)
    initZIndex.call(lay, zIndex)
    initMetas.call(lay)
    callHook.call(lay, 'afterInit')
  }

  layer.prototype.setLayer = function(obj) {
    const lay = this
    const add = {}
    for (const key in obj) {
      lay[key] ? (lay[key] = obj[key]) : (add[key] = obj[key])
    }
    initData.call(lay, add)
  }

  layer.prototype.setPath = function(newPath) {
    initPath(newPath)
  }

  // Setting Actual displaying-width
  layer.prototype.setWidth = function(aw) {
    const lay = this
    lay.$actualWidth = aw
  }

  // Setting Actual displaying-height
  layer.prototype.setHeigth = function(ah) {
    const lay = this
    lay.$actualHeight = ah
  }

  layer.prototype.setMetas = function(name, key) {
    const lay = this
    if (typeof name === 'object') {
      const obj = name
      for (const key in obj) {
        lay.metas[key] = obj[key]
      }
    } else {
      lay.$metas[name] = key
    }
  }
}

// Setting UUID for drawing components
function initUUID() {
  const now = new Date().getTime().toString().substr(-7)
  const ran = Math.random() * 100
  this.$uuid = COUNT + '_' + now + '_' + ran
}

function initCanvas(canvas) {
  const lay = this
  lay._$ctx = canvas.getContext('2d')
  lay.updated()
}

// Initing data for this
function initData(data) {
  if (Object.getOwnPropertyNames(data).length > 0) {
    const lay = this
    lay._$data = lay._$data ? mergeObj(lay._$data, data) : data
    for (const key in data) {
      Object.defineProperty(lay, key, {
        enumerable: false,
        configurable: true,
        set: function(newValue) {
          if (!equal(lay._$data[key], newValue)) {
            lay._$data[key] = newValue
            lay.updated() // After changeing value Diagram need to be updated
          }
        },
        get: function() {
          return lay._$data[key]
        }
      })
    }
    lay.updated() // After adding props,component should be redrawed
  }
}

function initPath(path) {
  const lay = this
  lay._$path = path
  lay.updated()
}

function initClear(clear) {
  const lay = this
  lay._$clear = clear
}

function initZIndex(index) {
  const lay = this
  lay.$zIndex = index
}

function initMetas() {
  const lay = this
  lay.$metas = {}
}

function mergeObj(...obj) {
  const final = {}
  if (obj.length > 0) {
    for (const val of obj) {
      for (const key in val) {
        final[key] = val[key]
      }
    }
  }
  return final
}

function equal(valOne, valTwo) {
  if (valOne === valTwo) {
    return true
  } else if (typeof valOne === 'object' && typeof valTwo === 'object') {
    const leng1 = Object.getOwnPropertyNames(valOne)
    const leng2 = Object.getOwnPropertyNames(valTwo)
    if (leng1 === leng2) {
      for (const key in valOne) {
        if (!valTwo[key] || valTwo[key] !== valOne[key]) {
          return false
        }
      }
      return true
    } else {
      return false
    }
  } else {
    return false
  }
}

export function destroyOptions() {
  const lay = this
  for (const key of lay._$data) {
    delete lay[key]
  }
  delete lay._$data
}
