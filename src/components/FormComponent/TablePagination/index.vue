<template>
  <div class="tpg_container">
    <header class="_tpg_header">
      <slot :data="content.data" name="header"/>
      <div v-if="!hasSearch && hasSearch !== 'none'">
        <el-input
          v-model="querySearch"
          :clearable="true"
          size="mini"
          placement="key word">
          <i slot="suffix" class="el-input__icon el-icon-date"/>
        </el-input>
      </div>
    </header>
    <main class="_tpg_main">
      <c-table ref="cTable" :content="content"/>
    </main>
    <footer class="_tpg_footer">
      <c-pagination ref="cPagination" :total="total"/>
    </footer>
  </div>
</template>

<script>
import cPagination from './PaginationTemplate'
import cTable from './TableTemplate'
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
    // Data of table
    data: {
      type: Array,
      default: () => []
    },
    // Count of data
    total: {
      type: Number,
      default: 1
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

      // Do not need request table Data if get all data
      allData: false,

      currentPage: 1,
      pageSize: 10,

      eachPage: []
    }
  },
  computed: {
  },
  methods: {
    initial() {
      // Checking out does it all data
      if (this.data.length === this.total) {
        this.allData = true
      } else {
        this.allData = false
      }
    },
    fuzzyQuery(fuzzy) {

    }
  }
}
</script>

<style lang="" scoped>

</style>
