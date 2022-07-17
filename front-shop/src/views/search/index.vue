<script lang="ts" setup>
import {unref , onMounted} from 'vue';
import { ref, reactive } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import API_GOOD from '@/apis/good'
import ProList from '@/components/ProList/index.vue';
import {isFixedData} from '@/constants';
import goodCard from '@/components/GoodCard/index.vue';
import axios from 'axios';
import API_BRAND from '@/apis/brand';
import API_CATEGORY from '@/apis/category';

const router = useRouter();
const route = useRoute();

onMounted(()=>{
  if(route.query.categoryId){
    productCategoryId.value = Number(route.query.categoryId);
  }
  if(route.query.brandId){
    brandId.value = Number(route.query.brandId);
  }
  getBrandList();
  getCategoryList();
})


const pagination = reactive({
  pageNum: 1,
  pageSize: 6,
});
const brandId = ref<number>();
const keyword = ref<string>('');
const sort = ref<number>(0);
const productCategoryId = ref<number>(Number(route.query.categoryId));

const tabList = reactive([
  {label: '综合', value: 0},
  {label: '新品', value: 1},
  {label: '销量', value: 2},
  {label: '价格', value: 3},
  {label: '筛选', value: -1},
])
const active = ref(0);
const beforeActive = ref(0);
const listRef = ref<any>(null);

function onTabClicked(item: Recordable){
  const status = item.name;
  if(![3, 4].includes(status) && status === beforeActive) return;
  if(status === 3){
    sort.value = (sort.value === 3)? 4: 3;
    isCollapse.value = false;
  }else if(status === 4){
    isCollapse.value = !isCollapse.value;
  }else{
    sort.value = tabList[status].value;
    isCollapse.value = false;
  }
  status !== 4 && (beforeActive.value = status);
  status !== 4 && onSearch();
}
// 搜索
function onSearch(){
  listRef.value?.refresh();
}

function fetchGoodList(){
  return axios.get('/src/views/search/data.json')
    .then(response=>{
      return response.data;
    }).catch((error)=>{
      console.log(error);
    });
} 

// 搜索商品
function loadList(){
  const params: Recordable = {
    pageNum: pagination.pageNum,
    pageSize: pagination.pageSize,
    sort: unref(sort)
  };
  if (unref(keyword)) {
    params.keyword = unref(keyword); // 关键词
  }
  if (unref(brandId)) {
    params.brandId = unref(brandId); // 品牌
  }
  if (unref(productCategoryId)) {
    params.productCategoryId = unref(productCategoryId); // 类别
  }
  return isFixedData? fetchGoodList():API_GOOD.umsGoodSearch(params);
}

// 品牌
const brandList = ref<Recordable[]>();

function getBrandList(){
  const jsonFetch = () => 
    axios.get('/src/views/search/brand.json')
    .then(response=>{
      return response.data;
    })
  
  const api = isFixedData ? jsonFetch() : API_BRAND.fetchBrand();
  api.then((res)=>{
    brandList.value = res.data;
  }).catch((error)=>{
    console.log(error)
  });
}

function onBrandClicked(v: Recordable){
  brandId.value = (brandId.value !== v.id)?v.id : undefined;
}

// 分类
const productCategoryList = ref<Recordable[]>()
function onCategoryClicked(v: Recordable){
  productCategoryId.value = (productCategoryId.value !== v.id)?v.id : undefined;;
}

function getCategoryList(){
  const jsonFetch = () => 
    axios.get('/src/views/category/data.json')
    .then(response=>{
      return response.data;
    });
  
  const api = isFixedData ? jsonFetch() : API_CATEGORY.umsFetchCategoryList();
  api.then((res)=>{
    productCategoryList.value = res.data;
  }).catch((error)=>{
    console.log(error)
  });
}

// 筛选框
const isCollapse = ref(false);
function onSelect(){
  active.value = beforeActive.value;
  isCollapse.value = false;
  onSearch();
}

const listEmptyText = ref('暂无商品');

function onReturn(){
  router.back();
}

</script>

<template>
  <div class="container">
    <van-sticky>
      <div class="header">
        <form action="#" class="search-form">
          <van-search
            v-model="keyword"
            class="search-field"
            shape="round"
            show-action
            placeholder="搜索商品"
            @search="onSearch"
          >
            <template #left>
              <van-icon name="arrow-left" @click=onReturn />
              &nbsp;
            </template>
            <template #action>
              <div v-if="keyword" @click="onSearch">搜索</div>
            </template>
          </van-search>
        </form>
        <van-tabs v-model:active="active" @click-tab="onTabClicked">
          <van-tab v-for="(item, index) in tabList" :key="index">
            <template #title>
               {{item.label}}
               <van-icon v-if="item.value===3 && sort===3" name="arrow-down" />
               <van-icon v-if="item.value===3 && sort===4" name="arrow-up" />
            </template>
          </van-tab>
        </van-tabs>
        <div v-show="isCollapse" class="sku">
          <div class="sku-group van-hairline--bottom">
            <div class="sku-group-hd">分类</div>
            <div class="sku-group-list">
              <div
                v-for="(v, i) in productCategoryList"
                :key="v.id"
                :class="['sku-group-list-item', productCategoryId === v.id ? 'active' : '']"
                @click="onCategoryClicked(v)">
                <span class="sku-group-list-item-name">{{ v.name }}</span>
              </div>
            </div>
          </div>
          <div class="sku-group">
            <div class="sku-group-hd">品牌</div>
            <div class="sku-group-list">
              <div
                v-for="(v, i) in brandList"
                :key="v.id"
                :class="['sku-group-list-item', brandId === v.id ? 'active' : '']"
                @click="onBrandClicked(v)">
                <span class="sku-group-list-item-name">{{ v.name }}</span>
              </div>
            </div>
          </div>
          <van-button class="sku-btn" @click="onSelect">确定</van-button>
        </div>
      </div>
    </van-sticky>
    <ProList
      ref="listRef"
      :api="loadList"
      :pagination="pagination"
      :empty-text="listEmptyText"
      :flex="true"
    >
      <template #item="{ item }">
        <div class="col">
          <good-card :key="item.id" :good="item" />
        </div>
      </template>
    </ProList>
  </div>

</template>

<style lang="less" scoped>
.search-field{
  width: 100%;
}

.col{
  width: 50%;
}
.sku{
  z-index: 20;
  background-color: #fff;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-bottom: solid 1px #ddd;
  float: left;
  &-btn{
    width: 90%;
    color: white;
    height: 40px;
    border-radius: 30px;
    background-color: var(--brand-color);
    margin-bottom: 30px;
  }

  &-group {
    padding-top: 10px;
    margin: 0 15px 10px;
    font-size: 14px;
    color: var(--gray-color-8);

    &-hd {
      padding-bottom: 12px;
      font-size: 16px;
    }
    &-list {
      display: flex;
      align-items: center;
      flex-wrap: wrap;

      &-item {
        position: relative;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        min-width: 40px;
        margin: 0 10px 10px 0;
        font-size: 12px;
        line-height: 16px;
        overflow: hidden;
        color: var(--gray-color-8);
        border-radius: 4px;

        &::before {
          position: absolute;
          content: '';
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: var(--gray-color-1);
        }

        &-name {
          padding: 8px;
          z-index: 1;
        }

        &.active {
          color: var(--brand-color);
        }

        &.active::before {
          background: currentColor;
          opacity: 0.1;
        }
      }
    }
  }
}
</style>
