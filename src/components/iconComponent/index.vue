<template>
  <div>
    <img src="" alt="">
  </div>
</template>

<script>
export default {
  name: 'IconComponent',
  props: {
    default: {
      type: String,
      default: ''
    },
    hover: {
      type: String,
      default: ''
    },
    click: {
      type: String,
      default: ''
    }
  },
  computed: {
    defaultImage() {
      return require(this.default)
    },
    hoverImage() {
      return require(this.hover)
    },
    clickImage() {
      return require(this.click)
    }
  },
  methods: {
    initing() {

    }
  }
}
</script>

<style scoped>

</style>
