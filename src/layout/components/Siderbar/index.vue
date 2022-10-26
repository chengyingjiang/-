<template>
  <el-menu
    :default-active="activePath"
    class="el-menu-vertical-demo"
    background-color="#333744"
    text-color="#fff"
    active-text-color="#ffd04b"
    router
    unique-opened
    :collapse="isCollapse"
  >
    <el-submenu v-for="item in menus" :key="item.id" :index="item.id + ''">
      <template slot="title">
        <i :class="objIcon[item.id]"></i>
        <span>{{ item.authName }}</span>
      </template>
      <el-menu-item-group>
        <el-menu-item
          v-for="item1 in item.children"
          :key="item1.id"
          :index="'/' + item1.path"
          ><template slot="title">
            <i class="el-icon-menu"></i>
            <span>{{ item1.authName }}</span>
          </template></el-menu-item
        >
      </el-menu-item-group>
    </el-submenu>
  </el-menu>
</template>

<script>
import { mapGetters } from "vuex";
import { getSideBar } from "@/api/siderbar";
export default {
  data() {
    return {
      menus: [],
      objIcon: {
        125: "iconfont icon-user",
        103: "iconfont icon-tijikongjian",
        101: "iconfont icon-shangpin",
        102: "iconfont icon-danju",
        145: "iconfont icon-baobiao",
      },
      activePath: "",
    };
  },
  mounted() {
    this.getMenus();
  },
  methods: {
    async getMenus() {
      let data = await getSideBar();
      this.menus = data;
    },
  },
  watch: {
    $route: {
      handler(newRoute) {
        this.activePath = newRoute.fullPath;
      },
      deep: true,
      immediate: true,
    },
  },
  computed: {
    ...mapGetters(["isCollapse"]),
  },
};
</script>

<style lang="less" scoped>
.el-menu {
  border: none;
  height: 100%;
  width: 100% !important;
  a {
    li {
      .svg-icon {
        color: #fff;
        font-size: 18px;
        vertical-align: middle;
        .icon {
          color: #fff;
        }
      }
      span {
        color: #fff;
      }
      &:hover {
        .svg-icon {
          color: #43a7fe;
        }
        span {
          color: #43a7fe;
        }
      }
    }
  }
}
.el-menu-vertical-demo {
  border-right: none;
}
</style>