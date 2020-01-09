<template>
  <div class="tpg_container">
    <header class="_tpg_header">
      <slot :datas="datas" name="header"/>
      <div v-if="!hasSearch && hasSearch !== 'none'" class="_tpg_search">
        <el-input
          v-model="querySearch"
          :clearable="true"
          size="small"
          placement="key word">
          <i slot="suffix" class="el-input__icon el-icon-search"/>
        </el-input>
      </div>
    </header>
    <main class="_tpg_main">
      <c-table
        ref="cTable"
        :tableattr="attrs"
        :datas="displayData"
        v-on="$listeners"/>
    </main>
    <footer class="_tpg_footer">
      <c-pagination
        ref="cPagination"
        :total="total"
        @current-change="currentChange"
        @size-change="sizeChange"/>
    </footer>
  </div>
</template>

<script>
import cPagination from './PaginationTemplate'
import cTable from './TableTemplate'
import { clone } from '@u'
export default {
  name: 'TablePagination',
  components: {
    cPagination,
    cTable
  },
  props: {
    // Attribue of table with data
    attrs: {
      type: Object,
      default: () => {}
    },
    // Datas of table
    datas: {
      type: Array,
      default: () => []
    },
    // Has Searching chooses: [ fuzzy(true) | correct | none(false) ]
    hasSearch: {
      type: String | Boolean,
      default: false
    },
    // choosable: one | all
    // One means highlight match row
    // All means showing all matched row
    searchWay: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      querySearch: '',

      total: 0,
      currentPage: 0,
      pageSize: 0
    }
  },
  computed: {
    displayData() {
      const final = []
      const start = this.pageSize * (this.currentPage - 1)
      for (let i = 0; i < this.pageSize; i++) {
        if (this.datas[start + i]) {
          final.push(clone(this.datas[start + i]))
        } else {
          break
        }
      }
      return final
    }
  },

  created() {
    this.initial()
  },
  methods: {
    initial() {
      // Checking out does it all data
      this.total = this.datas.length
      this.currentPage = 1
      this.pageSize = 10
    },
    currentChange(val) {
      this.currentPage = val
    },
    sizeChange(val) {
      this.pageSize = val
    },
    fuzzyQuery(fuzzy) {

    }
  }
}
</script>

<style lang="scss" scoped>
.tpg_container {
  display: flex;
  flex-direction: column;
  padding: 10px 0px;
  border-bottom: 1px solid #E8E8EF;
  ._tpg_header {
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    width: 100%;
    margin-bottom: 10px;
    ._tpg_search {
      max-width: 20%;
    }
  }
  ._tpg_main {
    max-width: 100%;
    margin-bottom: 10px;
  }
  ._tpg_footer {
    max-width: 100%;
  }
}
</style>
