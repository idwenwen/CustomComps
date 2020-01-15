<script>
/**
 * events: prevClick, nextClick, currentPageChange, sizeChange
 */
export default {
  name: 'PaginnationTemplate',
  props: {
    // Page Count
    total: {
      type: Number,
      default: 1
    },

    // Will hide pagination when there is single page or not
    hideOnSinglePage: {
      type: Boolean,
      default: false
    },

    // Identification for previous-page button
    prevText: {
      type: String,
      default: '<'
    },
    nextText: {
      type: String,
      default: '>'
    },
    layout: {
      type: String,
      default: 'total, sizes, page, jumper'
    }
  },
  data() {
    return {
      /** *** Pagination parameter *** **/
      currentPage: 1,
      // Will be folded when exceeded current data.
      pagerCount: 5,
      // Default page size. And Provide different specifications for customer
      pageSize: 10,
      pageSizes: [5, 10, 20, 30, 50],

      /** *** Slot-components attr *** **/
      jumperInput: ''
    }
  },
  computed: {
    // Generate unique refname for component
    paginationRef() {
      const now = new Date().getTime().toString().substr(-7)
      let rand = parseInt(Math.random() * 1000).toString()
      if (rand.length <= 2) {
        rand += new Array(3 - rand.length).fill(0).join()
      }
      return 'el-pagination_' + now + '_' + rand
    },
    countPage() {
      return Math.ceil(this.total / this.pageSize)
    }
  },
  methods: {
    /** *** Operable function *** **/
    // Can be used to calling pagination methods
    calling(opera, ...args) {
      const ref = this.$refs[this.paginationRef]
      const emit = (func) => {
        if (func) {
          func(...args)
        } else {
          this[opera](...args)
        }
      }
      if (Array.isArray(ref)) {
        for (const val of ref) {
          emit(val[opera])
        }
      } else {
        emit(ref[opera])
      }
    },
    // Return to initial setting
    resetting() {
      this.currentPage = 1
      this.pageSize = 10
    },

    /** *** Drawing Operation *** **/
    pageAttr(createElement) {
      const vm = this
      const attr = {
        class: '_pg_page',
        props: {
          pagerCount: this.pagerCount,
          pageSize: this.pageSize,
          pageSizes: this.pageSizes,
          layout: 'prev, pager, next',
          total: this.total,
          currentPage: this.currentPage,
          small: this.small,
          hideOnSinglePage: this.hideOnSinglePage
        },
        on: {
          'current-change': function(val) {
            vm.currentPage = val
            vm.$emit('current-change', val)
          },
          'prev-click': function(val) {
            vm.$emit('prev-click', val)
          },
          'next-click': function(val) {
            vm.$emit('next-click', val)
          }
        },
        ref: this.paginationRef
      }
      return createElement('el-pagination', attr, [])
    },

    jumperAttr(createElement) {
      const vm = this
      return createElement('div', {
        class: '_pg_jumper container'
      }, [
        createElement('span', ['Skip to:']),
        createElement('el-input', {
          class: '_pg_jumper_input',
          props: {
            value: vm.jumperInput,
            size: 'mini'
          },
          on: {
            change: function(val) {
              let cp = parseInt(vm.jumperInput) || 1
              if (cp > vm.countPage) {
                cp = vm.countPage
              }
              vm.currentPage = cp
              vm.$emit('current-change', vm.currentPage)
            },
            input: function(val) {
              vm.jumperInput = val
            }
          }
        }, [])
      ])
    },

    sizesAttr(createElement) {
      const vm = this
      const options = []
      for (const val of this.pageSizes) {
        options.push(createElement('el-option', {
          props: {
            label: val,
            value: val
          }
        }))
      }
      return createElement('el-select', {
        class: '_pg_select',
        props: {
          size: 'mini',
          value: this.pageSize
        },
        on: {
          change: function(val) {
            let cp = Math.ceil(vm.currentPage * vm.pageSize / val)
            vm.pageSize = val
            if (cp > vm.countPage) {
              cp = vm.countPage
            }
            vm.$emit('size-change', vm.pageSize)
            vm.$nextTick(() => {
              vm.currentPage = cp
              vm.$emit('current-change', vm.currentPage)
            })
          }
        }
      }, options)
    },

    totalAttr(createElement) {
      return createElement('span', {
        class: '_pg_total'
      }, ['Total: ', this.total])
    }
  },
  render(h) {
    const lay = this.layout.replace(/\s/g, '').split(',')
    for (let i = 0; i < lay.length; i++) {
      if (this[lay[i] + 'Attr']) {
        lay[i] = this[lay[i] + 'Attr'](h)
      } else {
        if (this.$slots[lay[i]]) {
          lay[i] = this.$slots[lay[i]]
        } else {
          lay.splice(i, 1)
          i--
        }
      }
    }
    return h(
      'div', {
        class: 'pg_container container'
      }, lay
    )
  }
}
</script>

<style lang="scss">
.el-pager li{
  font-weight: bold;
  font-size: 1.12rem;
  color: #7F7D8E;
}

.pg_container {
  display:flex;
  flex-direction: 'row';
  font-weight: bold;
  font-size: 1.12rem;
  color: #7F7D8E;
  font-family: 'Lato';
  ._pg_total {
    margin: 0px 10px;
  }
  ._pg_jumper {
    span {
      min-width: 75px;
    }
    ._pg_jumper_input {
      text-align: center;
      background-color: #E8E8EF;
      border-radius: 2px;
      border: 0px;
      max-width: 50px;
    }
  }
  ._pg_select {
    max-width: 70px;
    margin: 0px 10px;
    text-align: center;
  }
  ._pg_page {
    margin: 0px 10px;
  }
}

.container {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-end;
}
</style>
