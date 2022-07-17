<script setup lang="ts">
import { onMounted, ref, computed } from 'vue'
import Tabbar from '@/components/Tabbar/index.vue';
import homeNavBar from '@/components/HomeNavBar/index.vue';
import axios from 'axios';
import {useRouter} from 'vue-router';
import IMAGE_LIST_EMPTY from '@/assets/images/empty/good.png';
import API_CATEGORY from '@/apis/category'

const router =useRouter();
// 分类列表
const productCategoryList = ref<Recordable[]>([]);
// 父类索引
const categoryIndex = ref(0);
// 子类列表
const childProductCategoryList = computed(()=>{
  if(productCategoryList.value.length){
    let children = productCategoryList.value[categoryIndex.value]
    return children['children']?children['children']:[]
  }
  return []
})

// 点击父类
const onCategoryChange = ()=>{

}

// 通知信息
const listFinishedText = ref('没有更多了');
const listErrorText = ref('请求失败，点击重新加载');
const listEmptyText = ref('暂无商品');
const listEmptyImage = IMAGE_LIST_EMPTY;

// 加载中
const listLoading = ref(false);
const listFinished = ref(false);
const listError = ref(false);

// 获取数据
onMounted(()=>{
  API_CATEGORY.umsFetchCategoryList().then((response)=>{
    const res = response.data;
    productCategoryList.value = res;
  })
})

function onPageLoad() {
  listFinished.value = true;
}

const onCategoryClicked = (id: number)=>{
  router.push({path: '/search', query: {categoryId: id}})
}

</script>

<template>
  <home-nav-bar/>
  <div class="container">
    <div class="main">
      <van-sidebar v-model="categoryIndex" class="sidebar" @change="onCategoryChange()">
        <van-sidebar-item v-for="item in productCategoryList" :key="item.id" :title="item.name" />
      </van-sidebar>
      <div class="right-content">
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
          <div v-for="item in childProductCategoryList" :key="item.id" class="list-col">
            <div class="list-item" @click="onCategoryClicked(item.id)">
              <van-image class="list-item-photo" :src="item.icon" :alt="item.name" />
              <div class="list-item-info">
                <div class="list-item-title">{{ item.name }}</div>
              </div>
            </div>
          </div>
          <template #finished>
            <span v-if="childProductCategoryList.length">{{ listFinishedText }}</span>
            <van-empty v-else :image="listEmptyImage" :description="listEmptyText" />
          </template>
        </van-list>
      </div>
    </div>
  </div>
  <!-- 菜单 -->
  <tabbar />
  
</template>

<style lang="less" scoped>
.main {
  height: calc(100vh - 50px - constant(safe-area-inset-bottom));
  height: calc(100vh - 50px - env(safe-area-inset-bottom));
  display: flex;
  background: var(--white);
  
}

.sidebar {
  // margin-right: 10px;
  width: 100px;
  height: 100%;
  background-color: var(--gray-color-1);
}

.right-content {
  flex: 1;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  padding-top: 10px;
}

.list {
  display: flex;
  flex-wrap: wrap;

  :deep(.van-list__loading),
  :deep(.van-list__finished-text),
  :deep(.van-list__error-text) {
    width: 100%;
  }

  &-col {
    width: 50%;
    box-sizing: border-box;
    padding-left: 5px;
    padding-right: 5px;
    
  }

  &-item {
    position: relative;
    overflow: hidden;
    background: var(--white);

    &-photo {
      display: flex;
      width: 100%;
      height: 100px;
    }

    &-info {
      padding-top: 5px;
    }

    &-title {
      font-size: 13px;
      color: var(--gray-color-7);
      min-height: 36px;
      line-height: 18px;
      display: -webkit-box;
      overflow: hidden;
      text-align: center;
      text-overflow: ellipsis;
      -webkit-line-clamp: 1;
      -webkit-box-orient: vertical;
    }
  }
}
</style>

