<script lang="ts" setup>
import ReturnNavBar from '@/components/ReturnNavBar/index.vue';
import API_HOME from '@/apis/home';
import {isFixedData} from '@/constants';
import axios from 'axios';
import {reactive, ref, onMounted, unref} from 'vue';
import IMAGE_LIST_EMPTY from '@/assets/images/empty/good.png';
import { countZeroPair } from '@/utils/format';

const tabList = ref<Recordable[]>([
  { name: '全部', status: -1 },
  { name: '服装专题', status: 1 },
  { name: '手机专题', status: 2 },
]);

const active = ref(0);

function onTabClicked() {
  refresh();
}

// 商品列表
const subjectList = ref<Recordable[]>([]);
const listLoading = ref(false);
const listFinished = ref(false);
const listError = ref(false);
const listFinishedText = ref('没有更多了');
const listErrorText = ref('请求失败，点击重新加载');
const listEmptyText = ref('暂无专题');
const listEmptyImage = IMAGE_LIST_EMPTY;
const total = ref(0);


onMounted(()=>{
  onPage();
})

const listQuery = reactive({
  pageNum: 1,
  pageSize: 10,
});


function refresh() {
  if (unref(listLoading)) {
    return;
  }

  // eslint-disable-next-line vue/no-mutating-props
  listQuery.pageNum = 1;
  subjectList.value = [];
  listFinished.value = false;
  onPage();
}

function onPageLoad() {
  if (listFinished.value) {
    return;
  }
  listQuery.pageNum += 1;
  onPage();
}

// 获取商品列表
function onPage() {
  const params: Recordable = {
    pageNum: listQuery.pageNum,
    pageSize: listQuery.pageSize,
  };
  const status = unref(tabList)[unref(active)].status;
  status !== -1 && (params['cateId'] = status);

  const jsonFetch = function(){
     return axios.get('/src/views/subject/data.json').then((response)=>response.data);
  }

  const api = isFixedData? jsonFetch(): API_HOME.umsHomeSubjectList(params);
  listLoading.value = true;

  api.then((res)=>{
    const records = res.data || [];
    subjectList.value = listQuery.pageNum === 1 ? records : unref(subjectList).concat(records);
    listLoading.value = false;
    listFinished.value = subjectList.value.length >= total.value;
    console.log(listFinished.value)
  }).catch((error) => {
    console.error(error);
    listLoading.value = false;
    listError.value = true;
  });
}


</script>

<template>
  <ReturnNavBar title="专题列表" />
  <van-sticky>
    <van-tabs v-model:active="active" @click-tab="onTabClicked">
      <van-tab v-for="(item, index) in tabList" :key="index" :title="item.name" />
    </van-tabs>
  </van-sticky>
  <div class="container">
    
   <van-list
    v-model:loading="listLoading"
    v-model:error="listError"
    class="list"
    :finished="listFinished"
    :finished-text="listFinishedText"
    :error-text="listErrorText"
    :immediate-check="false"
    @load="onPageLoad"
  >
    <div v-for="item in subjectList" :key="item.id" class="item">
      <div class="item-header">
        <van-image :src="item.pic" :alt="item.categoryName" class="item-header-img"></van-image>
        <span class="item-header-cat">{{item.categoryName}}</span>
      </div>
      <div class="item-main">
        <van-image :src="item.pic" :alt="item.categoryName" class="item-main-img"></van-image>
        <div class="item-main-info">
          <div class="item-main-title">{{ item.title }}</div>
          <div v-if="item.content" class="item-main-subtitle">{{ item.content }}</div>
        </div>
      </div>
      <div class="item-footer" >
        <div class="item-footer-left">
          <div class="item-footer-subtitle">
            <van-icon name="like-o" size="20px" />
            <span class="item-footer-count">{{countZeroPair(item.collectCount)}}</span>
          </div>
          <div class="item-footer-subtitle">
            <van-icon name="eye-o" size="20px"/>
            <span class="item-footer-count">{{countZeroPair(item.readCount)}}</span>
          </div>
        </div>
        <div class="item-footer-right">
          <van-icon name="chat-o" size="20px"/>
          <span class="item-footer-count">{{countZeroPair(item.commentCount)}}</span>
          <van-icon name="arrow" size="20px"/>
        </div>
        
      </div>
      
    </div>
    <template #finished>
      <span v-if="subjectList.length">{{ listFinishedText }}</span>
      <van-empty v-else :image="listEmptyImage" :description="listEmptyText" />
    </template>
  </van-list>

  </div>
</template>

<style lang="less" scoped>
//
.list{
  padding: 5px;
}
.item{
  border: 1px solid rgba(183, 171, 171, 0.1);
  border-radius: 10px;
  overflow: hidden;
  margin: 5px 0;

  &-header{
    display: flex;
    align-items: center;
    padding: 5px 10px;
    background-color: #fff;
    

    &-img{
      width: 35px;
      height: 35px;
      margin-right: 10px;
      border-radius: 50%;
      overflow: hidden;
    }

    &-cat{
      color: var(--gray-color-8);
      font-size: 15px;
    }
  }

  &-main{
    border-bottom: 1px solid rgba(211, 194, 194, 0.1);

    &-img{
      width: 100%;
      height: 120px;
    }

    &-info{
      padding: 12px 12px 10px;
      display: flex;
      flex-direction: column;
      background-color: #fff;
    }

    &-title{
      font-size: 14px;
      color: var(--gray-color-8);
      display: -webkit-box;
      overflow: hidden;
      text-overflow: ellipsis;
      -webkit-line-clamp: 1;
      -webkit-box-orient: vertical;
    }

    &-subtitle{
      font-size: 13px;
      color: var(--gray-color-6);
      display: -webkit-box;
      overflow: hidden;
      text-overflow: ellipsis;
      -webkit-line-clamp: 1;
      -webkit-box-orient: vertical;
    }
  }

  &-footer{
    display: flex;
    justify-content: space-between;
    background-color: #fff;
    padding: 10px 10px;
    color: var(--gray-color-6);
    font-size: 12px;

    &-left{
      display: flex;
    }

    &-right{
      display: flex;
      align-items: center;
    }

    &-subtitle{
      
      display: flex;
      align-items: center;

    }

    &-count{
      min-width: 15px;
      display: inline-block;
      margin-left: 6px;
    }
  }
}
</style>
