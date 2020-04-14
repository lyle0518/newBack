<template>
  <div>
    <el-container>
      <el-header>
        <Header :data="userInfo"></Header>
      </el-header>
      <el-container>
        <el-aside width="200px">
          <Side></Side>
        </el-aside>
        <el-main>
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import Header from "@/components/Header.vue";
import Side from "@/components/Side.vue";

export default {
  components: {
    Header,
    Side
  },
  data() {
    return {
      userInfo: {
        user: ""
      }
    };
  },
  mounted() {
    this.userInfo = JSON.parse(localStorage.getItem("userInfo")) || {};
    console.log(this.userInfo);
  },
  methods: {}
};
</script>

<style scoped lang="less">
.el-header {
  padding: 0;
}

.el-footer {
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

    img {
      width: 24px;
      height: 24px;
      border-radius: 50%;
      object-fit: cover;
      margin-right: 10px;
    }
  }
}

.el-aside {
  background-color: #545c64;
  color: #333;
  text-align: center;
}

.el-main {
  background-color: #e9eef3;
  color: #333;
  text-align: center;
  line-height: 160px;
  overflow-y: auto;
  height: 100vh;
}

.el-container:nth-child(5) .el-aside,
.el-container:nth-child(6) .el-aside {
  line-height: 260px;
}

.el-container:nth-child(7) .el-aside {
  line-height: 320px;
}
.el-col-12 {
  width: 100%;
}
.el-menu {
  border-right: 0;
}
</style>
