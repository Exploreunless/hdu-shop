<script setup lang="ts">
import { ref, onMounted } from 'vue';
import {useRouter} from 'vue-router'
import ReturnNavBar from '@/components/ReturnNavBar/index.vue';
import API_ADDRESS from '@/apis/address';
import {isFixedData} from '@/constants';
import axios from 'axios';
import SpainList from '@/components/SpainList/index.vue';

const router  = useRouter();
const defaultAddressList = [{
  "city": "杭州市",
  "defaultStatus": 1,
  "detailAddress": "文三路 138 号东方通信大厦 7 楼 501 室",
  "id": 1,
  "memberId": 0,
  "name": "张三",
  "phoneNumber": "13000000000",
  "postCode": "343442",
  "province": "浙江省",
  "region": "西湖区"
}]

// 地址列表
const addressList = ref();

onMounted(()=>{
  getAddressList();
})

function getAddressList(){
  const jsonFetch = ()=>{
    return axios.get('/src/views/address/data.json').then((response)=>response.data);
  }
  const api = isFixedData ? jsonFetch() : API_ADDRESS.umsFetchAddress();
  api.then((res)=>{
    addressList.value = res?.data.map((item)=>({
      'id': item['id'],
      'name': item['name'],
      'tel': item['phoneNumber'],
      'isDefault': !!(item['defaultStatus']),
      'address': item['province'] + item['city'] + item['region'] + item['detailAddress']
    }));
    listLoading.value = false;
    }).catch((error)=>{
      console.log(error);
      listLoading.value = false;
    });
}

const chosenAddressId = ref('0');

// 添加地址
const onAdd = () => {
  router.push({ path: '/address/edit' })
};
// 修改地址
const onEdit = (item) => {
  router.push({
    path: '/address/edit',
    query: {'id': item['id']}
  })
};

const listLoading = ref(false);
</script>

<template>
  <ReturnNavBar title="收货地址" />
  <SpainList v-model:loading="listLoading">
    <van-address-list
      v-model="chosenAddressId"
      :list="addressList"
      default-tag-text="默认"
      @add="onAdd"
      @edit="onEdit"
    />
  </SpainList>

</template>

<style lang="less" scoped>
.van-address-list__bottom {
  background-color: inherit !important;
}
</style>