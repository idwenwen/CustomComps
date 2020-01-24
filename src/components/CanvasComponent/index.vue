<template>
  <canvas id="canvas" width="800px" height="500px" style="width:700px;height:500px;border:1px solid #000;"/>
</template>

<script>
import Layer from './canvas/Core'

export default {
  name: 'Testing',

  data() {
    return {
      style: {
        fillStyle: 'rgba(255,165,0,0.8)'
      },
      textStyle: {
        font: '12px arial'
      },
      text: '1234123412341234123412341234',
      point: [200, 100],
      width: 100,
      height: 40
    }
  },

  mounted() {
    this.drawing()
  },

  methods: {
    drawing() {
      Layer.component.tooltip.drawTooltip({
        canvas: document.getElementById('canvas'),
        data: {
          point: this.point,
          text: this.text,
          // breakLine: this.breakLine,
          containerStyle: this.style,
          textStyle: this.textStyle,
          width: this.width,
          // angle: this.angle
          height: this.height,
          showing: true
        }
      })
    }
  }
}
</script>

<style lang="" scoped>

</style>
