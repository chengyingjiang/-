<template>
  <div class="sidebar-coll-container" @click="changeColl">|||</div>
</template>

<script>
import { mapMutations } from "vuex";
export default {
  name: "CollTop",
  props: {
    collapse: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    ...mapMutations(["collapse/setCollapse"]),
    changeColl() {
      this["collapse/setCollapse"]();
    },
  },
};
</script>

<style lang="less" scoped>
.sidebar-coll-container {
  height: 40px;
  line-height: 40px;
  color: #fff;
  text-align: center;
}
</style>