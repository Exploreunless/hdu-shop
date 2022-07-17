<template>
<div class="swiper">
  <van-swipe :autoplay="5000" class="swiper">
    <van-swipe-item
      v-for="item in bannerList"
      :key="item.id"
      class="swiper-item"
      @click="onBannerClicked(item.url)"
    >
      <van-image class="swiper-item-img" fit="cover" :title="item.name" :src="item.pic" :alt="item.note" />
    </van-swipe-item>
  </van-swipe>
</div>
</template>

<script setup lang="ts">

interface banner{
  "id": number,
  "name": string,
  "type": number,
  "pic": string,
  "startTime": string,
  "endTime": string,
  "status": number,
  "clickCount": number,
  "orderCount": number,
  "url": string,
  "note": string,
  "sort": number,
  [key: string]: any
} 

withDefaults(
  defineProps<{ bannerList?: Array<banner> }>(),{
      bannerList: ()=>([]),
  }
);

function onBannerClicked(linkUrl: string) {
  if (linkUrl) {
    window.location.href = linkUrl;
  }
}

</script>

<style lang="less" scoped>
.swiper {
  width: 100%;
  height: 180px;
  // margin-bottom: 10px;

  &-item,
  &-item-img {
    width: 100%;
    height: 100%;
  }
}
</style>
