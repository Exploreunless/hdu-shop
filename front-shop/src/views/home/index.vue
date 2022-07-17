<script setup lang="ts">
import { onMounted, ref } from 'vue'
import Tabbar from '@/components/Tabbar/index.vue';
import homeNavBar from '@/components/HomeNavBar/index.vue';
import axios from 'axios';
import advertiseBox from './components/Advertise.vue';
import productBox from './components/Product.vue';
import flashPromotionBox from './components/FlashPromotion.vue';
import brandBox from './components/Brand.vue';
import recommendBox from './components/Recommend.vue';
import API_HOME from '@/apis/home';
import {isFixedData} from '@/constants';

onMounted(()=>{
  getHomeContent();
});

// 轮播图
const advertiseList = ref();

// 品牌
const brandList = ref();

// 秒杀
const homeFlashPromotion = ref();

// 人气商品
const hotProductList = ref();

// 新品
const newProductList = ref();

// 获取首页信息
function getHomeContent(){
  const jsonFetch = ()=>{
    return axios.get('/src/views/home/data.json').then((response)=>response.data);
  }

  const api = isFixedData? jsonFetch() : API_HOME.umsHomeContent();

  api.then((res)=>{
    advertiseList.value = res.data['advertiseList'];
    brandList.value = res.data['brandList'];
    homeFlashPromotion.value = res.data['homeFlashPromotion'];
    hotProductList.value = res.data['hotProductList'];
    newProductList.value = res.data['newProductList'];
  })
}

</script>

<template>
  <div class="container">
    <home-nav-bar />
    <!-- 广告 -->
    <advertise-box :banner-list="advertiseList"/>
    <!-- 标签栏 -->
    <van-grid :border='false'>
      <van-grid-item icon="notes-o" text="话题" icon-color="#1989fa" />
      <van-grid-item icon="fire-o" text="优选" icon-color="#ee0a24"/>
      <van-grid-item icon="gift-o" text="特惠" icon-color="#ff0a24"/>
      <van-grid-item icon="star-o" text="签到" icon-color="#00ffff"/>
    </van-grid>
    <!-- 通知栏 -->
    <van-notice-bar left-icon="volume-o" :scrollable="false" 
      background="#fff" color="#666666">
      <van-swipe
        vertical
        class="notice-swipe"
        :autoplay="3000"
        :show-indicators="false"
      >
        <van-swipe-item>自营家电清洗服务上线 </van-swipe-item>
        <van-swipe-item>假日休闲无事可做，巧用vivo X80享受美好瞬间</van-swipe-item>
        <van-swipe-item>珠江白啤，不可多得国产精酿啤酒！</van-swipe-item>
      </van-swipe>
    </van-notice-bar>
    <!-- 品牌展示 -->
    <brand-box :brand-list="brandList" v-if="brandList && brandList.length"></brand-box>
    <!-- 新品展示 -->
    <product-box :product-list="newProductList" ptype="new" v-if="newProductList && newProductList.length" ></product-box>
    <!-- 人气商品展示 -->
    <product-box :product-list="hotProductList" ptype="hot" v-if="hotProductList && hotProductList.length"></product-box>
    <!-- 秒杀展示 -->
    <flash-promotion-box :flashList="homeFlashPromotion" v-if="homeFlashPromotion && homeFlashPromotion.length"></flash-promotion-box>
    <!-- 猜你喜欢 -->
    <recommend-box></recommend-box>
    <!-- 菜单 -->
    <tabbar />
  </div>
  
</template>

<style lang="less" scoped>
.notice-swipe {
    height: 22px;
    line-height: 22px;
    font-size: 12px;
  }
</style>
