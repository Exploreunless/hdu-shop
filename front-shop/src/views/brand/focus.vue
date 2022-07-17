<script lang="ts" setup>
import { reactive, ref } from 'vue';
import ReturnNavBar from '@/components/ReturnNavBar/index.vue';
import {Dialog, Toast} from 'vant';
import ProList from '@/components/ProList/index.vue';
import API_BRAND from '@/apis/brand';
import {isFixedData} from '@/constants';
import axios from 'axios';
import { router } from '@/router';

const listRef = ref<any>(null);

const listQuery = reactive({
  pageNum: 1,
  pageSize: 5,
});

const listEmptyText = ref('暂无关注品牌');
 
function loadList() {
  const jsonFetch = () => 
    axios.get('/src/views/brand/list.json')
    .then(response=>{
      return response.data;
  });
  const params: Recordable = {
    page: listQuery.pageNum,
    pageSize: listQuery.pageSize,
  };

  return isFixedData ? jsonFetch() : API_BRAND.fetchBrandFocusList(params);;
}

function onClear(){
  Dialog.confirm({
    title: '提示',
    message: '是否全部清空？',
  })
  .then(() => {
    API_BRAND.clearBrandFocus()
    .then(()=>{
      Toast('清空成功');
      listRef.value?.refresh();
    }).catch((error)=>{
      console.log(error);
    });
  })
}

function onBrandClicker(id){
  router.push({path: '/brand', query: {id}})
}
</script>

<template>
  <ReturnNavBar title="关注列表" >
    <template #right>
      <span @click="onClear">清空</span>
    </template>
  </ReturnNavBar>
  <div class="container">
    <ProList
      ref="listRef"
      :api="loadList"
      :pagination="listQuery"
      :empty-text="listEmptyText"
    >
      <template #item="{ item, index }">
        <div class="list">
          <div class="left-item">
            <van-image class="left-item-photo" :src="item.brandLogo" :alt="item.name" />
            <div class="left-item-info">
              <div class="left-item-title">{{ item.brandName}}</div>
            </div>
          </div>
          <div class="right-item">
            <van-icon name="arrow" @click="onBrandClicker(item.brandId)" />
          </div>
        </div>
      </template>
    </ProList>
  </div>
</template>

<style lang="less" scoped>
//
.container{
  margin: 5px 10px;
  
}
.list{
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;

  border-radius: 10px;
  border: 1px solid rgba(0, 0, 0, 0.1);
  background: var(--white);
  margin-bottom: 5px;
  overflow: hidden;

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
    padding-right: 20px;
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

</style>
