<script lang="ts" setup>
import { onMounted, reactive, ref, unref, computed } from 'vue';
import { useRoute } from 'vue-router';
import ReturnNavBar from '@/components/ReturnNavBar/index.vue';

import API_ORDER from '@/apis/order';
import ProList from '@/components/ProList/index.vue';
import OrderItem from './components/OrderItem.vue';
import {isFixedData} from '@/constants';
import axios from 'axios';

const route = useRoute();
// onMounted(() => {
//   const { status } = route.query;
//   if (status) {
//     active.value = unref(tabList).findIndex((item) => item.status === Number(status));
//   }
//   //
// });

const tabList = ref<Recordable[]>([
  { name: '全部', status: -1 },
  { name: '待付款', status: 0 },
  { name: '待发货', status: 1 },
  { name: '已发货', status: 2 },
  { name: '已完成', status: 3 },
  { name: '已关闭', status: 4 },
]);

const active = ref(0);
const { status } = route.query;
if (status) {
  active.value = unref(tabList).findIndex((item) => item.status === Number(status));
}

function onTabClicked() {
  listRef.value?.refresh();
}

const listRef = ref<any>(null);

const listQuery = reactive({
  pageNum: 1,
  pageSize: 5,
});

const listEmptyText = ref('暂无订单');

function onOrderDelete(item, index) {
  listRef.value?.deleteItemByIndex(index);
}

function fetchOrderList(){
  return axios.get('/src/views/order/data.json').then((response)=>response.data);
} 
 
function loadList() {
  const params: Recordable = {
    pageNum: listQuery.pageNum,
    pageSize: listQuery.pageSize,
    status: unref(tabList)[unref(active)].status,
  };

  return isFixedData? fetchOrderList() : API_ORDER.fetchOrderList(params);
}

</script>

<template>
  <ReturnNavBar title="订单列表" />
  <van-tabs v-model:active="active" @click-tab="onTabClicked">
    <van-tab v-for="(item, index) in tabList" :key="index" :title="item.name" />
  </van-tabs>
  <div class="container">
    <ProList
      ref="listRef"
      :api="loadList"
      :pagination="listQuery"
      :empty-text="listEmptyText"
    >
      <template #item="{ item, index }">
        <OrderItem :key="item.id" :item="item" :index="index" @delete="onOrderDelete" />
      </template>
    </ProList>
  </div>
</template>

<style lang="less" scoped>
//
</style>
