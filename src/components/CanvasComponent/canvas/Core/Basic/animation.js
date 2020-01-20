import { clone } from '@u'

const animationList = {}

export default function InitAnimation(Layer) {
  // animations: {name: [{operation, time, once}]}
  Layer.prototype._InitAnimation = function({ animation }) {
    const lay = this
    lay._$animation = {}
    lay.addAniamtion(animation)
  }

  Layer.prototype.addAniamtion = function(name, operation) {
    const lay = this
    if (typeof name === 'object') {
      for (const key in name) {
        lay.addAniamtion(key, name[key])
      }
    } else {
      ((!lay._$animation[name]) && (lay._$animation[name] = []),
      (Array.isArray(operation))
        ? (lay._$animation[name].push(...operation))
        : (lay._$animation[name].push(operation)))
    }
  }

  Layer.prototype.removeAniamtion = function(name) {
    const lay = this
    lay._$animation[name] = []
  }

  Layer.prototype.startAnimation = function(name) {
    const lay = this
    !animationList[lay.$uuid] && (animationList[lay.$uuid] = {})
    animationList[lay.$uuid]['_$component'] = lay
    const animas = clone(lay._$animation[name])
    for (const val of animas) {
      val['round'] = 0
    }
    animationList[lay.$uuid][name] = animas
    startHeartBeat()
  }

  Layer.prototype.stopAnimation = function(name) {
    const lay = this
    if (animationList[lay.$uuid]) {
      delete animationList[lay.$uuid][name]
      if (Object.getOwnPropertyNames(animationList[lay]).length === 1) {
        delete animationList[lay]
      }
    }
  }
}

let heartBeat = null

function startHeartBeat() {
  const comp = Object.getOwnPropertyNames(animationList)
  if (!heartBeat && comp.length > 0) {
    heartBeat = setTimeout(beatOnce, 100)
  }
}

function beatOnce() {
  if (Object.getOwnPropertyNames(animationList).length > 0) {
    for (const key in animationList) {
      for (const type in animationList[key]) {
        if (type === '_$component') continue
        let index = 0
        for (const val of animationList[key][type]) {
          val['round']++
          if (val['round'] * 100 >= val.time) {
            const result = val.operation.call(animationList[key]['_$component'])
            if (!result) {
              animationList[key][type].splice(index, 1)
            } else {
              val['round'] = 0
            }
            index++
          }
        }
      }
    }
    heartBeat = setTimeout(beatOnce, 100)
  } else {
    heartBeat = null
  }
}

export function destoryAnimation() {
  const lay = this
  if (animationList[lay.$uuid]) {
    delete animationList[lay.$uuid]
  }
  lay._$animation = {}
}
