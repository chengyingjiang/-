<template>
  <div class="login-wrapper">
    <div class="login-box">
      <!-- logo -->
      <div class="logo-wrapper">
        <img src="@/assets/logo.png" alt="" />
      </div>
      <!-- 登录表单区域 -->
      <el-form
        :model="loginUser"
        label-width="70px"
        :rules="loginRules"
        ref="loginRef"
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="loginUser.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="loginUser.password"></el-input>
        </el-form-item>
        <el-form-item>
          <template>
            <el-button type="primary" @click="loginFn">登录</el-button>
            <el-button type="info">取消</el-button>
          </template>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import { mapActions } from "vuex";
export default {
  name: "login",
  data() {
    var checkPass = function (rule, value, callback) {
      // 验证密码第三位必须是3
      value.charAt(2) === "3"
        ? callback()
        : callback(new Error("密码第三位必须是3"));
    };
    return {
      loginUser: {
        username: "",
        password: "",
      },
      loginRules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          { min: 5, max: 12, message: "密码长度为6~12位", trigger: "blur" },
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          { validator: checkPass, trigger: "blur" },
        ],
      },
    };
  },
  methods: {
    ...mapActions(["user/login"]),
    loginFn() {
      this.$refs["loginRef"].validate(async (isOk) => {
        if (isOk) {
          try {
            await this["user/login"](this.loginUser);
            this.$router.push("/home");
          } catch (error) {
            console.log(error);
          }
        } else {
          return false;
        }
      });
    },
  },
};
</script>

<style lang="less" scoped>
.login-wrapper {
  width: 100%;
  height: 100%;
  background: #2b4b6b;
  .login-box {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 430px;
    height: 250px;
    background: #fff;
    border-radius: 3px;
    .logo-wrapper {
      position: absolute;
      left: 50%;
      transform: translate(-50%, -50%);
      padding: 10px;
      width: 150px;
      height: 150px;
      background: #fff;
      border-radius: 50%;
      box-shadow: 0 0 10px #ddd;
      overflow: hidden;
      box-sizing: border-box;
      img {
        width: 100%;
        height: 100%;
        border-radius: 50%;
        background: #eee;
      }
    }
    .el-form {
      padding: 0 15px;
      position: absolute;
      bottom: 0;
      width: 100%;
      box-sizing: border-box;
      :deep(.el-form-item) {
        &:last-child {
          .el-form-item__content {
            display: flex;
            justify-content: flex-end;
          }
        }
      }
    }
  }
}
</style>