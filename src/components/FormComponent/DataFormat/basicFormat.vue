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
      <div v-else class="__bf_key_p">
        {{ name }}
      </div>
    </header>
    <main :style="widthRate.main" class="br_c_value">
      <div :style="breakWord" class="__bf_value_p">
        {{ keyToContent }}
        <slot :content="content" name="view"></slot>
      </div>
    </main>
  </div>
</template>

<script>
export default {
  name: 'Couple',

  props: {
    name: {
      type: String | Array,
      default: ''
    },
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
      default: 'center'
    },

    // Proportion of content to total length
    rate: {
      type: Number,
      default: 0.65
    },
    breakLine: {
      type: Number,
      default: 0
    }
  },

  data () {
    return {
      selected: 0
    }
  },

  computed: {
    keyToContent () {
      if (Array.isArray(this.content)) {
        return this.content[this.selected]
      } else {
        return this.content
      }
    },

    containerStyles () {
      return {
        'flex-direction': this.inline ? 'row' : 'column',
        'justify-content': this.justify,
        'align-items': (this.align && this.breakLine <= 1) ? this.align : 'start'
      }
    },

    widthRate () {
      return {
        header: { 'width': this.inline ? (1 - this.rate) * 100 + '%' : '100%' },
        main: { 'width': this.inline ? (this.rate) * 100 + '%' : '100%' }
      }
    },

    breakWord () {
      if (this.breakLine >= 2) {
        return {
          'overflow': 'hidden',
          'text-overflow': 'ellipsis',
          '-webkit-line-clamp': this.breakLine,
          'word-break': 'break-all',
          'display': '-webkit-box',
          '-webkit-box-orient': 'vertical',
          'white-space': 'normal'
        }
      } else {
        return {
          'overflow': 'hidden',
          'white-space': 'nowrap',
          'text-overflow': 'ellipsis'
        }
      }
    }
  },

  methods: {
    transformTo () {
      this.$emit('focusOn')
      if (this.url) {
        this.$router.push(this.url)
      }
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
      size: 1.14rem;
      color: #BBBBC8;
    }
  }
  .br_c_value{
    .__bf_value_p {
      size: 1.14rem;
      color: #7F7D8E;
      position: relative
    }
  }
}
</style>
