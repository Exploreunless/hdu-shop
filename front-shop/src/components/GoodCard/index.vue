<template>
  <div class="list-item" @click="onGoodClicked(good.id)">
    <div v-if="ptype === 'hot' && !!good.recommandStatus" class="list-item-badge-1">推荐</div>
    <div v-if="ptype === 'new' && !!good.newStatus" class="list-item-badge-2">新品</div>
    <van-image class="list-item-photo" :src="good.pic" :alt="good.name" />
    <div class="list-item-info">
      <div class="list-item-title">{{ good.name }}</div>
      <div class="list-item-price">
        <div class="price">
          <div class="price-current">
            <span class="price-current-symbol">¥</span>
            <span class="price-current-integer">{{ good.price }}</span>
          </div>
          <div v-if="good.originalPrice > good.price" class="price-origin">
            <span class="price-origin-symbol">¥</span>
            <span class="price-origin-integer">{{ good.originalPrice }}</span>
          </div>
        </div>
        <van-button type="primary" plain class="buy-btn">购买</van-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {useRouter} from 'vue-router';

const router = useRouter();
withDefaults(
  defineProps<{ good?: any, ptype?:string}>(),{
    good: ()=>([]),
    ptype: ''
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
    border-radius: 8px;
    margin: 0 5px;
    // width: 100%;
    
    // box-shadow: 0px 2px 4px 3px rgba(243, 243, 243, 0.5);

    &-badge-1 {
      position: absolute;
      top: 15px;
      left: 0;
      z-index: 2;
      display: inline-block;
      padding: 2px 4px;
      color: var(--white);
      background-color: var(--red-color);
      font-size: 10px;
      line-height: normal;
      border-radius: 0 8px 8px 0;
      padding-right: 6px;
    }
    &-badge-2 {
      position: absolute;
      top: 15px;
      left: 0;
      z-index: 2;
      display: inline-block;
      padding: 2px 4px;
      color: var(--white);
      background-color: var(--green-color);
      font-size: 10px;
      line-height: normal;
      border-radius: 0 8px 8px 0;
      padding-right: 6px;
    }

    &-photo {
      width: 100%;
      height: 178px;
      display: flex;
    }

    &-info {
      padding: 5px 10px;
    }

    &-title {
      font-size: 13px;
      color: var(--gray-color-7);
      min-height: 31px;
      line-height: 16px;
      display: -webkit-box;
      overflow: hidden;
      text-overflow: ellipsis;
      -webkit-line-clamp: 2;
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
        color: var(--brand-color);

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