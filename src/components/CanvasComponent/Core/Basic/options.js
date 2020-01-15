import { callHook } from './lifeCycle'

/**
 * Initing options for drawing component including
 * @param {canvas, data, path} Layer
 */
export default function InitOptions(Layer) {
  Layer.prototype._InitOptions = function(props) {
    const lay = this
    lay.setProps(props)
    callHook.call(lay, 'afterInit')
  }

  Layer.prototype.setUUID = function() {
    const lay = this
    if (lay.$uuid) {
      initUUID.call(lay)
    }
  }

  Layer.prototype.setCanvas = function(canvas) {
    const lay = this
    lay._$canvas = canvas
    lay.$ctx = canvas.getContext('2d')
    lay.updated()
  }

  Layer.prototype.setData = function(obj) {
    const lay = this
    const add = {}
    for (const key in obj) {
      lay[key] ? (lay[key] = obj[key]) : (add[key] = obj[key])
    }
    initData.call(lay, add)
  }

  Layer.prototype.setPath = function(newPath) {
    const lay = this
    lay._$path = newPath
    lay.updated()
  }

  Layer.prototype.setClear = function(clear) {
    const lay = this
    lay._$clear = clear
  }

  Layer.prototype.setZIndex = function(zIndex) {
    const lay = this
    lay.$zIndex = zIndex
  }

  // Setting Actual displaying-width
  Layer.prototype.setWidth = function(aw) {
    const lay = this
    lay.$actualWidth = aw
  }

  // Setting Actual displaying-height
  Layer.prototype.setHeigth = function(ah) {
    const lay = this
    lay.$actualHeight = ah
  }

  Layer.prototype.setMetas = function(name, key) {
    const lay = this
    if (!lay.$metas) lay.meta = {}
    if (typeof name === 'object') {
      const obj = name
      for (const key in obj) {
        lay.metas[key] = obj[key]
      }
    } else {
      lay.$metas[name] = key
    }
  }

  Layer.prototype.setProps = function({ canvas, data = {}, path, clear = () => {}, zIndex = 0 }) {
    const lay = this
    lay.$metas = {}
    lay.setUUID()
    lay.setCanvas(canvas)
    lay.setData(data)
    lay.setPath(path)
    lay.setClear(clear)
    lay.setZIndex(zIndex)
    lay.updated()
  }
}

// Setting UUID for drawing components
function initUUID() {
  const now = new Date().getTime().toString().substr(-7)
  const ran = Math.random() * 100
  this.$uuid = 'canvas_' + now + '_' + ran
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
