import { toRGBA } from './index'

// translate
export function rotate(ctx, center, angle) {
  const x = center.x || center[0]
  const y = center.y || center[1]
  ctx.translate(x, y)
  ctx.rotate(angle)
  ctx.translate(-x, -y)
}

/**
 * change: {
 *  key: {
 *    to: finalValue,
 *    operation: between|function,
 *    time: number | 100
 * }
 */
export function fromTo(lay, name, changes) {
  const animationList = []
  for (const key in changes) {
    animationList.push({
      operation: () => {
        const keys = typeof key === 'string' ? key.split('.') : [key]
        let rootObj = null
        let option = null
        for (let i = 0; i < keys.length - 1; i++) {
          if (i === 0) {
            rootObj = JSON.parse(JSON.stringify(lay[keys[i]]))
            option = rootObj
          } else {
            option = option[keys[i]]
          }
        }
        if (typeof changes[key].operation === 'function') {
          option[keys[keys.length - 1]] = changes[key].operation(option[keys[keys.length - 1]])
        } else if (typeof changes[key].to === 'number') {
          option[keys[keys.length - 1]] = option[keys[keys.length - 1]]
        } else if (changes[key].to.match(/(rba|rgba|#([a-z]|[A-Z]|[0-9]){6})/)) {
          option[keys[keys.length - 1]] = gradual(option[keys[keys.length - 1]], changes[key].to, changes[key].between)
        }
        lay[keys[0]] = rootObj
        if (option[keys[keys.length - 1]] === changes[key].to) {
          return false
        }
      },
      time: changes[key].time || 100
    })
  }
  lay.addAniamtion(name, animationList)
}

export function gradual(from, to, search) {
  const fromColor = toRGBA(from).replace('rgba(', '').replace(')', '').split(',')
  const toColor = toRGBA(to).replace('rgba(', '').replace(')', '').split(',')
  const final = []
  for (let i = 0; i < 4; i++) {
    if (i === 3) {
      if (fromColor[i] && !toColor[i]) {
        if (+fromColor[i] < 1) {
          final.push((+fromColor[i] + 0.1 >= 1 ? 1 : +fromColor[i] + 0.1))
        } else {
          final.push(1)
        }
        break
      } else if (!fromColor[i] && toColor[i]) {
        if (+toColor[i] < 1) {
          final.push((1 - 0.1 <= +toColor[i] ? +toColor[i] : 1 - 0.1))
        } else {
          final.push(1)
        }
        break
      } else if (!fromColor[i] && !toColor[i]) {
        final.push(1)
        break
      }
    }
    if (+fromColor[i] > +toColor[i]) {
      final.push(+fromColor[i] - search <= +toColor[i] ? +toColor[i] : +fromColor[i] - search)
    } else if (+fromColor[i] > +toColor[i]) {
      final.push(+fromColor[i] + search >= +toColor[i] ? +toColor[i] : +fromColor[i] + search)
    } else {
      final.push(+toColor[i])
    }
  }
  return 'rgba(' + final.join(',') + ')'
}
