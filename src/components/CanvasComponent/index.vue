<template>
  <canvas id="canvas" width="800px" height="500px" style="width:700px;height:500px;border:1px solid #000;"/>
</template>

<script>
// import Layer from './canvas/Core'
import Progress from './canvas/extra/progress'
export default {
  name: 'Testing',

  data() {
    return {
      component: null,
      choose: false,
      disable: false,
      type: Progress.type.RUNNING,
      text: 'component-name',
      point: [200, 100],
      width: 200,
      height: 40
    }
  },

  mounted() {
    this.drawing()
  },

  methods: {
    drawing() {
      this.component = Progress.drawProgress({
        canvas: document.getElementById('canvas'),
        data: {
          point: this.point,
          choose: this.choose,
          disable: this.disable,
          text: this.text,
          type: this.type,
          height: this.height,
          width: this.width
        }
      })
      this.component.drawing()
    }
  }
}
</script>

<style lang="" scoped>

</style>
