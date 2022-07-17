<template>
  <div class="upload-container">
    <el-button icon='el-icon-upload' size="small" :style="{background:color,borderColor:color}"
               @click=" dialogVisible=true" type="primary">上传图片
    </el-button>
    <el-dialog append-to-body v-model="dialogVisible" width="20%">
      <div style="width: 150px; margin: 0 auto;">
        <!-- <multi-upload v-model="selectProductPics"></multi-upload> -->

        <el-upload class="editor-slide-upload"
                  :action="ossUploadUrl"
                  :data="dataObj"
                  :multiple="true"
                  :file-list="fileList"
                  :show-file-list="true"
                  list-type="picture-card"
                  :on-remove="handleRemove"
                  :on-success="handleSuccess"
                  :before-upload="beforeUpload">
           <el-icon><Plus /></el-icon>
        </el-upload>
        <br/>
        <el-button @click="dialogVisible = false" size="small" style="float: right">取 消</el-button>
        <el-button type="primary" @click="handleSubmit" size="small" style="float: left">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import {policy} from '@/api/oss';
  import { Plus} from '@element-plus/icons-vue';
  import MultiUpload from '@/components/Upload/multiUpload';
  import {formatDate} from '@/utils/date';
  import {defineComponent, toRefs, reactive} from 'vue'
  export default defineComponent({
    name: 'editorSlideUpload',
    props: {
      color: {
        type: String,
        default: '#1890ff'
      }
    },
    emits: ['successCBK'],
    components: {Plus, MultiUpload},
    setup(props, ctx) {
      const states =  reactive({
        dialogVisible: false,
        // listObj: {},
        fileList: [],
        dataObj: {
          policy: '',
          signature: '',
          key: '',
          ossaccessKeyId: '',
          dir: '',
          host: ''
        },
        ossUploadUrl:'https://douxiaolong-oss.oss-cn-hangzhou.aliyuncs.com',
        dir: '/douxiaolong_mall/images/',
      })

      const methods = reactive({
        // checkAllSuccess() {
        //   return Object.keys(states.listObj).every(item => states.listObj[item].hasSuccess)
        // },
        handleSubmit() {
          ctx.emit('successCBK', states.fileList);
          states.fileList = [];
          states.dialogVisible = false;
        },
        handleRemove() {
          // methods.emitInput();
        },
        handleSuccess(response, file) {
          // const uid = file.uid;
          // const objKeyArr = Object.keys(states.listObj)
          // for (let i = 0, len = objKeyArr.length; i < len; i++) {
          //   if (states.listObj[objKeyArr[i]].uid === uid) {
          //     states.listObj[objKeyArr[i]].url = states.dataObj.host + '/' + states.dataObj.dir + '/' + file.name;
          //     states.listObj[objKeyArr[i]].hasSuccess = true;
          //     return
          //   }
          // }
          console.log('aa')
          const date = new Date();
          states.fileList.length && (states.fileList.pop());
          const dateDir = formatDate(date, 'yyyyMMdd');
          let url = states.ossUploadUrl + states.dir + dateDir + "/" + file.name;
          states.fileList.push({name: file.name, url: url});
          // methods.emitInput(states.fileList);
        },
        // handleRemove(file) {
        //   const uid = file.uid;
        //   const objKeyArr = Object.keys(states.listObj);
        //   for (let i = 0, len = objKeyArr.length; i < len; i++) {
        //     if (states.listObj[objKeyArr[i]].uid === uid) {
        //       delete states.listObj[objKeyArr[i]];
        //       return
        //     }
        //   }
        // },
        beforeUpload() {
          let _self = states;
          return new Promise((resolve, reject) => {
            policy().then(response => {
              _self.dataObj.policy = response.data.policy;
              _self.dataObj.signature = response.data.signature;
              _self.dataObj.ossaccessKeyId = response.data.accessKeyId;
              _self.dataObj.key = response.data.dir + '/${filename}';
              _self.dataObj.dir = response.data.dir;
              _self.dataObj.host = response.data.host;
              // _self.dataObj.callback = response.data.callback;
              resolve(true)
            }).catch(err => {
              console.log(err)
              reject(false)
            })
          })
        },
      })

      return {
        ...toRefs(states),
        ...toRefs(methods)
      }
    }
  })
</script>

<style lang="less" scoped>
  // .upload-container .editor-slide-upload{
  //   margin-bottom: 20px;
  // }
</style>
