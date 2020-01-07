function clone(obj) {
  if (typeof obj === 'object') {
    return JSON.parse(JSON.stringify(obj))
  }
}

function fontToPx(size, el) {
  if (size.match(/rem$/)) {
    return parseInt(getComputedStyle(document.getElementsByTagName('html')[0]).fontSize) * parseFloat(size) + 'px'
  } else if (size.match(/px$/)) {
    return size
  } else if (size.match(/em$/)) {
    return parseInt(getComputedStyle(el.parentElement).fontSize) * parseFloat(size) + 'px'
  } else {
    return 0 + 'px'
  }
}

function getActualFontSize(txt, fontsize, fontname) {
  let canvas = document.getElementById('__for_calculate_canvas')
  if (!canvas) {
    canvas = document.createElement('canvas')
    canvas.id = '__for_calculate_canvas'
    canvas.style.display = 'none'
    document.body.appendChild(canvas)
  }
  const ctx = canvas.getContext('2d')
  ctx.font = fontsize + ' ' + fontname
  return ctx.measureText(txt).width
}

function colorRgb(color, opacity) {
  let sColor = color.toLowerCase()
  const reg = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/
  if (sColor && reg.test(sColor)) {
    if (sColor.length === 4) {
      let sColorNew = '#'
      for (let i = 1; i < 4; i += 1) {
        sColorNew += sColor.slice(i, i + 1).concat(sColor.slice(i, i + 1))
      }
      sColor = sColorNew
    }
    const sColorChange = []
    for (let i = 1; i < 7; i += 2) {
      sColorChange.push(parseInt('0x' + sColor.slice(i, i + 2)))
    }
    return 'rgba(' + sColorChange.join(',') + ',' + opacity + ')'
  }
  return sColor
}

export { clone, fontToPx, getActualFontSize, colorRgb }
