<template>
  <div class="userslist">
    <!-- 面包屑 -->
    <bread-crumb :menuList="menuList"></bread-crumb>
    <el-card class="cardlist">
      <el-row :gutter="20">
        <el-col :span="6">
          <div class="grid-content bg-purple">
            <el-input
              placeholder="请输入搜索内容"
              v-model="objPosition.query"
              class="input-with-select"
            >
              <el-button
                @click="getUsersData"
                slot="append"
                icon="el-icon-search"
              ></el-button>
            </el-input>
          </div>
        </el-col>
        <el-col :span="18">
          <div class="grid-content bg-purple">
            <el-button type="primary" @click="add">添加用户</el-button>
          </div>
        </el-col>
      </el-row>
      <!-- 表格组件 -->
      <table-option
        :tableData="users"
        :tableColumnOptions="tableColumnOptions"
        @editEvent="edit"
        @delEvent="deleteFn"
      >
        <template #setting="{ row }">
          <el-tooltip
            class="item"
            effect="dark"
            content="分配角色"
            placement="top"
          >
            <el-button
              type="warning"
              size="mini"
              icon="el-icon-s-tools"
              @click="setRole(row)"
            ></el-button>
          </el-tooltip>
        </template>
      </table-option>
      <!-- 分页 
      current-page	当前页数，支持 .sync 修饰符	number	—	1
      page-sizes	每页显示个数选择器的选项设置	number[]	—	[10, 20, 30, 40, 50, 100]
      page-size	每页显示条目个数，支持 .sync 修饰符	number	—	10
      size-change	pageSize 改变时会触发	每页条数
current-change	currentPage 改变时会触发	当前页
      -->
      <pagin-ation
        :page.sync="objPosition.pagenum"
        :limit.sync="objPosition.pagesize"
        :total="total"
        @pagination="getUsersData"
      ></pagin-ation>
    </el-card>
    <!-- 添加/编辑的dialog -->
    <edit-dialog
      :dialogVisible.sync="formVisible"
      :formRules="formRules"
      :formData="formObj"
      @sumEvent="submitFun"
    >
      <template #formItem="{ row }">
        <el-form-item prop="username" label="用户名" label-width="80px">
          <el-input
            :disabled="Boolean(row.formData.id)"
            v-model="row.formData.username"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item
          prop="password"
          v-if="row.isAdd"
          label="密码"
          label-width="80px"
        >
          <el-input
            v-model="row.formData.password"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item prop="email" label="邮箱" label-width="80px">
          <el-input v-model="row.formData.email" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile" label-width="80px">
          <el-input v-model="row.formData.mobile" autocomplete="off"></el-input>
        </el-form-item>
      </template>
    </edit-dialog>
    <!-- 分配角色 -->
    <el-dialog :visible.sync="rolesVisible" title="分配角色">
      <div class="userinfo">
        <p>当前用户:{{ userinfo.username }}</p>
        <p>当前角色:{{ userinfo.role_name }}</p>
        <p>
          分配新角色:
          <el-select v-model="roleId" placeholder="请选择">
            <el-option
              v-for="item in roleList"
              :key="item.id"
              :label="item.roleName"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </p>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="rolesVisible = false">取消</el-button>
        <el-button type="primary" @click="setRoles">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  getUserData,
  deleteUser,
  addUser,
  editUser,
  setRoles,
  putUserState,
} from "@/api/user";
import { getRole } from "@/api/role";
import { validMobile } from "@/utils/vilidate";
import EditDialog from "./components/EditDialog.vue";
import TableOption from "@/components/TableOption.vue";
import PaginAtion from "@/components/PaginAtion.vue";
import BreadCrumb from "@/components/BreadCrumb.vue";
export default {
  components: { EditDialog, TableOption, PaginAtion, BreadCrumb },
  data() {
    return {
      menuList: ["用户管理", "用户列表"],
      userinfo: {}, //分配角色信息
      roleId: "",
      roleList: [],
      rolesVisible: false,
      // 添加
      formVisible: false, //添加弹框的显示隐藏
      // 表单域标签的宽度
      formLabelWidth: "120px",
      formObj: {
        username: "",
        password: "",
        email: "",
        mobile: "",
      },
      // 添加表单的验证规则
      formRules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
        ],
        password: [{ required: true, message: "请输入密码", trigger: "blur" }],
        email: [
          { required: true, message: "请输入邮箱", trigger: "blur" },
          {
            type: "email",
            message: "输入正确的邮箱格式",
            trigger: ["blur", "change"],
          },
        ],
        mobile: [
          { required: true, message: "请输入手机号", trigger: "blur" },
          { validator: validMobile, trigger: "blur" },
        ],
      },
      users: [],
      objPosition: {
        query: "",
        pagenum: 1, //当前页码
        pagesize: 5, //每页的条数
      },
      total: 0, //总数量
      tableColumnOptions: [
        { label: "姓名", prop: "username" },
        { label: "邮箱", prop: "email" },
        { label: "电话", prop: "mobile" },
        { label: "角色", prop: "role_name" },
      ],
    };
  },
  mounted() {
    //  数据请求
    this.getUsersData();
  },
  methods: {
    add() {
      this.formVisible = true;
    },
    // 更新用户的状态
    async changState(row) {
      // row  获取到当前行的数据
      // console.log(row, 'state')
      const res = await putUserState({ id: row.id, mg_state: row.mg_state });
      // 提示更新成功
      this.$message.success("用户状态更新成功");
    },
    // 点击分配角色确定按钮
    async setRoles() {
      //  调用分配角色接口
      let res = await setRoles(this.userinfo.id, { rid: this.roleId });
      // console.log(res)
      // 1提示
      this.$message.success("分配角色成功");
      // 2重新渲染数据
      this.getUsersData();
      // 3 关闭模态框
      this.rolesVisible = false;
    },
    async getRoleList() {
      let res = await getRole();
      this.roleList = res;
    },
    // 点击分配角色
    setRole(row) {
      // 显示模态框
      this.rolesVisible = true;
      // 回显
      this.userinfo = row;
      // 获取角色列表数据
      this.getRoleList();
    },
    // 编辑用户
    edit(row) {
      // 数据回显
      this.formObj = row;
      // 模态框显示
      this.formVisible = true;
    },
    /*
    删除单个用户
    methods中定义删除的方法
      - confirm询问是否要删除
      - 确定   调用删除的api接口  提示删除成功
      - 取消   提示
    */
    deleteFn(id) {
      this.$confirm("确定要永久删除该条数据吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          // 点击确定 请求删除的api接口
          await deleteUser(id);
          // 重新渲染数据
          this.getUsersData();
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
    // 点击确定实现添加和编辑
    async submitFun() {
      if (this.formObj.id) {
        // 编辑
        await editUser(this.formObj);
        this.$message.success("修改成功");
      } else {
        // 添加
        // 发送添加用户的请求   this.addObj
        await addUser(this.formObj);
        //  提示
        this.$message.success("添加成功");
        // 重新渲染数据
        this.getUsersData();
        // 清空表单内容
        this.formObj = {
          username: "",
          password: "",
          email: "",
          mobile: "",
        };
      }
      // 关闭添加弹框
      this.formVisible = false;
    },
    async getUsersData() {
      let { total, users } = await getUserData(this.objPosition);
      this.users = users;
      this.total = total;
    },
  },
};
</script>

<style lang="less" scoped>
.cardlist {
  margin-top: 15px;
}
</style>
