
<script setup lang="ts">
import {ref, reactive, onMounted} from 'vue';
import { useRouter} from 'vue-router';
import SpainList from '@/components/SpainList/index.vue';
import API_COUPON from '@/apis/coupon';
import IMAGE_LIST_EMPTY from '@/assets/images/empty/coupon.png';
import ReturnNavBar from '@/components/ReturnNavBar/index.vue';
import {isFixedData} from '@/constants';

const router = useRouter();

const couponList = ref([{
	
		"id": 2,
		"type": 0,
		"name": "全品类通用券",
		"platform": 0,
		"count": 92,
		"amount": 10,
		"perLimit": 1,
		"minPoint": 100,
		"startTime": "2018-08-27T08:40:47.000+00:00",
		"endTime": "2022-11-23T08:40:47.000+00:00",
		"useType": 0,
		"note": "满100减10",
		"publishCount": 100,
		"useCount": 0,
		"receiveCount": 8,
		"enableTime": "2022-08-27T08:40:47.000+00:00",
		"code": null,
		"memberLevel": null
	},
   {
		"id": 3,
		"type": 0,
		"name": "小米手机专用券",
		"platform": 0,
		"count": 92,
		"amount": 50,
		"perLimit": 1,
		"minPoint": 1000,
		"startTime": "2018-08-27T08:40:47.000+00:00",
		"endTime": "2018-11-16T08:40:47.000+00:00",
		"useType": 2,
		"note": "小米手机专用优惠券",
		"publishCount": 100,
		"useCount": 0,
		"receiveCount": 8,
		"enableTime": "2018-08-27T08:40:47.000+00:00",
		"code": null,
		"memberLevel": null
	}
  ])


onMounted(()=>{
  getList();
})

// 已使用，未使用，已过期 切换
const active = ref(0);
const tabList = reactive([
{
  name: '未使用',
  status: 0,
  bg: 'linear-gradient(300deg, rgb(250, 122, 122), rgb(254, 49, 78))',
  buttonTxt: '立即使用',
},
{ name: '已使用', status: 1, bg: '#c8c9cc', buttonTxt: '已使用' },
{ name: '已过期', status: 2, bg: '#c8c9cc', buttonTxt: '已过期' },
])

const onTabClicked = ()=>{
  if (!listLoading.value) {
    getList();
  }
}
const onCouponClicked = ()=> {
  router.replace({ path: '/home' });
}
const listLoading = ref(false);

// 获取优惠券历史列表

const getList = async ()=>{
  listLoading.value = true;
  let res;
  try{
    if(isFixedData){
      res = await {data: couponList.value}
    }else{
      res = await API_COUPON.umsFetchCouponList({useStatus: active.value});
    }
    couponList.value = res.data || [];
    listLoading.value = false;
  }catch(error){
    console.log(error);
    listLoading.value = false;
  }
}

// 数据处理格式
const thresholdTitle = (val: number) => {
  let str = '';
  if (val === 0) {
    str = '满任意金额可用';
  } else {
    str = `满${val}元可用`;
  }
  return str;
}

const dateFormat = (val)=> {
  return val.slice(0, 10);
}

const formatPlatform = (platform: number)=>{
  if(platform===1){
    return '移动平台';
  }else if(platform===2){
    return 'PC平台';
  }else{
    return '全平台';
  }
}
</script>

<template>
<div class="container">
  <ReturnNavBar title="我的优惠券" />
  <div class="tab-list">
    <van-tabs v-model:active="active" @click-tab="onTabClicked">
      <van-tab v-for="(item, index) in tabList" :key="index" :title="item.name" />
    </van-tabs>
  </div>
  <SpainList v-model:loading="listLoading">
    <div v-if="couponList.length" class="list">
      <div v-for="item in couponList" :key="item.id" class="list-item">
        <div class="list-item-hd" :style="[{ background: tabList[active] ? tabList[active].bg : '' }]">
          <div class="list-item-money">
            <span class="list-item-price">{{ item.amount }}</span>
            <span class="list-item-price-unit">元</span>
          </div>
          <div class="list-item-desc van-ellipsis">{{ thresholdTitle(item.minPoint) }}</div>
        </div>
        <div class="list-item-bd">
          <div class="list-item-bd-inner">
            <div class="list-item-bd-title van-ellipsis">{{ item.name }}</div>
            <div class="list-item-bd-txt">{{ formatPlatform(item.platform) }}</div>
            <div class="list-item-bd-txt">{{ dateFormat(item.startTime) }}至{{ dateFormat(item.endTime) }}</div>
          </div>
          <div v-if="active === 0" class="list-item-bd-action" @click="onCouponClicked">
            {{ tabList[active] ? tabList[active].buttonTxt : '' }}
          </div>
        </div>
      </div>
    </div>
    <van-empty v-else class="empty" :image="IMAGE_LIST_EMPTY" description="暂无优惠券">
      <van-button v-if="active === 0" class="empty-btn" round plain type="primary">进店逛逛</van-button>
    </van-empty>
  </SpainList>
  <div class="exchange">
    <div class="exchange-btn">兑换优惠口令</div>
  </div>
</div>
</template>

<style lang="less" scoped>
@import './style.less';
</style>
