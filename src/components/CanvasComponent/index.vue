<template>
  <!-- <div style="width:800px; height:500px; border:1px solid #000">
    <canvas id="canvas" />
    <button @click="showText()">showing</button>
    <button @click="hideText()">hiding</button>
  </div> -->
  <div style="width:800px; height:500px; border:1px solid #000">
    <flow-diagram :dag-info="dagInfo"/>
    <button @click="changeDagInfo">changeDagInfo</button>
  </div>
</template>

<script>
// import Layer from './canvas/Core'
// import flowDiagram from './canvas/extra/flowDiagram'
// import panel from './canvas/extra/panel'
// import square from './canvas/extra/square'
import correlation from './canvas/extra/correlation'
import Layer from './canvas/Core'
import flowDiagram from './flowDiagram'
export default {
  name: 'Testing',
  components: {
    flowDiagram
  },
  data() {
    return {
      component: null,
      canvas: null,

      dagInfo: {
        component_list: [
          { component_name: 'component1', time: 1234512, status: 'success' },
          { component_name: 'component2', time: 1234512, status: 'success' },
          { component_name: 'component3', time: 34123456, status: 'fail' },
          { component_name: 'component4', time: 1623523, status: 'running' },
          { component_name: 'component_check', time: 234523 }
        ],
        component_need_run: {
          component1: false, component2: true, component3: false, component4: false, component_check: false
        },
        component_module: {
          component1: 'component', component2: 'pearson', component3: 'component', component4: 'component', component_check: 'evaluation'
        },
        dependencies: {
          component2: [
            { component_name: 'component1', type: 'data' },
            { component_name: 'component1', type: 'model' }
          ],
          component3: [
            { component_name: 'component1', type: 'data' },
            { component_name: 'component2', type: 'model' }
          ],
          component4: [
            { component_name: 'component2', type: 'model' }
          ],
          component_check: [
            { component_name: 'component3', type: 'data' },
            { component_name: 'component4', type: 'data' }
          ]
        }
      },

      features: ['x1', 'x2'],
      correlation: [[0.1234, 0.23461], [0.81368, 0.312352]]
    }
  },

  mounted() {
    // this.initing()
  },

  methods: {
    initing() {
      const vm = this
      this.canvas = new Layer.CanvasUtil(document.getElementById('canvas'))
      this.canvas.suitable()
      vm.getInstance()
      this.canvas.addEvents(this.component)
      this.component.drawing()
    },
    getInstance() {
      this.component = correlation.drawCorrelation({
        canvas: document.getElementById('canvas'),
        props: {
          point: { x: 30, y: 30 },
          width: 400,
          features: this.features,
          correlations: this.correlation
        },
        events: correlation.events
      })
    },
    changeStatus(num = 10) {
      const toPro = this.component.progress + num
      this.component.emit('progress', toPro)
    },
    setTime(num = 1) {
      const toTime = '00:00:02'
      this.component.emit('setTime', toTime)
    },
    showText() {
      this.component.emit('showContent', true)
    },
    hideText() {
      this.component.emit('showContent')
    },
    changeDagInfo() {
      this.dagInfo.component_list[3].status = 'success'
      this.dagInfo.component_list[4].status = 'running'
    }
  }
}
</script>

<style lang="" scoped>

</style>
