<template>
  <div id="container">
    <header class="container-header">

      <div class="header-left">
        <div v-if="role === 'guest'" class="role-selection">
          <span>role:</span>
          <el-select v-model="roleSelected" class="title-selection">
            <el-option
              v-for="(item, index) in roleSelection"
              :key="index"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </div>
        <div class="features-selection" @click="showTransferDialog = !showTransferDialog">select</div>
        <transfer v-show="showTransferDialog" :all-info="features" @change="changeFeature"/>
      </div>

      <div class="header-right">
        <el-checkbox @change="coefficientChange">Correlation Coefficient</el-checkbox>
        <div class="feature-sorting">
          <i class="el-icon-s-tools"/>
        </div>
        <div class="feature-filter">
          <i class="el-icon-circle-plus"/>
        </div>
      </div>

    </header>
    <section class="content">
      <div class="content-left">
        <correlation
          :features="correlationFeatures"
          :correlation="correlationContent"
          :max="filterMax"
          :min="filterMin"
        />
      </div>
      <div class="flex flex-col space-between range-axis">
        <span v-for="(item, index) in RangeAxis" :key="index" class="range-axis-item">- {{ item }}</span>
      </div>
    </section>
  </div>
</template>

<script>
import correlation from './correlation'
export default {
  name: 'PearsonDiagram',
  components: {
    correlation
  },
  props: {
    variable: { // features for guest
      type: Array,
      default: () => []
    },
    otherVariable: { // features for host
      type: Array,
      default: () => []
    },
    nums: {
      type: Array | Object,
      default: () => []
    },
    role: {
      type: String,
      default: 'guest'
    }
  },
  data() {
    return {
      rangeStart: 1,
      rangeEnd: -1,
      rangeBetween: 0.25,

      roleSelection: [
        { label: 'all', value: 'all' },
        { label: 'guest', value: 'guest' },
        { label: 'host', value: 'host' }
      ],
      roleSelected: 'all',

      correlationFeatures: [],
      correlationContent: [],

      filterMax: 1,
      filterMin: -1,

      showTransferDialog: false
    }
  },
  computed: {

    RangeAxis() {
      const final = []
      let val = this.rangeStart
      while (val >= this.rangeEnd) {
        final.push(val)
        val -= this.rangeBetween
      }
      return final
    },

    features() {
      const final = []
      if (this.roleSelected === 'all') {
        final.push(...this.variable)
        final.push(...this.otherVariable)
      } else if (this.roleSelected === 'all') {
        final.push(...this.variable)
      } else {
        final.push(...this.otherVariable)
      }
      return final
    }
  },

  methods: {
    correlation() {
      const final = []
      const rowv = this.features
      const colv = [...this.features].reverse()
      for (let i = 0; i < colv.length; i++) {
        const row = []
        for (let j = 0; j < rowv.length; j++) {
          if (this.nums[colv[i]]) {
            row.push(this.nums[colv[i]][row[j]] || '-')
          } else if (this.nums[rowv[j]]) {
            row.push(this.nums[rowv[j]][colv[i]] || '-')
          } else {
            row.push('-')
          }
        }
        final.push(row)
      }
      this.correlationContent = final
    },

    changeFeature(data) {
      const final = []
      for (const val of data) {
        if (val.checked) {
          final.push(val.key)
        }
      }
      this.correlationFeatures = final
    }
  }
}
</script>

<style scoped lang="scss">

</style>
