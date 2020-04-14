<template>
  <div>
    <h2>编辑文章页面</h2>
    <el-form ref="form" :model="form" label-width="80px" class="form">
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
          :action="$axios.defaults.baseURL + '/upload'"
          :limit="1"
          :headers="{
           Authorization: token
          }"
          :on-success="handleVideoSuccess"
          :on-remove="handleVideoRemove"
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
        <!-- useCustomImageHandler 使用自定义的图片上传 -->
        <!-- @image-added="handleImageAdded"点击上传是触发的事件 -->
        <vue-editor
          v-model="form.content"
          id="editor"
          useCustomImageHandler
          @image-added="handleImageAdded"
        ></vue-editor>
      </el-form-item>

      <!-- 图片上传 -->
      <!-- :file-list="fileList"  上传的图片列表 -->
      <el-form-item label="封面上传">
        <el-upload
          :action="$axios.defaults.baseURL+'/upload'"
          :headers="{
                Authorization :token
          }"
          :on-success="handleImgSuccess"
          list-type="picture-card"
          :on-preview="handlePictureCardPreview"
          :on-remove="photoRemove"
          :file-list="fileList"
        >
          <i class="el-icon-plus"></i>
        </el-upload>
        <el-dialog :visible.sync="dialogVisible">
          <img width="100%" :src="dialogImageUrl" alt />
        </el-dialog>
      </el-form-item>
      <!-- 提交按钮 -->
      <el-form-item>
        <el-button type="primary" @click="onSubmit">编辑</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { VueEditor } from "vue2-editor";
// import func from "../../vue-temp/vue-editor-bridge";
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
      //   存储上传的图片列表地址
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
    //请求文章数据
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
    });
  },
  methods: {
    // 富文本上传图片的方法
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
          let url = result.data.data.url; // Get url from response
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
    },
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
      console.log(this.fileList);
    },
    // 视频上传事件
    handleVideoSuccess(response, file, fileList) {
      console.log(response);
      this.form.content = response.data.url;
    },
    // 视频移除事件
    handleVideoRemove(response, file, fileList) {},
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
          id: v.id || v.response.data.id
        };
      });
      console.log(this.form);

      // 表单验证
      const rules = [
        {
          value: this.form.title.trim() === "",
          message: "标题不能为空"
        },
        {
          value: this.form.content.trim() === "",
          message: "内容不能为空"
        },
        {
          value: this.form.categories.length === 0,
          message: "栏目不能为空"
        },
        {
          value: this.form.cover.length === 0,
          message: "封面不能为空"
        }
      ];
      let flag = true;
      rules.forEach(v => {
        if (!flag) return;
        if (v.value) {
          this.$message.warning(v.message);
          flag = false;
        }
      });
      // 如果flag值不是为true，则不往下执行
      if (!flag) return;
      // 发送请求
      this.$axios({
        url: "/post_update/" + this.$route.params.id,
        method: "POST",
        data: this.form,
        headers: {
          Authorization: this.token
        }
      }).then(res => {
        const { message } = res.data;
        this.$message.success(message);
        this.$router.replace("/post-list");
      });
    }
  }
};
</script>

<style scoped lang="less">
.editor /deep/ .el-form-item__content {
  line-height: 0;
}
.form {
  margin-top: 40px;
}
</style>
