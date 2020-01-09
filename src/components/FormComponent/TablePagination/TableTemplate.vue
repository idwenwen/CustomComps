<script>
import { clone } from '@u'
export default {
  name: 'TableTemplate',

  props: {
    /**
     * Attribute for each column。
     * format:
     *  attr: {
     *    columns: [{item just like follow}],
     *    data: Object
     *    maxHeight: String|Number,
     *    border: Boolean,
     *    fit: Boolean,
     *    hightlight: Boolean,
     *    rowClassName: Function,
     *    cellClassName: Function,
     *    cellStyle: Function,
     *    headerRowClassName: Function,
     *    headerRowStyle: Function,
     *    headerCellClassName: Function,
     *    headerCellStyle: Function,
     *    emptyText: String,
     *    tooltip: light/dark,
     *    size: [medium|small|mini]
     *    type: 'index|selection|none' | false | true => index | Function for index
     *  }
     *  columns: {
     *    label: String,
     *    prop: String,
     *    filters: [{text, value}],
     *    filterMultiple: Boolean,
     *    filterMethod: Function,
     *    sortable: boolean|'customer'
     *    fixed: String | Boolean,
     *    overFlow: Boolean,
     *    align: string,
     *    className:  String,
     *    ... just like el-table
     *    slot: { name: function(prop, createElement){}, name:true }
     *  }
     */
    tableattr: {
      type: Object,
      default: () => {}
    },
    datas: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      // default linking style
      defaultLinkingStyle: {
        color: '#409eff',
        cursor: 'pointer'
      },
      // Default attribute for table
      defaultTableSetting: {
        border: false,
        fit: false,
        highlightCurrentRow: true,
        rowClassName: '_table_body_row',
        cellClassName: '_table_body_cell',
        headerCellClassName: '_table_header_cell',
        headerRowClassName: '_table_header_row',
        emptyText: 'No Data',
        tooltip: 'light',
        size: 'mini',
        type: true
      },

      // loading for component
      loading: false
    }
  },
  computed: {
    tableRef() {
      const now = new Date().getTime().toString().substr(-7)
      let rand = parseInt(Math.random() * 1000).toString()
      if (rand.length <= 2) {
        rand += new Array(3 - rand.length).fill(0).join()
      }
      return 'el-table_' + now + '_' + rand
    },
    columnsAttr() {
      const final = this._mergeObj(this.defaultTableSetting, this.tableattr)
      return final
    }
  },

  methods: {
    _mergeObj(...objs) {
      const final = {}
      if (!objs || objs.length === 0) {
        return final
      }
      for (const val of objs) {
        for (const key in val) {
          const mid = val[key]
          if (typeof mid === 'object') {
            final[key] = clone(mid)
          } else if (mid) {
            final[key] = mid
          }
        }
      }
      return final
    },

    // Operating function of el-table
    calling(opera, ...args) {
      const comps = this.$refs[this.tableRef]
      if (Array.isArray(comps)) {
        for (const val of comps) {
          val[opera](...args)
        }
      } else {
        comps[opera](...args)
      }
    },
    startLoaing() {
      this.loading = true
    },
    endLoading() {
      this.loading = false
    },

    /** *** Drawing Function *** **/
    // Initing Attribute of el-table
    tableAttribute() {
      const attr = { props: {}, on: this.$listeners, ref: this.tableRef }
      // Setting props for el-table
      for (const key in this.columnsAttr) {
        if (key === 'columns') continue
        else {
          attr.props[key] = this.columnsAttr[key]
        }
      }
      attr.props.directives = [
        {
          name: 'loading',
          value: this.loading
        }
      ]
      attr.props.data = this.datas
      return attr
    },

    // Initing each column attribute
    columnAttribute(col, createElement) {
      const vm = this
      const attr = { props: {}, scopedSlots: {}}
      for (const key in col) {
        if (key === 'slot') {
          for (const name in col[key]) {
            if (typeof col[key][name] !== 'function') {
              attr.scopedSlots[name] = (prop) => {
                return vm.linkingSlot(prop, createElement)
              }
            } else {
              attr.scopedSlots[name] = (prop) => {
                return col[key][name](prop, createElement)
              }
            }
          }
        } else {
          attr.props[key] = col[key]
        }
      }
      return attr
    },

    // Pre-setting linking slot
    linkingSlot(prop, createElement) {
      const vm = this
      const attr = {}
      attr.style = this.defaultLinkingStyle
      attr.on = {
        click: (ev) => {
          vm.$emit('linking-click', ev, prop)
        }
      }
      return createElement('span', attr, prop.row[prop.column.property])
    }
  },

  render(h) {
    const columns = []
    for (const val of this.columnsAttr.columns) {
      columns.push(h('el-table-column', this.columnAttribute(val, h), []))
    }
    return h(
      'el-table', this.tableAttribute(), columns)
  }
}
</script>

<style lang="scss">
  ._table_header_row {
    font-size: 1.12rem;
    font-family: 'Lato';
    color: #7F7D8E;
    border-bottom: 1px solid #fff !important;
    ._table_header_cell {
      border: 1px solid #fff;
      background-color: rgba(73,78,206, 0.2);
    }
  }

  ._table_body_row {
    font-size: 1.12rem;
    font-family: 'Lato';
    color: #7F7D8E;
    border-bottom: 1px solid #fff !important;
    td:first-child {
      background-color: #E8E8EF;
    }
    ._table_body_cell {
      border: 1px solid #fff;
      background-color: #F8F8FA;
    }
  }

  .current-row{
    td{
      background-color: rgba(255,129,3,0.2) !important;
    }
  }
</style>
