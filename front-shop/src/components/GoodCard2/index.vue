<template>
  <div class="list-item" @click="onGoodClicked(good.product.id)">
    <div class="list-item-badge">限购{{good.flashPromotionLimit}}件</div>
    <van-image class="list-item-photo" :src="good.product.pic" :alt="good.name" />
    <div class="list-item-info">
      <div class="list-item-title">{{ good.product.name }}</div>
      <div class="list-item-title">剩 {{good.flashPromotionCount}} 件</div>
      <div class="list-item-price">
        <div class="price">
          <div class="price-current">
            <span class="price-current-symbol">秒杀价</span>
            <span class="price-current-symbol">¥</span>
            <span class="price-current-integer">{{ good.flashPromotionPrice }}</span>
          </div>
          <div class="price-origin">
            <span class="price-origin-symbol">¥</span>
            <span class="price-origin-integer">{{ good.product.price }}</span>
          </div>
        </div>
        <van-button type="danger" plain class="buy-btn">抢购</van-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {useRouter} from 'vue-router';

const router = useRouter();
withDefaults(
  defineProps<{ good?: any}>(),{
    good: ()=>([]),
  }
);

const onGoodClicked = (id: number)=>{
  router.push({path: '/good/detail', query: {id}})
}

</script>

<style lang="less" scoped>

  .list-item {
    position: relative;
    text-align: left;
    overflow: hidden;
    background: var(--white);
    border-radius: 10px;
    display: flex;
    margin-bottom: 5px;
    // width: 100%;
    
    // box-shadow: 0px 2px 4px 3px rgba(243, 243, 243, 0.5);

    &-badge {
      position: absolute;
      top: 5px;
      left: 0;
      z-index: 2;
      display: inline-block;
      padding: 2px 4px;
      color: var(--white);
      background-color: var(--red-color);
      font-size: 8px;
      line-height: normal;
      border-radius: 0 8px 8px 0;
      padding-right: 6px;
    }

    &-photo {
      width: 33%;
      height: 100px;
      display: flex;
    }

    &-info {
      width: 67%;
      padding: 5px 10px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }

    &-title {
      font-size: 13px;
      color: var(--gray-color-7);
      line-height: 16px;
      display: -webkit-box;
      overflow: hidden;
      text-overflow: ellipsis;
      -webkit-line-clamp: 1;
      -webkit-box-orient: vertical;
    }

    &-price {
      margin-top: 5px;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .buy-btn {
      height: 20px;
      padding: 0 5px;
      line-height: 20px;
      font-size: 13px;
    }

    .price {
      display: flex;
      align-items: center;

      &-current {
        margin-right: 5px;
        color: var(--red-color);

        &-symbol {
          font-size: 12px;
          margin-right: 2px;
        }

        &-integer {
          font-size: 15px;
          font-family: @font-family-price-integer;
        }
      }

      &-origin {
        font-size: 12px;
        text-decoration: line-through;
        color: var(--gray-color-6);

        &-label {
          margin-right: 2px;
        }

        &-integer {
          text-decoration: line-through;
          font-family: @font-family-price-integer;
        }
      }
    }
  }
</style>