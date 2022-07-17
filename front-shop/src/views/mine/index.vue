<script setup lang="ts">
import Tabbar from '@/components/Tabbar/index.vue';
import {computed, ref, onMounted, unref} from 'vue';
import {useRouter} from 'vue-router';
import {useUserStore} from '@/store/modules/user';
import { usePage } from '@/hooks/shared/usePage';
import { assets } from '@/constants';
import { memberLevelList } from '@/constants/modules/user';
import ICON_ART from '@/assets/images/icon_art.png';
import { countPair } from '@/utils/format';
import MineSvgWaveBg from '@/components/MineSvgWaveBg/index.vue';


const userStore = useUserStore();
const router = useRouter();
const { hasLogin, goLogin, goPage } = usePage();

// 用户信息
const userInfo = computed(() => userStore.getUserInfo);
const couponCanUse = ref(undefined);
const balance = ref(undefined);

// 界面固定展示数据
// 我的订单
const orderList = ref<Recordable[]>([
  {
    value: '',
    label: '待付款',
    icon: 'pending-payment',
    path: '/order/list',
    query: 0,
    count: undefined,
    countKey: 'count_id_no_pay',
  },
  {
    value: '',
    label: '待发货',
    icon: 'tosend',
    path: '/order/list',
    query: 1,
    count: undefined,
    countKey: 'count_id_no_transfer',
  },
  {
    value: '',
    label: '待收货',
    icon: 'logistics',
    path: '/order/list',
    query: 2,
    count: undefined,
    countKey: 'count_id_no_confirm',
  },
  {
    value: '',
    label: '评价',
    icon: 'comment-o',
    path: '/order/list',
    query: 3,
    count: undefined,
    countKey: 'count_id_no_reputation',
  },
  {
    value: '',
    label: '退款/售后',
    icon: 'after-sale',
    path: '/refund',
    count: undefined,
  },
]);
const onOrderClicker = (item)=>{
  router.push({path: item.path, query: {status: item.query}})
}
// 常用功能
const toolList = ref<Recordable[]>([
  { icon: 'newspaper-o', title: '专题', path: '/subject' },
  { icon: 'point-gift-o', title: '品牌关注', path: '/brand/focus' },
  { icon: 'coupon-o', title: '优惠券', path: '/coupon' },
  { icon: 'location-o', title: '收货地址', path: '/address' },
  { icon: 'setting-o', title: '设置', path: '/setting' },
  { icon: 'browsing-history-o', title: '足迹', path: '/history' },
  { icon: 'star-o', title: '收藏', path: '/collect' },
  { icon: ICON_ART, title: '主题', path: '/theme' },
]);

onMounted(() => {
  if (unref(hasLogin)) {
    userStore.getUserDetail();
    getCounts();
  }
});

function getCounts() {

}
</script>

<template>
 <div class="container">
   <header class="header">
     <div v-if="hasLogin" class="header-inner" >
        <div class="header-tag" @click="goPage('./profile')">个人资料</div>
        <van-image class="header-avatar" :src="userInfo.avatarUrl"></van-image>
        <div class="header-info">
          <div class="header-nick van-ellipsis mb10" @click="goPage('./profile')">
            {{userInfo.username || '还没有昵称'}}
          </div>
          <div class="header-sub">
            <span class="header-sub-item">ID {{userInfo.id}}</span>
            <span class="header-sub-item-separate">|</span>
            <span class="header-sub-item">成长值 {{userInfo.growth || 0}}</span>
            <span class="header-sub-item-separate">|</span>
            <span class="header-sub-item">段位 {{memberLevelList[userInfo.memberLevelId]}}</span>
          </div>
        </div>
     </div>
     <div v-else class="header-inner" @click="goLogin">
      <van-image class="header-avatar" :src="assets.avatar"></van-image>
      <div class="header-info">
        <div class="header-nick">登录/注册</div>
      </div>
     </div>
     <div class="header-bg">
       <div class="header-bg-wave">
         <!-- <MineSvgWaveBg /> -->
       </div>
     </div>
   </header>
   <main class="main">
     <div class="group"></div>
     <!-- 我的钱包 -->
     <div class="group">
       <div class="count-list">
         <!-- 积分 -->
         <div class="count-list-item" @click="goPage('/integral')">
           <div class="count-list-item-value">{{ countPair(userInfo.integration, 0) }}</div>
           <div class="count-list-item-label">积分</div>
         </div>
         <div class="count-list-item" @click="goPage('/coupon')">
           <div class="count-list-item-value">{{ countPair(couponCanUse, 0) }}</div>
           <div class="count-list-item-label">优惠券</div>
         </div>
         <div class="count-list-item" @click="goPage('/wallet')">
           <div class="count-list-item-value">{{ countPair(balance) }}</div>
           <div class="count-list-item-label">余额</div>
         </div>
       </div>
     </div>
     <!-- 我的订单 -->
     <div class="group">
      <div class="group-header van-hairline--bottom" @click="goPage('/order/list')">
        <div class="group-header-hd">我的订单</div>
        <div class="group-header-bd">
          <span class="group-header-txt">查看全部</span>
          <van-icon class="group-header-arrow" name="arrow" />
        </div>
      </div>
      <div class="order-list">
        <div v-for="(item, index) in orderList" :key="index" class="order-list-item" @click="onOrderClicker(item)">
          <van-icon class="order-list-item-icon" :name="item.icon" :badge="item.count" />
          <div class="order-list-item-title">{{ item.label }}</div>
        </div>
      </div>
     </div>
     <!-- 常用功能 -->
     <div class="group">
        <div class="group-header van-hairline--bottom">
          <div class="group-header-hd">常用功能</div>
        </div>
        <div class="tool-list">
          <div v-for="(item, index) in toolList" :key="index" class="tool-list-item" @click="goPage(item.path)">
            <van-icon class="tool-list-item-icon" :name="item.icon" :badge="item.count" />
            <div class="tool-list-item-title">{{ item.title }}</div>
          </div>
        </div>
      </div>
   </main>
   <Tabbar />
 </div>
</template>

<style lang="less"  scoped>
@import './style.less';
</style>
