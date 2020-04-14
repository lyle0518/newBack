<template>
  <div>
    <el-form ref="form" :model="form" label-width="80px">
      <el-form-item label="标题">
        <el-input v-model="form.title"></el-input>
      </el-form-item>

      <!-- 单选框 -->
      <el-form-item label="类型">
        <el-radio-group v-model="form.type">
          <el-radio :label="1">文章</el-radio>
          <el-radio :label="2">视频</el-radio>
        </el-radio-group>
      </el-form-item>

      <!-- 视频上传 -->
      <el-form-item label="视频文件" v-if="form.type === 2">
        <el-upload
          class="upload-demo"
          action="https://jsonplaceholder.typicode.com/posts/"
          :on-remove="handleRemove"
          :limit="1"
        >
          <el-button size="small" type="primary">点击上传</el-button>
          <div slot="tip" class="el-upload__tip">只能上传mp4,avi文件，且不超过2M</div>
        </el-upload>
      </el-form-item>
      <!-- 多选框 -->
      <el-form-item label="栏目">
        <el-checkbox-group v-model="form.categories">
          <el-checkbox
            :label="item.id"
            name="type"
            v-for="(item,index) in menus"
            :key="index"
          >{{item.name}}</el-checkbox>
        </el-checkbox-group>
      </el-form-item>

      <!-- 单选，单选使用el-radio-group，文档地址：https://element.eleme.cn/#/zh-CN/component/form#biao-dan-yan-zheng
      里面的特殊资源-->
      <el-form-item label="内容" v-if="form.type === 1" class="editor">
        <vue-editor v-model="form.content"></vue-editor>
      </el-form-item>

      <!-- 图片上传 -->

      <el-form-item label="封面上传" v-if="form.type === 1">
        <el-upload
          :action="$axios.defaults.baseURL+'/upload'"
          :headers="{
                Authorization :token
          }"
          :on-success="handleImgSuccess"
          list-type="picture-card"
          :on-preview="handlePictureCardPreview"
          :on-remove="photoRemove"
        >
          <i class="el-icon-plus"></i>
        </el-upload>
        <el-dialog :visible.sync="dialogVisible">
          <img width="100%" :src="dialogImageUrl" alt />
        </el-dialog>
      </el-form-item>
      <!-- 提交按钮 -->
      <el-form-item>
        <el-button type="primary" @click="onSubmit">立即创建</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { VueEditor } from "vue2-editor";
export default {
  components: {
    VueEditor
  },
  data() {
    return {
      // 表单的数据对象
      form: {
        title: "",
        // type: 1,
        content: "",
        // 控制默认按钮选择,点击按钮type变化为按钮label值
        type: 1,
        // 栏目id的集合,文章发布接口需要的参数 [{id:1}]
        categories: [],
        // 图片的id [{id:1}]
        cover: []
      },
      dialogImageUrl: "",
      dialogVisible: false,
      menus: [],
      token: "",
      fileList: []
    };
  },
  mounted() {
    const { token } = JSON.parse(localStorage.getItem("userInfo"));
    this.token = token;
    //请求栏目
    this.$axios({
      url: "/category"
    }).then(res => {
      const { data } = res.data;
      // 不需要头条的栏目.头条有所有文章类型
      data.splice(0, 1);
      this.menus = data;
    });
  },
  methods: {
    //  预览图片的事件
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    // 移除已经上传的图片
    photoRemove(file, fileList) {
      // console.log(fileList);

      this.fileList = fileList;
    },

    // 图片上传成功触发
    handleImgSuccess(response, file, fileList) {
      console.log(fileList);
      this.fileList = fileList;
    },
    beforeRemove(file, fileList) {
      return this.$confirm(`确定移除 ${file.name}？`);
    },
    onSubmit() {
      // 修改栏目的id数据
      this.form.categories = this.form.categories.map(v => {
        return {
          id: v
        };
      });
      // 上传图片的id
      this.form.cover = this.fileList.map(v => {
        return {
          id: v.response.data.id
        };
      });
      console.log(this.form);
      // 发送请求
      this.$axios({
        url:'/post',
        method:'POST',
        data:this.form,
        headers:{
          Authorization:this.token
        }
      }).then(res=>{
        const {message}=res.data;
        this.$message.success(message)

      })
    }
  }
};
</script>

<style scoped lang="less">
.editor /deep/ .el-form-item__content {
  line-height: 0;
}
</style>
