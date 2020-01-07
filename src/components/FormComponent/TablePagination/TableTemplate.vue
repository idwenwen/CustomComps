<script>
import { colorRgb, clone } from '@u'
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
        data: {},
        border: true,
        fit: false,
        hightlight: true,
        cellStyle: this._defaultCellStyle,
        emptyText: 'No Data',
        tooltip: 'light',
        size: 'mini',
        type: true
      }
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
      debugger
      const final = this._mergeObj(this.defaultTableSetting, this.tableattr)
      return final
    }
  },

  methods: {
    _defaultCellStyle({ row, column, rowIndex, columnIndex }) {
      const style = {
        'background-color': '#F8F8FA',
        'font-size': '1.12rem',
        'font-family': 'Lato',
        'color': '#7F7D8E'
      }
      if (rowIndex === 0) {
        style['background-color'] = colorRgb('#494ECE', 0.2)
      } else if (columnIndex === 0) {
        style['abckground-color'] = '#E8E8EF'
      }
      return style
    },

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
      return attr
    },

    // Initing each column attribute
    columnAttribute(col, createElement) {
      const vm = this
      const attr = { props: {}, scopedSlots: {}}
      for (const key in col) {
        if (key === 'slot') {
          for (const name in col[key]) {
            if (typeof col[key] !== 'function') {
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
      const attr = { props: {}, on: {}}
      attr.props.style = this.defaultLinkingStyle
      attr.on.click = (pos) => {
        vm.$emit('linkingClick', pos)
      }
      return createElement('span', attr, prop.row[prop.column.property])
    }
  },

  render(h) {
    debugger
    const columns = []
    for (const val of this.columnsAttr.columns) {
      columns.push(this.columnAttribute(val, h))
    }
    return h(
      'el-table', this.tableAttribute(), columns)
  }
}
</script>
