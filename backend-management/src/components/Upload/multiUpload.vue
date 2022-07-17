<template>
  <div>
    <el-upload
      :action="useOss?ossUploadUrl:minioUploadUrl"
      :data="useOss?dataObj:null"
      list-type="picture-card"
      :file-list="fileList"
      :before-upload="beforeUpload"
      :on-remove="handleRemove"
      :on-success="handleUploadSuccess"
      :on-preview="handlePreview"
      :limit="maxCount"
      :on-exceed="handleExceed"
    >
      <el-icon><Plus /></el-icon>
    </el-upload>
    <el-dialog v-model="dialogVisible">
      <img width="100%" :src="dialogImageUrl" alt="">
    </el-dialog>
  </div>
</template>
<script>
  import {policy} from '@/api/oss'
  import {ElMessage} from 'element-plus';
  import {formatDate} from '@/utils/date';
  import {defineComponent, reactive, toRefs, watch} from 'vue';
  import { Plus} from '@element-plus/icons-vue';

  export default defineComponent({
    components: {Plus, ElMessage},
    props: {
      modelValue: Array,
      maxCount:{
        type:Number,
        default:5
      }
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
        showFileList: false
      });

      const methods = reactive({
        emitInput(fileList) {
          console.log(fileList);
          let value=[];
          for(let i=0;i<fileList.length;i++){
            value.push(fileList[i].url);
          }
          ctx.emit('update:modelValue', value);
        },
        handleRemove(file, fileList) {
          methods.emitInput(fileList);
      
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
          const dateDir = formatDate(date, 'yyyyMMdd');
          let url = states.ossUploadUrl + states.dir + dateDir + "/" + file.name;
          
          if(!states.useOss){
            //不使用oss直接获取图片路径
            url = res.data.url;
          }
          states.fileList.push({name: file.name, url: url});
          methods.emitInput(states.fileList);
        },
        handleExceed() {
          ElMessage({
            message: '最多只能上传'+props.maxCount+'张图片',
            type: 'warning',
            duration:1000
          });
        },
      });

      const unwatch = watch(()=>props.modelValue, function(newValue){
        if(newValue && newValue.length){
          states.fileList.push(...(newValue.map(item=>({'url': item}))));
          states.showFileList = true;
          unwatch();
        }
      });

      return {
        ...toRefs(states),
        ...toRefs(methods)
      }
    }
  });
  // export default {
  //   name: 'multiUpload',
  //   components: {Plus},
  //   props: {
  //     //图片属性数组
  //     modelValue: Array,
  //     //最大上传图片数量
  //     maxCount:{
  //       type:Number,
  //       default:5
  //     }
  //   },
  //   data() {
  //     return {
  //       dataObj: {
  //         policy: '',
  //         signature: '',
  //         key: '',
  //         ossaccessKeyId: '',
  //         dir: '',
  //         host: ''
  //       },
  //       dialogVisible: false,
  //       dialogImageUrl:null,
  //       useOss:true, //使用oss->true;使用MinIO->false
  //       ossUploadUrl:'http://macro-oss.oss-cn-shenzhen.aliyuncs.com',
  //       minioUploadUrl:'http://localhost:8080/minio/upload',
  //     };
  //   },
  //   computed: {
  //     fileList() {
  //       let fileList=[];
  //       for(let i=0;i<this.modelValue.length;i++){
  //         fileList.push({url:this.modelValue[i]});
  //       }
  //       return fileList;
  //     }
  //   },
  //   methods: {
  //     emitInput(fileList) {
  //       let value=[];
  //       for(let i=0;i<fileList.length;i++){
  //         value.push(fileList[i].url);
  //       }
  //       this.$emit('input', value)
  //     },
  //     handleRemove(file, fileList) {
  //       this.emitInput(fileList);
  //     },
  //     handlePreview(file) {
  //       this.dialogVisible = true;
  //       this.dialogImageUrl=file.url;
  //     },
  //     beforeUpload() {
  //       let _self = this;
  //       if(!this.useOss){
  //         //不使用oss不需要获取策略
  //         return true;
  //       }
  //       return new Promise((resolve, reject) => {
  //         policy().then(response => {
  //           _self.dataObj.policy = response.data.policy;
  //           _self.dataObj.signature = response.data.signature;
  //           _self.dataObj.ossaccessKeyId = response.data.accessKeyId;
  //           _self.dataObj.key = response.data.dir + '/${filename}';
  //           _self.dataObj.dir = response.data.dir;
  //           _self.dataObj.host = response.data.host;
  //           resolve(true)
  //         }).catch(err => {
  //           console.log(err)
  //           reject(false)
  //         })
  //       })
  //     },
  //     handleUploadSuccess(res, file) {
  //       let url = this.dataObj.host + '/' + this.dataObj.dir + '/' + file.name;
  //       if(!this.useOss){
  //         //不使用oss直接获取图片路径
  //         url = res.data.url;
  //       }
  //       this.fileList.push({name: file.name,url:url});
  //       this.emitInput(this.fileList);
  //     },
  //     handleExceed() {
  //       ElMessage({
  //         message: '最多只能上传'+this.maxCount+'张图片',
  //         type: 'warning',
  //         duration:1000
  //       });
  //     },
  //   }
  // }
</script>
<style>

</style>


