<template>
  <div class="categories">
    <bread-crumb :menuList="menuList"></bread-crumb>
    <el-card class="cardlist">
      <div class="categories">
        <el-button type="primary" @click="showAddCateDialog"
          >添加分类</el-button
        >
        <el-table :data="cateList" border row-key="cat_id" class="cardlist">
          <el-table-column type="index" label="#"></el-table-column>
          <el-table-column prop="cat_name" label="分类名称"></el-table-column>
          <el-table-column label="是否有效">
            <template slot-scope="{ row }">
              <el-icon
                v-if="!row.cat_deleted"
                class="el-icon-success"
              ></el-icon>
              <el-icon v-else class="el-icon-error"></el-icon>
            </template>
          </el-table-column>
          <el-table-column label="排序">
            <template slot-scope="{ row }">
              <el-tag v-if="row.cat_level === 0">一级</el-tag>
              <el-tag v-if="row.cat_level === 1" type="success">二级</el-tag>
              <el-tag v-if="row.cat_level === 2" type="warning">三级</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="{ row }">
              <el-button
                type="primary"
                icon="el-icon-edit"
                size="mini"
                @click="edit(row)"
                >编辑</el-button
              >
              <el-button
                type="danger"
                icon="el-icon-delete"
                size="mini"
                @click="del(row.id)"
                >删除</el-button
              >
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-card>
    <pagin-ation
      :page.sync="paramsObj.pagenum"
      :limit.sync="paramsObj.pagesize"
      :total="total"
      @pagination="getData"
    ></pagin-ation>
    <el-dialog :visible.sync="addCatesDialogVisible" title="添加分类">
      <el-form :model="addCateForm" :rules="addGoodsRules" ref="addCateRef">
        <el-form-item
          prop="cat_name"
          label="分类名称"
          :label-width="formLabelWidth"
        >
          <el-input v-model="addCateForm.cat_name" />
        </el-form-item>
        <el-form-item label="父级分类" :label-width="formLabelWidth">
          <!-- 
          value / v-model	选中项绑定值  []
          options	可选项数据源，键名可通过 Props 属性配置	array
          props 配置选项  
              value	指定选项的值为选项对象的某个属性值	string	—	'value'
              label	指定选项标签为选项对象的某个属性值	string
          clearable	是否支持清空选项	boolean	—	false

          change	当选中节点变化时触发	选中节点的值
          -->
          <el-cascader
            v-model="selectedCateKey"
            :options="cascaderList"
            :props="cateProps"
            clearable
            @change="handlerChange"
            style="width: 100%"
          ></el-cascader>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="addCatesDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="addCate">确定</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { getGoodsCate, addCate, delCate } from "@/api/good";
import BreadCrumb from "@/components/BreadCrumb.vue";
import PaginAtion from "@/components/PaginAtion.vue";
export default {
  components: { BreadCrumb, PaginAtion },
  data() {
    return {
      menuList: ["商品管理", "商品分类"],
      cateList: [],
      paramsObj: {
        pagenum: 1,
        pagesize: 5,
      },
      total: 0,
      cateProps: {
        expandTrigger: "hover", //次级菜单的展开方式	string	click / hover	'click'
        checkStrictly: true, //  是否可以让任意一项点击生效
        label: "cat_name", //级联选择器显示的文本
        value: "cat_id", //选中的值
      }, //配置项
      cascaderList: [], //数据源
      selectedCateKey: [], //选中项的值
      addCatesDialogVisible: false,
      addCateForm: {
        cat_pid: 0,
        cat_name: "",
        cat_level: 0,
      },
      addGoodsRules: {
        cat_name: [
          { required: true, message: "分类名称不能为空", trigger: "blur" },
        ],
      },
      formLabelWidth: "120px",
    };
  },
  mounted() {
    this.getData();
  },
  methods: {
    async getData() {
      const { result } = await getGoodsCate(this.paramsObj);
      this.cateList = result;
      this.total = this.cateList.length;
    },
    // 点击添加分类
    async showAddCateDialog() {
      // 1显示添加分类的对话框
      this.addCatesDialogVisible = true;
      // 2  获取父级分类数据  展示到级联选择器上
      // 因为 只有三级分类  添加分类选择父级  添加到3级  父级分类读取到2级
      this.cascaderList = await getGoodsCate({ type: 2 });
    },
    handlerChange() {
      // console.log(this.selectedCateKey, 'select')
      // []  添加的是一级分类
      //   [70] 选择了一级分类，要添加二级分类
      //  [70,80]  选择了二级分类，要添加三级分类
      if (this.selectedCateKey.length === 0) {
        //添加一级分类
        this.addCateForm.cat_pid = 0;
        this.addCateForm.cat_level = 0;
      } else {
        // 分类的父id就是选中的值的数组的最后一项
        this.addCateForm.cat_pid =
          this.selectedCateKey[this.selectedCateKey.length - 1];
        // 分类的层级就是数组的长度
        this.addCateForm.cat_level = this.selectedCateKey.length;
      }
    },
    // 确定添加分类
    addCate() {
      this.$refs.addCateRef.validate(async (isOk) => {
        if (isOk) {
          await addCate(this.addCateForm);
          this.getData();
          this.$message.success("添加成功");
          this.addCatesDialogVisible = false;
        } else {
          return false;
        }
      });
    },
    // 监听对话框关闭事件
    close() {
      this.addCateForm = {
        cat_pid: 0, //父分类id
        cat_name: "", //分类名称
        cat_level: 0, //分类层级不能为空，`0`表示一级分类；`1`表示二级分类；`2`表示三级分类
      };
      this.selectedCateKey = [];
    },
    del(id) {
      this.$confirm("确定要永久删除该条数据吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          // 点击确定 请求删除的api接口
          await delCate(id);
          // 重新渲染数据
          this.getData();
          // 提示
          this.$message({
            type: "success",
            message: "删除成功!",
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
  },
};
</script>

<style lang="less" scoped>
.cardlist {
  margin-top: 15px;
}
</style>