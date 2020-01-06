<template>
  <div style="width:200px;">
    <basic-format :name="name" :content="content" :break-line="2"></basic-format>
    <basic-format :name="name2" :content="content2">
      <template v-slot:view="content">
        <el-popover
          placement="bottom"
          title="testing"
          width="100"
          trigger="click"
          content="testing">
          <span slot="reference">view</span>
        </el-popover>
      </template>
    </basic-format>
  </div>
</template>

<script>
import basicFormat from '@c/FormComponent/DataFormat/basicFormat'
export default {
  name: 'MainField',
  components: {
    basicFormat
  },
  data () {
    return {
      name: 'host',
      content: 'hosting testing string must be as longest as possible',
      name2: 'author',
      content2: '1'
    }
  }
}
</script>

<style lang="" scoped>

</style>
