<template>
  <div class="params">
    <bread-crumb :menuList="menuList"></bread-crumb>
    <el-card class="cardlist">
      <el-alert
        title="注意：只允许为第三级分类设置相关的参数！"
        type="warning"
        :closable="false"
      ></el-alert>
      <el-row class="cardlist">
        <el-col>
          选择商品分类：
          <el-cascader
            v-model="selectedCateKey"
            :options="cateList"
            :props="cateProps"
            @change="handleChange"
          ></el-cascader>
        </el-col>
      </el-row>
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="动态参数" name="many">
          <el-button
            type="primary"
            size="small"
            :disabled="isDisabled"
            @click="addParamsDialogVisible = true"
          >
            添加参数
          </el-button>
          <el-table
            :data="manyData"
            border
            row-key="attr_id"
            style="margin-top: 15px"
          >
            <el-table-column type="expand">
              <template slot-scope="{ row }">
                <el-tag
                  closable
                  v-for="(item, index) in row.attr_vals"
                  :key="index"
                  @close="delAttrValue(index, row)"
                >
                  {{ item }}
                </el-tag>
                <el-input
                  class="tag-input"
                  v-model="row.inputValue"
                  v-if="row.inputVisible"
                  ref="inputRef"
                  @keyup.native.enter="handleInputConfirm(row)"
                  @blur="handleInputConfirm(row)"
                />
                <el-button v-else size="small" @click="showInput(row)"
                  >+ New Tag</el-button
                >
              </template>
            </el-table-column>
            <el-table-column type="index" label="#"></el-table-column>
            <el-table-column
              prop="attr_name"
              label="参数名称"
            ></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="{ row }">
                <el-button type="primary" class="el-icon-edit" size="small"
                  >编辑</el-button
                >
                <el-button type="danger" class="el-icon-delete" size="small"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="静态参数" name="only">
          <el-button
            type="primary"
            size="small"
            :disabled="isDisabled"
            @click="addParamsDialogVisible = true"
          >
            添加参数
          </el-button>
          <el-table
            :data="onlyData"
            border
            row-key="attr_id"
            style="margin-top: 15px"
          >
            <el-table-column type="expand">
              <template slot-scope="{ row }">
                <el-tag
                  closable
                  v-for="(item, index) in row.attr_vals"
                  :key="index"
                  @close="delAttrValue(index, row)"
                >
                  {{ item }}
                </el-tag>
                <el-input
                  class="tag-input"
                  v-model="row.inputValue"
                  v-if="row.inputVisible"
                  ref="inputRef"
                  @keyup.native.enter="handleInputConfirm(row)"
                  @blur="handleInputConfirm(row)"
                />
                <el-button v-else size="small" @click="showInput(row)"
                  >+ New Tag</el-button
                >
              </template>
            </el-table-column>
            <el-table-column type="index" label="#"></el-table-column>
            <el-table-column
              prop="attr_name"
              label="参数名称"
            ></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="{ row }">
                <el-button type="primary" class="el-icon-edit" size="small"
                  >编辑</el-button
                >
                <el-button type="danger" class="el-icon-delete" size="small"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>
    <!-- 添加动态参数和静态属性的对话框 -->
    <el-dialog
      :visible.sync="addParamsDialogVisible"
      :title="'添加' + titleText"
      @close="close"
    >
      <el-form
        :model="addParamsForm"
        :rules="addParamsRules"
        ref="addParamsRef"
      >
        <el-form-item prop="attr_name" :label="titleText" label-width="80px">
          <el-input v-model="addParamsForm.attr_name" />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="addParamsDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="saveParamsList">确定</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import {
  getGoodsCate,
  getParamsList,
  saveParams,
  saveParamsList,
} from "@/api/good";
import BreadCrumb from "@/components/BreadCrumb.vue";
export default {
  components: { BreadCrumb },
  data() {
    return {
      menuList: ["商品管理", "分类参数"],
      addParamsRules: {
        attr_name: [
          { required: true, $message: "参数名不能为空", trigger: "blur" },
        ],
      },
      addParamsForm: {
        attr_name: "",
      },
      addParamsDialogVisible: false,
      selectedCateKey: [],
      cateList: [],
      cateProps: {
        expandTrigger: "hover", //次级菜单的展开方式	string	click / hover	'click'
        label: "cat_name", //级联选择器显示的文本
        value: "cat_id", //选中的值
        children: "children", //使用那个属性嵌套
      },
      onlyData: [], //静态参数列表
      manyData: [], //动态参数列表
      // isDisabled: false,
      activeName: "many",
    };
  },
  mounted() {
    this.getCateList();
  },
  computed: {
    // 定义分类id
    cateId() {
      //选择的数组的最后一个值
      return this.selectedCateKey[this.selectedCateKey.length - 1];
    },
    // 添加属性按钮的禁用
    isDisabled() {
      if (this.selectedCateKey.length !== 3) {
        //选择的不是三级分类  禁用
        return true;
      } else {
        //否则不禁用
        return false;
      }
    },
    // dialog的标题
    titleText() {
      if (this.activeName === "many") {
        return "动态参数";
      } else {
        return "静态属性";
      }
    },
  },
  methods: {
    // 监听dialog的关闭事件
    close() {
      this.addParamsForm = {
        attr_name: "",
      };
    },
    handleChange() {
      if (this.selectedCateKey.length !== 3) {
        this.selectedCateKey = [];
        this.onlyData = [];
        this.manyData = [];
        this.$message.warning("只允许为第三级分类设置相关参数");
      } else {
        this.getParamsList();
      }
    },
    async getCateList() {
      this.cateList = await getGoodsCate();
    },
    // 获取参数列表数据
    async getParamsList() {
      const data = await getParamsList(this.cateId, { sel: this.activeName });
      // 对数据进行处理
      data.forEach((item) => {
        // attr_vals不为空，就将其通过空格分割成一个数组
        item.attr_vals = item.attr_vals.trim() ? item.attr_vals.split(" ") : [];
        // 给每一行添加一个控制动态编辑输入框的显示与隐藏的属性
        item.inputVisible = false;
        item.inputValue = "";
      });
      // 给参数列表进行赋值
      if (this.activeName === "many") {
        this.manyData = data;
      } else {
        this.onlyData = data;
      }
    },
    // 点击tab标签页触发
    handleClick(tab) {
      this.activeName = tab.name;
      if (this.selectedCateKey.length === 3) {
        // 重新请求参数列表数据
        this.getParamsList();
      }
    },
    // 点击按钮 input显示
    showInput(row) {
      // input 输入框显示
      row.inputVisible = true;
      // input自动获取焦点
      this.$nextTick(() => {
        this.$refs.inputRef.focus();
      });
    },
    // 点击提交标签属性
    handleInputConfirm(row) {
      if (row.inputValue.trim()) {
        row.attr_vals.push(row.inputValue);
        this.saveVals(row);
      }
    },
    // 保存参数属性的方法
    async saveVals(row) {
      const obj = {
        attr_id: row.attr_id,
        attr_name: row.attr_name,
        attr_sel: row.attr_sel,
        attr_vals: row.attr_vals.join(" "),
      };
      await saveParams(this.cateId, obj);
      //  提示
      this.$message.success("更新参数项成功");
      // 让输入框进行隐藏
      row.inputVisible = false;
      // 输入框的值清空
      row.inputValue = "";
    },
    // 给tag添加close事件--删除参数项内容
    delAttrValue(idx, row) {
      //  attr_vals数组中删除元素
      row.attr_vals.splice(idx, 1);
      //  更新数据库
      this.saveVals(row);
    },
    // 确定添加参数
    saveParamsList() {
      this.$refs.addParamsRef.validate(async (isOk) => {
        if (isOk) {
          await saveParamsList(this.cateId, {
            attr_name: this.addParamsForm.attr_name,
            attr_sel: this.activeName,
          });
          // 重新渲染页面
          this.getParamsList();
          // 对话框隐藏
          this.addParamsDialogVisible = false;
          // 提示
          this.$message.success(this.titleText + "添加成功");
        } else {
          return false;
        }
      });
    },
  },
};
</script>

<style lang='less' scoped>
.cardlist {
  margin-top: 15px;
  .el-tag {
    margin: 7px;
  }
  .tag-input {
    width: 80px;
    height: 24px;
  }
}
</style>