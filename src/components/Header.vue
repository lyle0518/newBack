<template>
  <div class="header">
    <div class="logo">
      <router-link to="/login">
        <span class="iconfont iconnew"></span>
      </router-link>
    </div>
    <el-dropdown trigger="click">
      <span class="el-dropdown-link">
        <div class="user">
          <img :src="$axios.defaults.baseURL + data.user.head_img" alt="" />
          <span class="user-name">{{ data.user.nickname }}</span>
          <i class="el-icon-arrow-down el-icon--right"></i>
        </div>
      </span>
      <!-- 下拉栏 -->
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item icon="el-icon-circle-check" @click.native="handleback"
          >退出登录</el-dropdown-item
        >
      </el-dropdown-menu>
    </el-dropdown>
  </div>
</template>

<script>
export default {
  props: ["data"],
  methods: {
    // 退出登录
    handleback() {
      localStorage.removeItem("userInfo");
      this.$message("退出成功");
      this.$router.push("/login");
    }
  }
};
</script>

<style scoped lang="less">
.el-dropdown-menu {
  width: 190px !important;
  left: 1293px;
  text-align: center;
}
.el-dropdown-link {
  cursor: pointer;
  color: #ffffff;
}
.el-icon-arrow-down {
  font-size: 12px;
}
.demonstration {
  display: block;
  color: #8492a6;
  font-size: 14px;
  margin-bottom: 20px;
}
.header {
  background-color: #4f84ba;
  color: #333;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #fff;
  padding-left: 0;

  .logo {
    width: 200px;
    height: 60px;
    text-align: center;
    line-height: 60px;
    .iconnew {
      font-size: 85px;
    }
  }

  .user {
    display: flex;
    align-items: center;
    margin-right: 30px;
    img {
      width: 24px;
      height: 24px;
      border-radius: 50%;
      object-fit: cover;
      margin-right: 10px;
    }
  }
}
</style>
