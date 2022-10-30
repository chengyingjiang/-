<template>
  <el-dialog :title="isAdd ? '新增用户' : '修改用户'" :visible.sync="boolShow">
    <el-form :model="formData" :rules="formRules" ref="formRef">
      <slot name="formItem" :row="{ formData, isAdd }"></slot>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="boolShow = false">取 消</el-button>
      <el-button type="primary" @click="submitFn">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  props: {
    //model属性值
    formData: {
      type: Object,
      default() {
        return {};
      },
    },
    //rules属性值
    formRules: {
      type: Object,
      default() {
        return {};
      },
    },
    dialogVisible: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    boolShow: {
      set(val) {
        this.$emit("update:dialogVisible", val);
      },
      get() {
        return this.dialogVisible;
      },
    },
    isAdd() {
      return !this.formData.id;
    },
  },
  methods: {
    submitFn() {
      this.$refs.formRef.validate((isOk) => {
        if (isOk) {
          this.$emit("sumEvent");
        }
      });
    },
  },
};
</script>

<style lang="less" scoped>
</style>