<template>
  <div/>
</template>

<script>
export default {
  /**
   * Need request data according currentPage
   */
  name: 'AsyncTable',
  props: {
    // Attribute of table
    content: {
      type: Object,
      default: () => {}
    },

    // Multi pass showable data, components will memory it.
    data: {
      type: Array,
      default: () => []
    },
    startIndex: {
      type: Number,
      default: 1
    },
    pageSize: {
      type: Number,
      default: 1
    }
  },
  data() {
    return {

    }
  }
}
</script>

<style lang="" scoped>

</style>
