<template>
  <div>
    <el-upload
      :action="useOss?ossUploadUrl:minioUploadUrl"
      :data="useOss?dataObj:null"
      list-type="picture"
      :multiple="false" :show-file-list="showFileList"
      :file-list="fileList"
      :before-upload="beforeUpload"
      :on-remove="handleRemove"
      :on-success="handleUploadSuccess"
      :on-preview="handlePreview">
      <el-button size="small" type="primary">点击上传</el-button>
      <template #tip>
        <div class="el-upload__tip">只能上传jpg/png文件，且不超过10MB</div>
      </template>
    </el-upload>
    <el-dialog v-model="dialogVisible">
      <img width="100%" :src="fileList[0].url" alt="">
    </el-dialog>
  </div>
</template>
<script>
  import {policy} from '@/api/oss';
  import {formatDate} from '@/utils/date';
  import {defineComponent, reactive, toRefs, watch} from 'vue'

  export default defineComponent({
    props: {
      modelValue: String
    },
    emits: ['update:modelValue'],
    setup(props, ctx){
      const states = reactive({
        dataObj: {
          policy: '',
          signature: '',
          key: '',
          ossaccessKeyId: '',
          dir: '',
          host: '',
          // callback:'',
        },
        dialogVisible: false,
        useOss:true, //使用oss->true;使用MinIO->false
        ossUploadUrl:'https://douxiaolong-oss.oss-cn-hangzhou.aliyuncs.com',
        dir: '/douxiaolong_mall/images/',
        minioUploadUrl:'http://localhost:8080/minio/upload',
        fileList: [],
        showFileList: false,
        isDone: false
      });

      const methods = reactive({
        emitInput(val) {
          ctx.emit('update:modelValue', val);
        },
        handleRemove() {
          methods.emitInput('');
        },
        handlePreview() {
          states.dialogVisible = true;
        },
        beforeUpload() {
          let _self = states;
          if(!states.useOss){
            //不使用oss不需要获取策略
            return true;
          }
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
        handleUploadSuccess(res, file) {
          states.showFileList = true;
          
          const date = new Date();
          states.fileList.length && (states.fileList.pop());
          // console.log(states.fileList);
          states.fileList.pop();
          const dateDir = formatDate(date, 'yyyyMMdd');
          let url = states.ossUploadUrl + states.dir + dateDir + "/" + file.name;
          
          if(!states.useOss){
            //不使用oss直接获取图片路径
            url = res.data.url;
          }
          states.fileList.push({name: file.name, url: url});
          methods.emitInput(states.fileList[0].url);
          // console.log(states.fileList);
        }
      });

      const unwatch = watch(()=>props.modelValue, function(newValue){
        if(newValue){
          states.fileList.push({'name': newValue.substr(newValue.lastIndexOf("/") + 1), 'url': newValue});
          states.showFileList = true;
          unwatch();
        }
        
      });
      return {
        ...toRefs(states),
        ...toRefs(methods)
      }
    }
  })
</script>
<style>

</style>


