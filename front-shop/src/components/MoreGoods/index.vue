<script setup lang="ts">
import {reactive, ref, onMounted, unref, computed} from 'vue';
import axios from 'axios';
import goodCard from '@/components/GoodCard/index.vue';
import IMAGE_LIST_EMPTY from '@/assets/images/empty/good.png';
import {isFixedData} from '@/constants';
import API_HOME from '@/apis/home';

// 标签栏
const tabList = reactive([
  {id: 0, name: '综合排序', descent: false},
  {id: 1, name: '价格排序', descent: false},
  {id: 2, name: '分类查看'}
])

const active = ref(0);

const onTabClicked = ()=>{
  refresh();
}

const props = withDefaults(
  defineProps<{ ptype: string, pic: string }>(),{
    ptype: '',
    pic: ''
  }
);

const sortList = computed(()=>{
  let list = productList.value.concat([]);
  if(active.value === 1){
    list.sort((a, b)=>{
      return tabList[active.value].descent?(a.price-b.price):(b.price-a.price);
    });
  }else if(active.value === 0){
    if(tabList[active.value].descent) 
      list = list.reverse();
  }
  return list;
})

function refresh() {
  if (unref(listLoading)) {
    return;
  }
  // eslint-disable-next-line vue/no-mutating-props
  listQuery.pageNum = 1;
  productList.value = [];
  listFinished.value = false;
  onPage();
}

// 商品列表
const productList = ref<Recordable[]>([]);
const listLoading = ref(false);
const listFinished = ref(false);
const listError = ref(false);
const listFinishedText = ref('没有更多了');
const listErrorText = ref('请求失败，点击重新加载');
const listEmptyText = ref('暂无商品');
const listEmptyImage = IMAGE_LIST_EMPTY;
const total = ref(0);

const listQuery = reactive({
  pageNum: 1,
  pageSize: 10
})

onMounted(()=>{
  props.ptype !== '' && onPage();
})

function onPageLoad() {
  if (listFinished.value) {
    return;
  }
  listQuery.pageNum += 1;
  onPage();
}

// 获取商品列表
function onPage() {
  listLoading.value = true;

  const jsonFetch = function(){
     return axios.get('/src/views/more/data.json').then((response)=>response.data);
  }
  const api = isFixedData? jsonFetch(): (props.ptype === 'hot'?API_HOME.umsHomeHotProductList(listQuery):API_HOME.umsHomeNewProductList(listQuery));

  api.then((res)=>{
    const records = res.data || [];
    productList.value = listQuery.pageNum === 1 ? records : unref(productList).concat(records);
    listLoading.value = false;
    listFinished.value = productList.value.length >= total.value;
  }).catch((error) => {
    console.error(error);
    listLoading.value = false;
    listError.value = true;
  });
}
</script>

<template>
<div class="container">
  <van-image :src="pic" alt="" width="100%" height="180px"></van-image>
  <div class="tab-list">
    <van-tabs v-model:active="active" @click-tab="onTabClicked">
      <van-tab v-for="(item) in tabList" :key="item.id" :title="item.name" />
    </van-tabs>
  </div>
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
    <div v-for="item in productList" :key="item.id" class="list-col">
      <good-card :good="item"></good-card>
    </div>
    <template #finished>
      <span v-if="productList.length">{{ listFinishedText }}</span>
      <van-empty v-else :image="listEmptyImage" :description="listEmptyText" />
    </template>
  </van-list>
</div>


</template>

<style lang="less" scoped>

.tab-list {
  height: calc(50px + constant(safe-area-inset-top));
  height: calc(50px + env(safe-area-inset-top));

  .van-tabs {
    box-sizing: border-box;
    margin-bottom: 15px;
    z-index: 3;
    width: 100%;
    height: 50px;
    padding-top: constant(safe-area-inset-top);
    padding-top: env(safe-area-inset-top);
  }
}

.list {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  :deep(.van-list__loading),
  :deep(.van-list__finished-text),
  :deep(.van-list__error-text) {
    width: 100%;
  }

  &-col {
    width: 50%;
    box-sizing: border-box;
    // padding-left: 5px;
    // padding-right: 5px;
    // margin-bottom: 10px;
  }
}
</style>