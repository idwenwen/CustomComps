<template>
  <canvas id="canvas" />
</template>

<script>
// import Layer from './canvas/Core'
// import flowDiagram from './canvas/extra/flowDiagram'
import panel from './canvas/extra/panel'
import Layer from './canvas/Core'
export default {
  name: 'Panel',
  props: {
    progress: {
      type: Number,
      default: 0
    },
    time: {
      type: Number | String,
      default: '00:00:00'
    }
  },

  data() {
    return {
      component: null,
      canvas: null
    }
  },

  watch: {
    progress(newVal, oldVal) {
      this.changeStatus(newVal)
    },
    time(newVal, oldVal) {
      this.setTime(newVal)
    }
  },

  mounted() {
    this.initing()
  },

  methods: {
    initing() {
      const vm = this
      this.canvas = new Layer.CanvasUtil(document.getElementById('canvas'))
      this.canvas.suitable()
      vm.getInstance()
      this.component.drawing()
    },
    getInstance() {
      this.component = panel.drawPanel({
        canvas: document.getElementById('canvas'),
        props: {
          width: this.canvas.width,
          progress: this.progress,
          time: this.time,
          content: 'elapsed',
          x: (this.canvas.width * 0.3) / 2
        },
        clear: panel.clear,
        events: panel.events
      })
    },
    changeStatus(num) {
      if (num > this.component.progress) {
        this.component.emit('progress', num)
      }
    },
    setTime(time) {
      this.component.emit('setTime', time)
    }
  }
}
</script>

<style lang="" scoped>

</style>
