<template>
  <el-container>
    <el-header><Navbar></Navbar></el-header>
    <el-container>
      <el-aside :width="isCollapse == true ? '64px' : '200px'"
        ><CollTop></CollTop><Siderbar class="sider-container"></Siderbar
      ></el-aside>
      <el-main><router-view></router-view></el-main>
    </el-container>
  </el-container>
</template>

<script>
import CollTop from "./components/Siderbar/CollTop";
import Siderbar from "./components/Siderbar";
import Navbar from "./components/Navbar";
import { mapGetters } from "vuex";
export default {
  components: {
    Siderbar,
    Navbar,
    CollTop,
  },
  computed: {
    ...mapGetters(["isCollapse"]),
  },
};
</script>

<style lang="less" scoped>
@import url(@/styles/layout.less);
.sidebar-container {
  background: url("~@/assets/common/leftnavBg.png") no-repeat 0 100%;
}
</style>