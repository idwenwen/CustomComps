<template>
  <div :style="containerStyle" class="df_container">
    <header v-if="usableContent.title.length > 0" :style="titleStyle" class="df_title">
      {{ usableContent.title }}
    </header>
    <main :style="mainStyle" class="df_content">
      <basic-format
        v-for="(item, index) in usableContent.content"
        :key="index"
        :name="item.name"
        :content="item.content"
        :inline="item.inline"
        :url="item.url"
        :break-line="item.breakLine"
        :show-all="item.showAll"
        v-bind="$attrs"/>
    </main>
  </div>
</template>

<script>
import basicFormat from './basicFormat'
import { clone } from '@u'
export default {
  name: 'DataForm',

  components: {
    basicFormat
  },

  props: {
    /**
     * format Object: {content:[], title: String}
     * format Array|content:
     *  [{
     *    name:[]|String,
     *    content:[]|String,
     *    inline: Boolean,
     *    url: Object
     *  }]
     */
    content: {
      type: Object | Array,
      default: () => []
    },

    // Showing as a row or as a column
    isColumn: {
      type: Boolean,
      default: true
    },

    // border for container
    padding: {
      type: Number | String | Boolean,
      default: 8
    },
    // margin-bottom attribute for title
    titleBottomMargin: {
      type: Number | String | Boolean,
      default: 16
    }
  },

  computed: {
    // Translate data of prop named content to usable for component
    usableContent() {
      let final = null
      let needInit = null
      if (Array.isArray(this.content)) {
        final = clone({ title: '', content: this.content })
      } else {
        final = clone(this.content)
      }
      needInit = final.content
      for (const val of needInit) {
        if (typeof val.inline !== 'boolean') {
          val.inline = true
        }
        if (typeof val.url !== 'object' && typeof val.url !== 'string') {
          val.url = ''
        }
        if (typeof val.breakLine !== 'number') {
          val.breakLine = 1
        }
        if (typeof val.showAll !== 'string' && typeof val.showAll !== 'boolean') {
          val.showAll = 'icon'
        }
      }
      return final
    },

    // Custom style of container
    containerStyle() {
      const style = {}
      if (this.padding !== false) {
        style['padding'] =
          typeof this.padding === 'number' ? this.padding + 'px' : this.padding
      }
      return style
    },

    // Custom style of title-part
    titleStyle() {
      const style = {}
      if (this.titleBottomMargin !== false) {
        style['margin-bottom'] =
          typeof this.titleBottomMargin === 'number' ? this.titleBottomMargin + 'px' : this.titleBottomMargin
      }
      return style
    },

    /**
     * Getting style of main element
     * 1. Will showing content in a column or in a line
     */
    mainStyle() {
      const style = {}
      if (this.isColumn) {
        style['flex-direction'] = 'column'
      } else {
        style['flex-direction'] = 'row'
      }
      return style
    }
  }
}
</script>

<style lang="scss" scoped>
.df_container {
  width: 100%;
  position: relative;
  padding: 8px;
  .df_title {
    font-size: 1.29rem;
    font-weight: bold;
    color: #534c77;
  }
  .df_content {
    display:flex;
    width: 100%;
    position: relative;
  }
}
</style>
