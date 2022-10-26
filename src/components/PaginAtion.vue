<template>
  <div class="cardlist">
    <el-pagination
      :background="background"
      :current-page.sync="currentPage"
      :page-size.sync="pageSize"
      :layout="layout"
      :page-sizes="pageSizes"
      :pager-count="pagerCount"
      :total="total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    >
    </el-pagination>
  </div>
</template>

<script>
export default {
  props: {
    total: {
      required: true,
      type: Number,
    },
    // 是否为分页按钮添加背景色
    background: {
      type: Boolean,
      default: true,
    },
    // 当前页数
    page: {
      type: Number,
      default: 1,
    },
    // 每页条数
    limit: {
      type: Number,
      default: 5,
    },
    // layout	组件布局，子组件名用逗号分隔	String	sizes, prev, pager, next, jumper, ->, total, slot	'prev, pager, next, jumper, ->, total'
    layout: {
      type: String,
      default: "total,sizes,prev,pager,next,jumper",
    },
    // page-sizes	每页显示个数选择器的选项设置	number[]
    pageSizes: {
      type: Array,
      default() {
        return [1, 2, 3, 4, 5];
      },
    },
    // pager-count	页码按钮的数量，当总页数超过该值时会折叠	number
    // 默认值为5
    pagerCount: {
      type: Number,
      default: document.body.clientWidth < 992 ? 5 : 7,
    },
  },
  computed: {
    // current-page	当前页数，支持 .sync 修饰符	number
    currentPage: {
      get() {
        return this.page;
      },
      set(val) {
        this.$emit("update:page", val);
      },
    },
    // page-size	每页显示条目个数，支持 .sync 修饰符
    pageSize: {
      get() {
        return this.limit;
      },
      set(val) {
        this.$emit("update:limit", val);
      },
    },
  },
  methods: {
    handleSizeChange(val) {
      this.$emit("pagination", { page: this.currentPage, limit: val });
    },
    handleCurrentChange(val) {
      this.$emit("pagination", { page: val, limit: this.pageSize });
    },
  },
};
</script>

<style>
</style>