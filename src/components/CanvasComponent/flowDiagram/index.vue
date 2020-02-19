<template>
  <canvas id="flowDiagram"/>
</template>

<script>
import flowDiagram from '../canvas/extra/flowDiagram'
import Layer from '../canvas/Core'

export default {
  name: 'FlowDiagram',
  props: {
    dagInfo: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      dagCheck: null,
      flowData: null,
      images: null
    }
  },
  watch: {
    dagInfo: {
      handler() {
        this.checkInfo()
        this.toSetting()
      },
      deep: true
    }
  },
  created() {
    this.checkInfo()
    this.checkFlowData()
  },
  mounted() {
    this.initing()
  },

  methods: {
    initing() {
      const that = this
      this.initImage([
        {
          name: 'Complete',
          url: require('./icons/complete.svg')
        },
        {
          name: 'disable_Complete',
          url: require('./icons/disable_complete.svg')
        },
        {
          name: 'Success',
          url: require('./icons/complete.svg')
        },
        {
          name: 'disable_Success',
          url: require('./icons/disable_complete.svg')
        },
        {
          name: 'Fail',
          url: require('./icons/error.svg')
        },
        {
          name: 'disable_Fail',
          url: require('./icons/disable_error.svg')
        },
        {
          name: 'Error',
          url: require('./icons/error.svg')
        },
        {
          name: 'disable_Error',
          url: require('./icons/disable_error.svg')
        }
      ], () => {
        that.canvas = new Layer.CanvasUtil(document.getElementById('flowDiagram'))
        that.canvas.suitable()
        that.getInstance()
        that.canvas.addEvents(that.component, {
          choose: {
            operation: (name, here) => {
              let dataIndex = 0
              that.dagInfo.map((item, index) => {
                if (item.component_name === name) {
                  dataIndex = index
                }
              })
              const obj = { name, dataIndex, model: that.dagInfo.component_module[name], disable: that.dagInfo.component_need_run[name] }
              if (here) {
                that.$emit('choose', obj)
              }
            }
          }
        })
        that.component.drawing()
        that.toSetting()
      })
    },
    getInstance() {
      this.component = flowDiagram.drawDiagram({
        canvas: document.getElementById('flowDiagram'),
        props: {
          dagInfo: this.flowData
        },
        clear: flowDiagram.clear,
        events: flowDiagram.events
      })
    },
    checkInfo() {
      const final = {}
      for (const item of this.dagInfo.component_list) {
        const status = item.status || 'unrun'
        final[item.component_name] = { status: status.charAt(0).toUpperCase() + status.slice(1) }
      }
      for (const key in this.dagInfo.component_need_run) {
        final[key].disable = this.dagInfo.component_need_run[key]
      }
      this.dagCheck = final
    },
    checkFlowData() {
      const final = JSON.parse(JSON.stringify(this.dagInfo))
      for (const item of final.component_list) {
        item.status = 'unrun'
      }
      this.flowData = final
    },
    toSetting() {
      for (const key in this.dagCheck) {
        this.component.emit('to' + this.dagCheck[key].status,
          key,
          this.images.get((this.dagCheck[key].disable ? 'disable_' : '') + this.dagCheck[key].status))
      }
    },
    initImage(arr, callback) {
      const that = this
      return new Promise(function(resolve, reject) {
        let complete = 0
        const images = new Map()
        for (const val of arr) {
          (function() {
            const v = val
            const img = new Image()
            img.onload = function() {
              images.set(v.name, img)
              complete += 1
              if (complete === arr.length) {
                that.images = images
                callback(images)
                resolve(images)
              }
            }
            img.src = v.url
          })()
        }
      })
    }
  }
}
</script>

<style scoped>

</style>
