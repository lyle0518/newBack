<template>
  <div class="box">
    <div class="userLogin">
      <div class="logo">
        <span class="iconfont iconnew"></span>
      </div>
      <div class="container">
        <!-- 表示声明当前表单的规则 -->
        <el-form
          :model="form"
          ref="form"
          label-width="80px"
          :rules="rules"
          class="from"
        >
          <el-form-item label="账号" prop="username">
            <el-input v-model="form.username"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input v-model="form.password" type="password"></el-input>
          </el-form-item>
          <el-form-item class="btn">
            <el-button type="primary" @click="onSubmit">登录</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      form: {
        username: "",
        password: ""
      },
      rules: {
        username: [
          { required: true, message: "请输入手机号码", trigger: "blur" },
          { min: 11, max: 11, message: "手机号码格式错误", trigger: "blur" }
        ],

        password: [{ required: true, message: "请输入密码", trigger: "blur" }]
      }
    };
  },
  methods: {
    onSubmit() {
      this.$refs.form.validate(valid => {
        if (valid) {
          // 请求
          this.$axios({
            url: "/login",
            method: "POST",
            data: this.form
          }).then(res => {
            const { data } = res.data;
            console.log(data);
            if (data.user.role.type !== "admin") {
              this.$message({
                message: "当前用户没有权限,必须是管理员",
                type: "warning"
              });
              return;
            }
            // 如果是管理员,type=admin
            localStorage.setItem("userInfo", JSON.stringify(data));
            this.$message({
              message: "登录成功",
              type: "success"
            });
            // 跳转到首页
            this.$router.push("/");
          });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    }
  }
};
</script>

<style scoped lang="less">
.box {
  background: url("https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1586619988405&di=ee806411bcee200f2df61797d53d943a&imgtype=0&src=http%3A%2F%2Fimg70.nipic.com%2Ffile%2F20151208%2F19985178_133530144714_1.jpg")
    no-repeat;
  background-size: cover;
  height: 100vh;
  position: relative;
}

.userLogin {
  position: absolute;
  background-color: #eee;
  left: 50%;
  top: 50%;
  transform: translateX(-50%) translateY(-50%);
  padding: 20px;
  box-shadow: 0px 0px 20px #eee;
}

.logo {
  span {
    // position: absolute;
    // top: 10%;
    // left: 50%;
    // transform: translateX(-40%);
    display: flex;
    justify-content: center;
    font-size: 300px;
    color: red;
  }
}
.container {
  display: flex;
  justify-content: center;
  align-items: center;
}
.from {
  width: 400px;
}

/deep/.el-form-item__label {
  text-align: center;
}
.btn {
  display: flex;
  justify-content: center;
  /deep/.el-form-item__content {
    margin-left: 0 !important;
  }
}
</style>
