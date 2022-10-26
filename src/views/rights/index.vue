<template>
  <div class="rights">
    <bread-crumb :menuList="menuList"></bread-crumb>
    <el-card class="cardlist">
      <el-table :data="rightList" border stripe style="width: 100%">
        <el-table-column type="index" label="#"></el-table-column>
        <template v-for="item in tableColumnOptions">
          <el-table-column
            :prop="item.prop"
            :label="item.label"
            :key="item.index"
          ></el-table-column>
        </template>
        <el-table-column label="权限等级">
          <template slot-scope="{ row }">
            <el-tag v-if="row.level == 0">一级</el-tag>
            <el-tag v-if="row.level == 1" type="success">二级</el-tag>
            <el-tag v-if="row.level == 2" type="warning">三级</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
import BreadCrumb from "@/components/BreadCrumb.vue";
import { getRight } from "@/api/right";
export default {
  components: { BreadCrumb },
  data() {
    return {
      menuList: ["权限管理", "权限列表"],
      tableColumnOptions: [
        { label: "权限名称", prop: "authName" },
        { label: "路径", prop: "path" },
      ],
      rightList: [],
    };
  },
  mounted() {
    this.getData();
  },
  methods: {
    async getData() {
      this.rightList = await getRight("list");
    },
  },
};
</script>

<style lang='less' scoped>
.cardlist {
  margin-top: 15px;
}
</style>