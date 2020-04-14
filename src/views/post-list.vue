<template>
  <div>
    <el-table :data="tableData" style="width: 100%">
      <el-table-column prop="title" label="标题" width="180"></el-table-column>
      <el-table-column label="类型" width="180">
        <template slot-scope="scope">
          {{
          scope.row.type === 1 ? "文章" : "视频"
          }}
        </template>
      </el-table-column>
      <el-table-column prop="address" label="时间">
        <template slot-scope="scope">
          {{
          moment(scope.row.create_date).format("YYYY-MM-DD hh:mm:ss")
          }}
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <router-link :to="`edit-post/${scope.row.id}`">
            <el-button size="mini">编辑</el-button>
          </router-link>
          <el-button size="mini" type="danger" @click="handleDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页器 -->
    <div class="block">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="pageIndex"
        :page-sizes="[5, 10, 15, 20]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </div>
  </div>
</template>

<script>
import moment from "moment";
export default {
  data() {
    return {
      tableData: [],
      userInfo: [],
      moment,
      total: 0,
      pageIndex: 1,
      pageSize: 5
    };
  },
  mounted() {
    this.userInfo = JSON.parse(localStorage.getItem("userInfo"));
    this.getList();
  },
  methods: {
    // 删除文章
    handleDelete(item) {
      this.$confirm("此操作将永久删除该文章, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        this.$axios({
          url: "/post_update/" + item.id,
          method: "Post",
          data: {
            open: 0
            //修改属性open为0则为删除文章
          },
          headers: {
            Authorization: this.userInfo.token
          }
        }).then(res => {
          const { message } = res.data;
          this.$message({
            type: "success",
            message: "删除成功!"
          });
          this.getList();
        });
      });
    },
    handleSizeChange(val) {
      this.pageIndex = val;
      this.getList();
    },
    handleCurrentChange(val) {
      this.pageIndex = val;
      this.getList();
    },
    //   获取文章列表,请求categoty=999热点的文章,默认显示所有文章
    getList() {
      this.$axios({
        url: "/post",
        params: {
          category: 999,
          pageIndex: this.pageIndex,
          pageSize: this.pageSize
        },
        headers: {
          Authorization: this.userInfo.token
        }
      }).then(res => {
        console.log(res);

        const { data, total } = res.data;
        this.tableData = data;
        this.total = total;
        console.log(this.tableData);
      });
    }
  }
};
</script>

<style></style>
