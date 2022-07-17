<template>
 <div @click="onBrandClicker" class="list">
  <div class="left-item">
    <van-image class="left-item-photo" :src="brandInfo.logo" :alt="brandInfo.name" />
    <div class="left-item-info">
      <div class="left-item-title">{{ brandInfo.name}}</div>
      <div class="left-item-sub-title">{{brandInfo.brandStory}}</div>
    </div>
  </div>
  <div class="right-item">
     <span class="service-info">
      {{brandInfo.productCount}} 件商品
    </span>
    <van-icon name="arrow" />
  </div>
  </div>
</template>

<script setup lang="ts">
import {useRouter} from 'vue-router';
interface brand{
  id?: number,
  name?: string,
  firstLetter?: string,
  logo?: string,
  brandStory?: string,
  productCount?: number,
  productCommentCount?: number,
  showStatus?: string,
  sort?: number,
  [key: string]: any
} 

const props = withDefaults(
  defineProps<{ brandInfo?: any }>(),{
      brandInfo: ()=>({}),
  }
);
const router = useRouter();
function onBrandClicker() {
  // router.push({path: '/brand', query: {props.brandInfo.id}});
}

</script>

<style lang="less" scoped>
.list{
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  .left-item {
    position: relative;
    text-align: left;
    overflow: hidden;
    background: var(--white);
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
      font-size: 15px;
      color: var(--gray-color-7);
      line-height: 16px;
      display: -webkit-box;
      overflow: hidden;
      text-overflow: ellipsis;
      -webkit-line-clamp: 1;
      -webkit-box-orient: vertical;
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
    //  width: 30%;
     .service-info{
        font-size: 13px;
        color: var(--gray-color-7);
        overflow: hidden;
     }

     .van-icon{
       color: var(--van-cell-right-icon-color);
     }

  }

}

</style>
