<template>
  <div style="width:100%;">
    <div style="width:200px;">
      <data-form :content="content"/>
    </div>
    <table-temp :tableattr="table" @linking-click="clickLinking"/>
  </div>
</template>

<script>
import dataForm from '@c/FormComponent/DataFormat'
import tableTemp from '@c/FormComponent/TablePagination/TableTemplate'
export default {
  name: 'MainField',
  components: {
    dataForm,
    tableTemp
  },
  data() {
    return {
      content: {
        content: [{ name: [1, 2, 3, 4], content: ['h', 'e', 'l', 'o'] },
          { name: 'host', content: 'hello you there,this is a long distance', breakLine: 2 },
          { name: 'guest', content: 'check this' }],
        title: 'checkout'
      },
      table: {
        columns: [
          { type: 'index', label: 'id', width: 50 },
          { label: 'name', prop: 'name', slot: { default: 'linking' }},
          { label: 'check', prop: 'check', sortable: true }],
        data: [
          { name: 'n1', check: '0.23' },
          { name: 'n2', check: '0.52' },
          { name: 'n3', check: '0.123' },
          { name: 'n4', check: '0.6234' },
          { name: 'n5', check: '0.1546' },
          { name: 'n6', check: '0.34' },
          { name: 'n7', check: '0.231' }
        ]
      }
    }
  },
  methods: {
    clickLinking(pos) {
      console.log(pos)
    }
  }
}
</script>

<style lang="" scoped>

</style>
