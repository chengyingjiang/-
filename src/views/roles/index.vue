<template>
  <div class="roles">
    <bread-crumb :menuList="menuList"></bread-crumb>
    <el-card>
      <el-button type="primary" @click="add">添加角色</el-button>
      <!-- 
        border	是否带有纵向边框	boolean	—	false
        data	显示的数据	array
        row-key  行数据的 Key，用来优化 Table 的渲染；
       -->
      <el-table :data="roles" :border="true" row-key="id" class="userList">
        <!-- type  如果设置了 expand 则显示为一个可展开的按钮 如果设置了 index 则显示该行的索引（从 1 开始计算）
        label	显示的标题	string 
        prop	对应列内容的字段名，也可以使用 property 属性	string
        -->
        <el-table-column type="expand">
          <template slot-scope="{ row }">
            <div class="user-rights">
              <!-- 一级权限 -->
              <el-row
                :class="[
                  'btop',
                  { bbottom: index === row.children.length - 1 },
                ]"
                v-for="(item1, index) in row.children"
                :key="item1.id"
              >
                <el-col :span="5">
                  <el-tag closable @close="delRights(row, item1.id)">{{
                    item1.authName
                  }}</el-tag>
                  <i class="el-icon-caret-right"></i>
                </el-col>
                <!-- 二级和三级权限 -->
                <el-col :span="19">
                  <el-row
                    :class="{ btop: index !== 0 }"
                    v-for="(item2, index) in item1.children"
                    :key="item2.id"
                  >
                    <el-col :span="6">
                      <el-tag
                        closable
                        type="success"
                        @close="delRights(row, item2.id)"
                        >{{ item2.authName }}</el-tag
                      >
                      <i class="el-icon-caret-right"></i>
                    </el-col>
                    <!-- 三级权限 -->
                    <el-col :span="18">
                      <el-tag
                        type="warning"
                        closable=""
                        v-for="item3 in item2.children"
                        :key="item3.id"
                        @close="delRights(row, item3.id)"
                        >{{ item3.authName }}</el-tag
                      >
                    </el-col>
                  </el-row>
                </el-col>
              </el-row>
            </div>
          </template>
        </el-table-column>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column label="角色名称" prop="roleName"></el-table-column>
        <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="{ row }">
            <el-button type="primary" icon="el-icon-edit" size="mini"
              >编辑</el-button
            >
            <el-button type="danger" icon="el-icon-delete" size="mini"
              >删除</el-button
            >
            <el-button
              type="warning"
              icon="el-icon-setting"
              size="mini"
              @click="showSetRightsDialog(row)"
              >分配权限</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- 分配权限 -->
    <el-dialog :visible.sync="setRightDialogVisible" title="分配权限">
      <!-- data	展示数据	array
    props	配置选项，具体看下表	object
    default-checked-keys	默认勾选的节点的 key 的数组	array
    node-key	每个树节点用来作为唯一标识的属性，整棵树应该是唯一的	String
     -->
      <el-tree
        ref="rightsRef"
        :data="rightsList"
        :props="rightsProps"
        show-checkbox
        default-expand-all
        :default-checked-keys="defaultKeys"
        node-key="id"
      >
      </el-tree>
      <template #footer>
        <el-button>取消</el-button>
        <el-button type="primary" @click="setRights">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { getRole, delRoleRight, setRoleRight } from "@/api/role";
import { getRight } from "@/api/right";
import { getLeafkeys } from "@/utils/tool";
import BreadCrumb from "@/components/BreadCrumb.vue";
export default {
  components: { BreadCrumb },
  data() {
    return {
      menuList: ["权限管理", "角色列表"],
      roles: [],
      setRightDialogVisible: false,
      rightsList: [], //权限列表
      // label	指定节点标签为节点对象的某个属性值	string, function(data, node)	—	—
      // children	指定子树为节点对象的某个属性值	string
      rightsProps: {
        label: "authName",
        children: "children",
      },
      defaultKeys: [],
      roleid: "",
    };
  },
  mounted() {
    this.getData();
  },
  methods: {
    // 获取角色列表数据
    async getData() {
      this.roles = await getRole();
    },
    // 删除角色指定的权限
    delRights(row, rightid) {
      this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          const data = await delRoleRight({ roleid: row.id, rightid: rightid });
          // 角色权限重新渲染
          row.children = data;
          this.$message.success("删除角色对应的权限成功");
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    // 点击分配权限
    async showSetRightsDialog(row) {
      // 保存角色id
      this.roleid = row.id;
      // 获取权限列表数据，显示权限
      this.rightsList = await getRight("tree");
      // 获取所有的三级子节点的key值
      getLeafkeys(row, this.defaultKeys);
      // 权限弹框显示
      this.setRightDialogVisible = true;
    },
    // 点击确定按钮分配权限
    async setRights() {
      // 保存被选中节点的key和半选中节点的key
      const keys = [
        ...this.$refs.rightsRef.getCheckedKeys(),
        ...this.$refs.rightsRef.getHalfCheckedKeys(),
      ];
      // 发送角色授权的请求
      await setRoleRight(this.roleid, { rids: keys.join(",") });
      // 重新渲染角色列表
      this.getData();
      // 关闭弹框
      this.setRightDialogVisible = false;
      // 提示
      this.$message.success("角色授权成功");
    },
  },
};
</script>

<style lang="less" scoped>
.el-card {
  margin-top: 15px;
  .userList {
    margin-top: 15px;
    .user-rights {
      padding: 20px 50px;
      box-sizing: border-box;
      .el-row {
        display: flex;
        align-items: center;
        &.btop {
          border-top: 1px solid #eee;
        }
        &.bbottom {
          border-bottom: 1px solid #eee;
        }
        .el-tag {
          margin: 10px;
        }
      }
    }
  }
}
</style>