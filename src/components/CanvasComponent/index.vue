<template>
  <canvas id="canvas" width="800px" height="500px" style="width:700px;height:500px;border:1px solid #000;"/>
</template>

<script>
import Layer from './Core'

export default {
  name: 'Testing',

  data() {
    return {
      style: {
        font: '16px arial'
      },
      text: '1234123412341234123412341234',
      point: [200, 100],
      breakLine: 2,
      angle: 45 * Math.PI / 180,
      width: 40
    }
  },

  mounted() {
    this.drawing()
  },

  methods: {
    drawing() {
      Layer.component.text.drawText({
        canvas: document.getElementById('canvas'),
        data: {
          point: this.point,
          text: this.text,
          // breakLine: this.breakLine,
          style: this.style,
          // width: this.width,
          angle: this.angle
        }
      })
    }
  }
}
</script>

<style lang="" scoped>

</style>
