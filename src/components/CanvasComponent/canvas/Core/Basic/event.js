export default function InitEvents(Layer) {
  Layer.prototype._InitEvents = function({ event }) {
    const lay = this
    lay._$event = {}
    lay._$eventConnected = {}
    lay.addEvent(event)
  }

  Layer.prototype.emit = function(eventType, propragation = true, ...props) {
    const lay = this
    const eves = lay._$event[eventType]
    if (eves) {
      for (const val of eves) {
        val.call(lay, propragation, ...props)
      }
    }
  }

  Layer.prototype.addEvent = function(eventType, operation) {
    const lay = this
    if (typeof eventType === 'object') {
      for (const key in eventType) {
        lay.addEvent(key, eventType[key])
      }
    } else {
      if (!lay._$event[eventType]) {
        lay._$event[eventType] = []
        lay._$eventConnected[eventType] = false
      }
      if (Array.isArray(operation)) {
        if (lay._$eventConnected[eventType]) {
          for (const val of operation) {
            lay._$event[eventType].splice(-1, 0, val)
          }
        } else {
          lay._$event[eventType].push(...operation)
        }
      } else {
        if (lay._$eventConnected[eventType]) {
          lay._$event[eventType].splice(-1, 0, operation)
        } else {
          lay._$event[eventType].push(operation)
        }
      }
    }
  }

  Layer.prototype.removeEvent = function(eventType) {
    const lay = this
    lay._$event[eventType] = []
  }

  Layer.prototype.getEventTypes = function() {
    const lay = this
    const final = []
    for (const key in lay._$event) {
      final.push(key)
    }
    return final
  }

  Layer.prototype._ConnectToChild = function() {
    const lay = this
    const eve = lay.getEventTypes().join(',')
    for (const key in lay._$children) {
      const childEve = lay._$children[key].getEventTypes()
      for (const val of childEve) {
        if (!eve.match(val)) {
          lay._$event[val] = []
          lay._$eventConnected[val] = false
        }
        if (!lay._$eventConnected[val]) {
          lay._$event[val].push(function(propragation, ...props) {
            if (!propragation) return
            for (const key in lay._$children) {
              lay._$children[key].emit(val, propragation, ...props)
            }
          })
          lay._$eventConnected[val] = true
        }
      }
    }
  }
}

export function destoryEvent() {
  const lay = this
  lay._$event = {}
  lay._$eventConnected = {}
}
