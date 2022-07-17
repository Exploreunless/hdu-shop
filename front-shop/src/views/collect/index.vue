<script lang="ts" setup>
import {  reactive, ref } from 'vue';
import ReturnNavBar from '@/components/ReturnNavBar/index.vue';
import {Dialog, Toast} from 'vant';
import ProList from '@/components/ProList/index.vue';
import goodCard from '@/components/GoodCard3/index.vue';
import API_COLLECT from '@/apis/collect';
import {isFixedData} from '@/constants';
import axios from 'axios';

const listRef = ref<any>(null);

const listQuery = reactive({
  pageNum: 1,
  pageSize: 5,
});

const listEmptyText = ref('暂无收藏商品');
 
function loadList() {
  const jsonFetch = () => 
    axios.get('/src/views/collect/data.json')
    .then(response=>{
      return response.data;
  });
  const params: Recordable = {
    pageNum: listQuery.pageNum,
    pageSize: listQuery.pageSize,
  };
  return isFixedData ? jsonFetch() : API_COLLECT.fetchCollection(params);;
}

function onClear(){
  Dialog.confirm({
    title: '提示',
    message: '是否全部清空？',
  })
  .then(() => {
    API_COLLECT.clearCollection()
    .then(()=>{
      Toast('清空成功');
      listRef.value?.refresh();
    }).catch((error)=>{
      console.log(error);
    });
  })
}
</script>

<template>
  <ReturnNavBar title="收藏列表" >
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
        <good-card :key="item.id" :good-info="item" />
      </template>
    </ProList>
  </div>
</template>

<style lang="less" scoped>
//
</style>
