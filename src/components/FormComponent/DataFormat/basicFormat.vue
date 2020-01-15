<template>
  <div :style="containerStyles" class="bf_container" @click.stop="transformTo">
    <header :style="widthRate.header" class="bf_c_key">
      <el-select
        v-if="Array.isArray(name)"
        v-model="selected"
        size="mini"
        class="__bf_key_selection">
        <el-option
          v-for="(item, index) in name"
          :key="index"
          :label="item"
          :value="index"
        />
      </el-select>
      <!-- Else it will show as a string -->
      <div v-else :style="fontStyle" class="__bf_key_p">
        {{ name }}
      </div>
    </header>
    <main :style="widthRate.main" class="br_c_value">
      <el-tooltip :disabled="foldType !== 'tooltip'" :content="keyToContent" placement="bottom" effect="light">
        <div :style="valueStyle" class="__bf_value_p">
          {{ keyToContent }}
          <div v-if="foldType === 'icon'" :class="iconStyle" class="__bf_value_p_icon" @click="showFull"/>
          <slot :content="content" name="view"/>
        </div>
      </el-tooltip>
    </main>
  </div>
</template>

<script>
import { getActualFontSize, mergeObj } from '@u'
export default {
  /**
   * Showing key value pair with designated structure
   */
  name: 'Couple',

  props: {
    // Data of key
    name: {
      type: String | Array,
      default: ''
    },
    // Data of value, mapping to key
    content: {
      type: String | Array,
      default: ''
    },

    // Clicking data will transform according to url
    url: {
      type: String | Object,
      default: ''
    },

    // Whole data will showing in one line
    inline: {
      type: Boolean,
      default: true
    },
    // choose: ['start', 'end', 'center', 'space-around', 'space-between']
    justify: {
      type: String,
      default: 'start'
    },
    align: {
      type: String,
      default: 'start'
    },

    // Proportion of content to total length
    rate: {
      type: Number,
      default: 0.65
    },
    breakLine: {
      type: Number,
      default: 1
    },
    fontSize: {
      type: String | Number,
      default: '1.14rem'
    },
    // Showing hidden content by tooltip or full display.
    // choose : Boolean -> true == icon false == none
    // choose : String -> icon, tooltip, none
    showAll: {
      type: Boolean | String,
      default: true
    }
  },

  data() {
    return {
      selected: 0,
      unfold: true,
      overflow: false
    }
  },

  computed: {
    // Translate data of prop named content to usable for component
    keyToContent() {
      if (Array.isArray(this.content)) {
        return this.content[this.selected]
      } else {
        return this.content
      }
    },

    // Content showing in a line or more than one according to prop named inline.
    containerStyles() {
      return {
        'flex-direction': this.inline ? 'row' : 'column',
        'justify-content': this.justify,
        'align-items': this.align
      }
    },

    // Length-proportion to whole width
    widthRate() {
      return {
        header: { 'width': this.inline ? (1 - this.rate) * 100 + '%' : '100%' },
        main: { 'width': this.inline ? (this.rate) * 100 + '%' : '100%' }
      }
    },

    // Setting breakword-style for p element
    breakWord() {
      // Need showing content over two-line
      if (this.breakLine >= 2) {
        return {
          'overflow': 'hidden',
          'text-overflow': this.unfold ? 'ellipsis' : 'unset',
          '-webkit-line-clamp': this.unfold ? this.breakLine : 'unset',
          'word-break': 'break-all',
          'display': '-webkit-box',
          '-webkit-box-orient': 'vertical',
          'white-space': 'normal'
        }
      } else {
        // Showing content in a line
        return {
          'overflow': 'hidden',
          'white-space': this.unfold ? 'nowrap' : 'normal',
          'text-overflow': this.unfold ? 'ellipsis' : 'unset',
          'break-word': 'break-all'
        }
      }
    },

    // Setting the way of showing full content
    // pre-setting: [tooltip, icon, none]
    foldType() {
      if (this.overflow) {
        if (this.showAll === true || this.showAll === 'icon') {
          return 'icon'
        } else if (this.showAll === 'tooltip') {
          return 'tooltip'
        } else {
          return 'none'
        }
      } else {
        return 'none'
      }
    },

    // According to is-full-content status Defineing class of icon
    iconStyle() {
      // Style of pulldown identification
      if (this.unfold) {
        return '__bf_value_p_icon_unfold'
      } else {
        return '__bf_value_p_icon_fold'
      }
    },

    // Setting font size for content of header and main
    fontStyle() {
      const style = {
        'font-size': typeof this.fontSize === 'number' ? this.fontSize + 'px' : this.fontSize
      }
      return style
    },

    valueStyle() {
      return mergeObj(this.breakWord, this.fontStyle)
    }
  },

  mounted() {
    this.willShowTip(this.keyToContent, this.fontSize)
  },

  methods: {
    // Transform to designated page according to URL
    transformTo() {
      this.$emit('focusOn')
      if (this.url) {
        this.$router.push(this.url)
      }
    },

    // Modifing overflow-tip will show or not.
    willShowTip(txt, size, fontname = 'Lato') {
      // Actual width of value container
      const containerWidth =
        getComputedStyle(document.getElementsByClassName('__bf_value_p')[0]).width
      // Compare length of will-show content with width of container
      this.overflow =
        parseFloat(getActualFontSize(txt, size, fontname)) > parseFloat(containerWidth) * this.breakLine
    },

    // Will showing full content or not (click event)
    showFull() {
      // unfold-attribute will influence breakWord(computed), icon-style(computed)
      this.unfold = !this.unfold
    }
  }
}
</script>

<style lang="scss" scoped>
.bf_container {
  display: flex;
  width: 100%;
  .bf_c_key {
    padding-right: 4px;
    .__bf_key_p {
      color: #BBBBC8;
    }
  }
  .br_c_value{
    .__bf_value_p {
      color: #7F7D8E;
      position: relative;

      // full-content icon
      .__bf_value_p_icon {
        position: absolute;
        bottom: 10px;
        right: 0px;
        width: 0;
        height: 0;
        border-style: solid;
        cursor: pointer;
      }
      // up arrow
      .__bf_value_p_icon_fold {
        border-width: 0 5px 5px;
        border-color: transparent transparent #543c77;
      }
      // down arrow
      .__bf_value_p_icon_unfold {
        border-width: 5px 5px 0;
        border-color: #543c77 transparent transparent;
      }
    }
  }
}
</style>
