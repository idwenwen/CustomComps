<template>
  <div id="container">
    <canvas id="correlationTable"/>
    <div id="buttonList">
      <div class="opera_btn" @click="suitableWhole">
        <i class="el-icon-full-screen"/>
      </div>
      <div class="opera_btn" @click="bigger">
        <i class="el-icon-plus"/>
      </div>
      <div class="opera_btn" @click="small">
        <i class="el-icon-minus"/>
      </div>
    </div>
  </div>
</template>

<script>
import Pearson from '../canvas/extra/correlation'
import Layer from '../canvas/Core'

export default {
  name: 'CorrelationTable',
  props: {
    features: {
      type: Array,
      default: () => []
    },
    correlation: {
      type: Array,
      default: () => []
    },
    max: {
      type: Number,
      default: 1
    },
    min: {
      type: Number,
      default: -1
    }
  },
  data() {
    return {
      canvas: null,
      component: null,
      containerPadding: 5,
      needChangeCorrelation: false,
      correlationDisable: {}
    }
  },
  watch: {
    'features': {
      handler() {
        let newOne = false
        if (!this.canvas || !this.canvas.inited) {
          this.initing()
        }
        if (this.needChangeCorrelation) {
          if (this.features.length === this.correlation.length) {
            newOne = true
            this.getInstance(this.canvas.canvasDom)
          }
        }
        if (!newOne && this.component && this.features.length <= this.correlation.length) {
          this.component.emit('newFeatures', this.features)
        }
      },
      deep: true
    },
    'correlation': {
      handler() {
        if (!this.canvas || !this.canvas.inited) {
          this.initing()
        } else if (this.correlation.length === this.features.length) {
          this.getInstance(this.canvas.canvasDom)
        } else {
          this.needChangeCorrelation = true
        }
      }
    },
    min: {
      handler() {
        this.component.emit('filter', this.max, this.min)
      }
    },
    max: {
      handler() {
        this.component.emit('filter', this.max, this.min)
      }
    }
  },
  mounted() {
    this.initing()
  },
  methods: {
    initing() {
      const that = this
      const can = document.getElementById('correlationTable')
      if (!can) {
        return false
      }
      this.canvas = new Layer.CanvasUtil(
        can,
        { click: false },
        () => {
          that.getInstance(can)
          return that.component
        }
      )
    },
    checkPos(can) {
      let width = can.width - this.containerPadding
      const height = can.height - this.containerPadding
      if (height < width) {
        width = height
      }
      const point = { x: (can.width - width) / 2, y: (can.height - width) / 2 }
      return { totalWidth: width, point }
    },
    getInstance(can) {
      if (this.component) {
        this.component.deleteAllAboutChain()
      }
      const style = this.checkPos(can)
      this.component = Pearson.drawCorrelation({
        canvas: can,
        props: {
          features: this.features,
          correlations: this.correlation,
          width: style.totalWidth,
          point: style.point,
          max: this.max,
          min: this.min
        },
        events: Pearson.events
      })
      this.component.drawing()
      if (this.canvas) {
        this.canvas.lay = this.component
      }
      this.needChangeCorrelation = false
    },
    suitableWhole() {
      const that = this
      this.canvas.suitableForWhole(() => {
        const lay = that.component
        const clear = lay.$meta.get('clear')
        return { width: clear.width, height: clear.width, point: clear.point }
      }, () => {
        const style = that.checkPos(this.canvas.canvasDom)
        that.component.point = style.point
        that.component._inited = false
      }, that.containerPadding / 2)
    },
    bigger() {
      this.canvas.scaleBigger()
    },
    small() {
      this.canvas.scaleSmaller()
    },
    showText() {
      this.component.emit('showContent', true)
    },
    hideText() {
      this.component.emit('showContent')
    }
  }
}
</script>

<style scoped lang="scss">
  #container{
    width: 100%;
    height: 100%;
    position: relative;
  }
  #buttonList {
    position: absolute;
    bottom: 10px;
    left: 10px;
    display: flex;
    flex-direction: column;
    .opera_btn {
      width: 32px;
      height: 32px;
      border-radius: 4px;
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: #F8F8FA;
      margin-bottom: 12px;
      color: #BBBBC8;
      &:hover {
        background-color: #494ece;
        color: #fff;
      }
      &:last-child {
        margin-bottom: 0px;
      }
    }
  }
</style>
