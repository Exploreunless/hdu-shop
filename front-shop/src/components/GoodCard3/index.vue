<template>
  <div class="good-card" @click="onGoodClicked(goodInfo.productId || goodInfo.id)">
    <van-image fit="contain" class="good-card-pic" :src="goodInfo.productPic" />
    <div class="good-card-content">
      <div class="good-card-content-hd">
        <div class="good-card-title">{{ goodInfo.productName }}</div>
        <div v-if="goodInfo.productSubTitle" class="good-card-subtitle">{{ goodInfo.productSubTitle }}</div>
        <div v-if="goodInfo.productAttr" class="good-card-prop">{{ formatAttr(goodInfo.productAttr) }}</div>
      </div>
      <div class="good-card-content-bd">
        <div class="good-card-price">¥{{ decimalFormat(goodInfo.productPrice || goodInfo.price) }}</div>
        <div v-if="goodInfo.productQuantity || goodInfo.quantity" class="good-card-number">x{{ goodInfo.productQuantity || goodInfo.quantity }}</div>
      </div>
    </div>
  </div>
</template>


<script setup lang="ts">
import {useRouter} from 'vue-router';
import { decimalFormat } from '@/utils/format';
const router = useRouter();
withDefaults(
  defineProps<{ goodInfo?: any}>(),{
    goodInfo: ()=>([]),
  }
);

const onGoodClicked = (id: number)=>{
  router.push({path: '/good/detail', query: {id}})
}

// 处理商品属性
const formatAttr = (attrStr: string)=>{
  if(attrStr){
    const attrList = JSON.parse(attrStr);
    return attrList.reduce((str:string, attr:Recordable, i:number)=>{
      str += (i?";":'') + attr.value;
      return str;
    }, '')
  }
  return '';
}

</script>

<style lang="less" scoped>
.good-card {
  position: relative;
  box-sizing: border-box;
  padding: 12px 12px 10px;
  display: flex;

  &-pic {
    width: 72px;
    height: 72px;
    border-radius: 8px;
    margin-right: 8px;
    overflow: hidden;
  }

  &-content {
    flex: 1;
    display: flex;

    &-hd {
      flex: 1;
      margin-right: 12px;
    }
    &-bd {
      text-align: right;
    }
  }

  &-title {
    font-size: 14px;
    color: var(--gray-color-8);
    display: -webkit-box;
    overflow: hidden;
    text-overflow: ellipsis;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
  }

   &-subtitle {
    font-size: 13px;
    color: var(--gray-color-6);
    display: -webkit-box;
    overflow: hidden;
    text-overflow: ellipsis;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
  }

  &-prop {
    font-size: 12px;
    color: var(--gray-color-6);
    line-height: 16px;
    margin-top: 8px;
  }

  &-price {
    color: var(--gray-color-8);
    letter-spacing: 0;
    font-size: 14px;
  }

  &-number {
    color: var(--gray-color-6);
    line-height: 16px;
    margin-top: 8px;
    font-size: 12px;
  }
}
</style>

