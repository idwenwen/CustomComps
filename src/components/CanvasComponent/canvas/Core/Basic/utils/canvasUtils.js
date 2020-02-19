class canvasUtil {
  constructor(canvas) {
    this.scaleTime = 1
    this.canvas = canvas
    this.holding = false
    this.moved = false
    this.originPos = null

    this.translateX = 0
    this.translateY = 0
  }
  addEvents(lay, obj) {
    const that = this
    that.canvas.addEventListener('click', function(ev) {
      if (that.moved) {
        that.moved = false
        return
      } else {
        const point = that.getPos(ev)
        lay.emit('choose', point, obj.choose.operation, ...obj.choose.attrs)
      }
    })
    that.canvas.addEventListener('mousedown', function(ev) {
      that.holding = true
      that.moved = false
    })
    that.canvas.addEventListener('mousemove', function(ev) {
      if (that.holding) {
        if (that.originPos === null) {
          that.originPos = that.getPos(ev)
        } else {
          const pos = that.getPos(ev)
          if (pos.x !== that.originPos.x || pos.y !== that.originPos.y) {
            that.moved = true
            const dx = pos.x - that.originPos.x
            const dy = pos.y - that.originPos.y
            that.translateX += dx
            that.translateY += dy
            that.originPos = pos
            lay.$ctx.translate(dx, dy)
            lay.emit('$translate', that.translateX, that.translateY)
            lay.drawing()
          }
        }
      } else {
        const pos = that.getPos(ev)
        lay.emit('showTips', pos)
      }
    })
    that.canvas.addEventListener('mouseup', function(ev) {
      that.holding = false
      that.originPos = null
    })
    that.canvas.addEventListener('mousewheel', function(ev) {
      const point = that.getPos(ev)
      const wheelDelta = ev.wheelDelta
      const nowTimes = that.scaleTime + (wheelDelta / 3000)
      const scale = nowTimes / that.scaleTime
      that.scaleTime = nowTimes
      lay.emit('scale', scale, point)
    })
  }
  suitable() {
    const parent = this.canvas.parentElement
    const style = getComputedStyle(parent)
    const originWidth = parseInt(style.width)
    const originHeight = parseInt(style.height)
    this.canvas.setAttribute('style', 'width:' + originWidth + 'px;height:' + originHeight + 'px;overflow:hidden;')
    this.canvas.setAttribute('width', originWidth)
    this.canvas.setAttribute('height', originHeight)
  }
  getPos(ev) {
    let x, y
    if (ev.layerX || ev.layerX === 0) {
      x = ev.layerX
      y = ev.layerY
    } else if (ev.offsetX || ev.offsetY === 0) {
      x = ev.offsetX
      y = ev.offsetY
    }
    return { x, y }
  }
}

export default canvasUtil
