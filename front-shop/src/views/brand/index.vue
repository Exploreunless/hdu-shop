<script setup lang="ts">
import ReturnNavBar from '@/components/ReturnNavBar/index.vue';
import axios from 'axios';
import {computed, unref, ref, onMounted, reactive} from 'vue';
import {useRoute} from 'vue-router';
import {isFixedData} from '@/constants';
import API_BRAND from '@/apis/brand';
import goodCard from '@/components/GoodCard/index.vue';
import ProList from '@/components/ProList/index.vue';

onMounted(()=>{
  getBrandDetail();
  getFocusBrand();
})
const route = useRoute();

const brandId = computed(()=>{
  return Number(route.query.id);
});

const brandInfo = ref<Recordable>({});
// 获取品牌详情
function getBrandDetail(){
  const jsonFetch = () => 
    axios.get('/src/views/brand/data.json')
    .then(response=>{
      return response.data;
    });
  
  const api = isFixedData ? jsonFetch() : API_BRAND.getBrandDetail(unref(brandId));
  api.then((res)=>{
    brandInfo.value = res.data;
  }).catch((error)=>{
    console.log(error)
  });
}
// 商品展示
const listEmptyText = ref('暂无商品');
function fetchGoodList(){
  return axios.get('/src/views/search/data.json')
    .then(response=>{
      return response.data;
    }).catch((error)=>{
      console.log(error);
    });
} 

// 搜索商品
const pagination = reactive({
  pageNum: 1,
  pageSize: 6,
});
function loadList(){
  const params: Recordable = {
    page: pagination.pageNum,
    pageSize: pagination.pageSize,
    brandId: unref(brandId)
  };
  return isFixedData? fetchGoodList():API_BRAND.fetchBrandProduct(params);
}

// 关注品牌
const focusBrandList = ref([]);

const isFocus = computed(()=>{
  const good = focusBrandList.value.find((item)=>(item.brandId == unref(brandId)));
  return good?true:false;
});

function getFocusBrand(){
  const jsonFetch = () => 
    axios.get('/src/views/brand/list.json')
    .then(response=>{
      return response.data;
    });
  
  const api = isFixedData ? jsonFetch() : API_BRAND.fetchBrandFocusList();
  api.then((res)=>{
    focusBrandList.value = res.data?.list ?? [];
  }).catch((error)=>{
    console.log(error);
  });
}

function onFocus(){
  if(isFocus.value){
    API_BRAND.deleteBrandFocus({brandId: unref(brandId)})
    .then(()=>{
    }).catch((error)=>{
      console.log(error);
    });
  }else{
    const memberBrandAttention = {
      "brandCity": "",
      "brandId": unref(brandId),
      "brandLogo": unref(brandInfo).logo,
      "brandName": unref(brandInfo).name,
      "createTime": "",
      "id": "",
      "memberIcon": "",
      "memberId": 0,
      "memberNickname": ""
    }
    API_BRAND.addBrandFocus(memberBrandAttention)
    .then(()=>{
      getFocusBrand();
    }).catch((error)=>{
      console.log(error);
    });
  }
}

</script>

<template>
  <ReturnNavBar title="品牌详情" />
  <div class="container">
    <van-image class="photo van-hairline--top" :src="brandInfo.bigPic" :alt="brandInfo.name" />
    <div class="list">
      <div class="left-item">
        <van-image class="left-item-photo" :src="brandInfo.logo" :alt="brandInfo.name" />
        <div class="left-item-info">
          <div class="left-item-title">{{ brandInfo.name}}</div>
          <div class="left-item-sub-title">{{brandInfo.brandStory}}</div>
        </div>
      </div>
      <div class="right-item" @click="onFocus">
        <van-button v-if="!isFocus" icon="plus" class="right-item-btn">关注</van-button>
        <van-button v-else icon="success" class="right-item-btn">已关注</van-button>
      </div>
    </div>
    <div class="van-hairline--top"></div>
    <div class="plate">
      <div class="plate-title">
        相关商品
        <span class="plate-tip">(共 {{brandInfo.productCount}} 商品)</span>
      </div>
    </div>
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

.photo{
  width: 100%;
  height: 150px;
}
.list{
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  background: var(--white);
  padding: 10px 0;
  .left-item {
    position: relative;
    text-align: left;
    overflow: hidden;
    
    width: 70%;
    display: flex;
    // margin-bottom: 5px;
    // width: 100%;

    &-photo {
      width: 70%;
      height: 80px;
    }

    &-info {
      width: 50%;
      padding: 0 10px;
      display: flex;
      flex-direction: column;
      justify-content: space-evenly;
    }

    &-title {
      font-size: 16px;
      color: var(--gray-color-8);
      line-height: 16px;
      display: -webkit-box;
      overflow: hidden;
      text-overflow: ellipsis;
      -webkit-line-clamp: 1;
      -webkit-box-orient: vertical;
      font-weight: bold;
    }
    &-sub-title {
      font-size: 13px;
      color: var(--gray-color-7);
      line-height: 16px;
      display: -webkit-box;
      overflow: hidden;
      text-overflow: ellipsis;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
    }

  }

  .right-item{
    //  width: 30%
     .service-info{
        font-size: 13px;
        color: var(--gray-color-7);
        overflow: hidden;
     }
     &-btn{
       color: var(--white);
       background-color: var(--brand-color);
       border-radius: 20px;
       margin-right: 10px;
       height: 40px;
     }
  }
}

.plate {
  text-align: center;
  height: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  background: var(--white);

  &-title {
    position: relative;
    height: 100%;
    display: flex;
    align-items: center;
    font-size: 14px;
    color: var(--gray-color-8);
  }
  &-tip{
    margin-left: 5px;
    color: var(--gray-color-6);
    font-size: 12px;
  }
}

.col{
  width: 50%;
}
</style>
