<template>
  <div>
    <nav>发布文章</nav>
    <el-form ref="form" :model="form" label-width="80px">
      <el-form-item label="文章标题">
        <el-input v-model="form.title"></el-input>
      </el-form-item>
      <el-form-item label="类型">
        <el-radio-group v-model="form.type">
          <el-radio :label="1">文章</el-radio>
          <el-radio :label="2">视频</el-radio>
        </el-radio-group>
      </el-form-item>
      <!-- 富文本 -->
      <el-form-item label="内容" v-if="form.type===1">
        <vue-editor
          v-model="form.content"
          id="editor"
          useCustomImageHandler
          @image-added="handleImageAdded"
        ></vue-editor>
      </el-form-item>
      <!-- 栏目 -->
      <el-form-item label="栏目">
        <el-checkbox-group v-model="form.categories">
          <!-- lable属性关联form.categories的数组值 -->
          <!-- API参数categories取栏目的id值 -->
          <!-- form.categories=[999,1,2] -->
          <el-checkbox :label="item.id" v-for="(item,index) in menus" :key="index">{{item.name}}</el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <!-- 封面 -->
      <el-form-item label="封面">
        <el-upload
          :action="$axios.defaults.baseURL +'/upload'"
          :headers="{
             Authorization:token 
              }"
          list-type="picture-card"
          :on-preview="handlePictureCardPreview"
          :on-remove="handleRemove"
          :on-success="handleImgSuccess"
          :file-list="fileList"
        >
          <i class="el-icon-plus"></i>
        </el-upload>
        <el-dialog :visible.sync="dialogVisible">
          <img width="100%" :src="dialogImageUrl" alt />
        </el-dialog>
      </el-form-item>
      <!-- 视频 -->
      <el-form-item label="视频" v-if="form.type===2">
        <el-upload
          class="upload-demo"
          :action="$axios.defaults.baseURL+'/upload'"
          :headers="{
            Authorization:token  }"
          :on-preview="handlePreview"
          :on-remove="handleVideoRemove"
          :before-remove="beforeRemove"
          :limit="1"
          :on-success="handleVideoSuccess"
        >
          <el-button size="small" type="primary">点击上传</el-button>
          <div slot="tip" class="el-upload__tip">只能上传Mp4文件</div>
        </el-upload>
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
      form: {
        title: "",
        cover: [],
        type: 1,
        content: "",
        // 栏目id信息集合
        categories: []
      },
      token: "",
      //请求的栏目数据
      menus: [],
      dialogImageUrl: "",
      dialogVisible: false,
      //   存封面图片对象的请求的数据
      fileList: []
    };
  },
  mounted() {
    const { token } = JSON.parse(localStorage.getItem("userInfo"));
    this.token = token;
    this.$axios({
      url: "/category",
      headers: {
        Authorization: token
      }
    }).then(res => {
      const { data } = res.data;
      //   console.log(data);
      data.splice(0, 1);
      this.menus = data;
    });
    // 请求当前文章数据用于返显页面
    this.$axios({
      url: "/post/" + this.$route.params.id
    }).then(res => {
      const { data } = res.data;
      console.log(data);
      this.form.title = data.title;
      this.form.type = data.type;
      this.form.content = data.content;
      this.form.categories = data.categories.map(v => {
        return v.id;
      });
      this.fileList = data.cover.map(v => {
        v.url = this.$axios.defaults.baseURL + v.url;
        return v;
      });
      console.log(this.fileList);
    });
  },
  methods: {
    //   视频文件处理
    handleVideoRemove(file, fileList) {
      console.log(file, fileList);
    },
    handlePreview(file) {
      console.log(file);
    },

    handleVideoSuccess: function(response, file, fileList) {
      this.form.content = response.data.url;
    },
    beforeRemove(file, fileList) {
      return this.$confirm(`确定移除 ${file.name}？`);
    },

    onSubmit() {
      console.log(this.form);
      //处理栏目的id数据
      this.form.categories = this.form.categories.map(v => {
        return {
          id: v
        };
      });
      // 如果没有上传新图片的话fileList为空
      //   上传的文件没有v.id值,id值在response中
      this.form.cover = this.fileList.map(v => {
        return {
          id: v.id || v.response.data.id
        };
      });
      console.log(this.form);
      const roule = [
        { value: this.form.title === "", message: "标题不能为空" },
        { value: this.form.content === "", message: "内容不能为空" },
        { value: this.form.type === "", message: "类型不能为空" },
        { value: this.form.categories === "", message: "栏目不能为空" },
        { value: this.form.cover === "", message: "封面不能为空" }
      ];
      let flag = true;
      roule.forEach(v => {
        if (!flag) return;
        if (v.value) {
          this.$message.warning(v.message);
          this.flag = false;
        }
      });
      //   如果有一个值为空,那么flag值为false,不发请求
      if (!flag) return;
      this.$axios({
        url: "/post_update/" + this.$route.params.id,
        headers: {
          Authorization: this.token
        },
        method: "POST",
        data: this.form
      }).then(res => {
        console.log(res);
        const { message } = res.data;
        this.$message.success(message);
        this.$router.push("/");
      });
    },
    // 文件移除
    handleRemove(file, fileList) {
      this.fileList = fileList;
    },
    // 文件预览
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    //文件上传成功
    // 如果在返显的时候没有重新上传.不会触发给fileList赋值,所以此时filelist是空
    handleImgSuccess: function(response, file, fileList) {
      this.fileList = fileList;
      console.log(fileList);
    },
    // 富文本中的图片上传处理
    handleImageAdded: function(file, Editor, cursorLocation, resetUploader) {
      var formData = new FormData();
      formData.append("file", file);

      this.$axios({
        url: "/upload",
        method: "POST",
        data: formData,
        headers: {
          Authorization: this.token
        }
      })
        .then(result => {
          console.log(result);

          let url = result.data.data.url; // Get url from response
          //   返显的图片路径有问题
          //   Editor.insertEmbed(cursorLocation, "image", url);
          Editor.insertEmbed(
            cursorLocation,
            "image",
            this.$axios.defaults.baseURL + url
          );

          resetUploader();
        })
        .catch(err => {
          console.log(err);
        });
    }
  }
};
</script>

<style>
</style>