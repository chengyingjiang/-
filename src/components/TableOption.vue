<template>
  <div class="cardlist">
    <el-table :data="tableData" border style="width: 100%">
      <el-table-column type="index" label="#"></el-table-column>
      <template v-for="item in tableColumnOptions">
        <el-table-column
          :prop="item.prop"
          :label="item.label"
          :key="item.index"
        ></el-table-column>
      </template>
      <el-table-column label="状态">
        <template slot-scope="{ row }">
          <slot name="state" :row="row"></slot>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="{ row }">
          <el-button
            type="primary"
            size="mini"
            icon="el-icon-edit"
            @click="edit(row)"
          ></el-button>
          <el-button
            type="danger"
            size="mini"
            icon="el-icon-delete"
            @click="del(row)"
          ></el-button>
          <slot name="setting" :row="row"></slot>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  props: {
    tableData: {
      type: Array,
      default: [],
    },
    tableColumnOptions: {
      type: Array,
      default: [],
    },
  },
  methods: {
    edit(row) {
      this.$emit("editEvent", row);
    },
    del(row) {
      this.$emit("delEvent", row.id);
    },
  },
};
</script>

<style lang='less' scoped>
.cardlist {
  margin-top: 15px;
}
</style>