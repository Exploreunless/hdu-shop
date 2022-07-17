<script lang="ts" setup>
import type { PropType } from 'vue';
import {reactive, computed} from 'vue'
import { useRouter } from 'vue-router';
import { Toast } from 'vant';
import Price from '@/components/Price/index.vue';
import { decimalFormat } from '@/utils/format';
import {typeOrderItem} from '../typing'

import { useOrderStore } from '@/store/modules/order';

const statusOptions = reactive([
  {
    label: '待付款',
    value: 0
  },
  {
    label: '待发货',
    value: 1
  },
  {
    label: '已发货',
    value: 2
  },
  {
    label: '已完成',
    value: 3
  },
  {
    label: '已关闭',
    value: 4
  }
]);

const statusTransform = (status: number)=>{
  return statusOptions.find((item) => item.value === status).label;
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

const router = useRouter();
const orderStore = useOrderStore();

// const props = defineProps({
//   item: { type: Object as PropType<typeOrderItem>, default: ()=>{} },
//   index: { type: Number, default: 0 },
// });

const props = withDefaults(
  defineProps<{ item?: typeOrderItem, index?:number}>(),{
    item: ()=>({} as Recordable),
    index: 0
  }
);

const emit = defineEmits(['delete']);
// 获取订单详情
function onOrderClicked(item: Recordable) {
  const { id } = item;
  router.push({
    path: '/order/detail',
    query: {
      id,
    },
  });
}
// 优惠总金额
const couponAmount = computed(()=>{
  const {item} = props;
  return item.promotionAmount + item.discountAmount + item.couponAmount;
})

// 应付金额
const payAmount = computed(()=>{
  const {item} = props;
  return item.payAmount +item.freightAmount-item.discountAmount;
})
// 商品总数
const goodsNumber = computed(()=>{
  const {item: {orderItemList}} = props;
  return orderItemList.reduce((sum, good)=>{
    return sum + good.productQuantity
  }, 0)
});

function onConcatService(_index?: number) {
  Toast('未开放：客服');
}

function onOrderCancel(item: Recordable) {
  orderStore
    .closeOrder({ orderId: item.id })
    .then(() => {
      Toast({ message: '取消订单成功', duration: 1500 });
      item.status = -1;
      item.statusStr = `订单关闭`;
    })
    .catch((error) => {
      console.error(error);
    });
}

function onOrderDelete(item: Recordable, index: number) {
  orderStore
    .deleteOrder({ orderId: item.id })
    .then(() => {
      Toast({ message: '删除订单成功', duration: 1500 });
      emit('delete', item, index);
    })
    .catch((error) => {
      console.error(error);
    });
}

</script>

<template>
  <div class="list-item">
    <div class="list-item-header van-hairline--bottom">
      <div class="list-item-header-hd">
        订单编号：<span class="title">{{ item.orderSn }}</span>
      </div>
      <div :class="['list-item-header-state', item.status !== -1 ? 'text-brand-color' : '']">
        {{ statusTransform(item.status) }}
      </div>
    </div>
    <div class="list-item-body" @click="onOrderClicked(item)" v-if="item.orderItemList.length">
      <div v-for="goodInfo in item.orderItemList" class="good-card">
        <van-image fit="contain" class="good-card-pic" :src="goodInfo.productPic" />
        <div class="good-card-content">
          <div class="good-card-content-hd">
            <div class="good-card-title">{{ goodInfo.productName }}</div>
            <div v-if="goodInfo.productAttr" class="good-card-prop">{{ formatAttr(goodInfo.productAttr) }}</div>
          </div>
          <div class="good-card-content-bd">
            <div class="good-card-price">¥{{ decimalFormat(goodInfo.productPrice) }}</div>
            <div class="good-card-number">x{{ goodInfo.productQuantity }}</div>
          </div>
        </div>
      </div>
    </div>
    <div class="list-item-total">
      <span class="list-item-total-number">共{{ goodsNumber }}件商品</span>
    </div>
    
    <div class="list-item-total van-hairline--top">
      
      <div class="list-item-total-price1" v-if="item.status !== 0">
        <span class="list-item-total-price-label"> {{ '总价' }}</span>
        <Price :type='true' :price="item.totalAmount + item.freightAmount" />
      </div>
      &nbsp;
      <div class="list-item-total-price1" v-if="item.status !== 0">
        <span class="list-item-total-price-label"> {{ '优惠' }}</span>
        <Price :type='true' :price="couponAmount" />
      </div>
      &nbsp;
      <div class="list-item-total-price">
        <span class="list-item-total-price-label"> {{ item.status === 0 ? '需付款' : '实付款' }}</span>
        <Price :price="payAmount" />
      </div>
    </div>
    
    <!-- ▼ 操作按钮组（一行最好不要超过3个） -->
    <div class="list-item-footer van-hairline--top">
      <template v-if="item.status === -1 || item.status === 3 || item.status === 4">
        <van-button class="list-item-action-btn" round @click.stop="onOrderDelete(item, index)"> 删除订单 </van-button>
      </template>
      <template v-if="item.status === 0">
        <van-button class="list-item-action-btn" round plain @click.stop="onOrderCancel(item)"> 取消订单 </van-button>
        <van-button class="list-item-action-btn" round plain type="primary" @click.stop="onOrderClicked(item)">
          去支付
        </van-button>
      </template>
      <template v-if="item.status === 1">
        <van-button icon="service" class="list-item-action-btn" round @click.stop="onConcatService()">
          联系客服
        </van-button>
      </template>
      <template v-if="item.status === 2">
        <van-button class="list-item-action-btn" round @click.stop="onOrderClicked(item)">确认收货</van-button>
      </template>
      <template v-if="item.status === 3">
        <van-button class="list-item-action-btn" round @click.stop="onOrderClicked(item)">评价</van-button>
      </template>
    </div>
    <!-- ▲ 操作按钮组 -->
  </div>
</template>

<style lang="less" scoped>
.list {
  &-item {

    .van-hairline--bottom::after {
      right: -44%;
      left: -44%;
    }

    margin: 10px;
    // width: 100%;
    border-radius: 8px;
    background: #fff;
    padding-bottom: 10px;

    &-header {
      display: flex;
      padding: 10px 12px;
      align-items: center;
      font-size: 14px;
      color: var(--gray-color-8);

      &-hd {
        flex: 1;
        margin-right: 10px;
        .title{
          color: var(--gray-color-6)
        }
      }

      &-state {
        text-align: right;
        color: var(--gray-color-6);
      }
    }

    &-more {
      font-size: 14px;
      color: var(--gray-color-6);
      padding: 5px;
      line-height: 28px;
      text-align: center;
    }
    
    &-total {
      
      padding: 0 12px;
      color: var(--gray-color-8);
      display: flex;
      justify-content: flex-end;
      align-items: center;
      font-size: 12px;

      &-number {
        height: 20px;
        margin-right: 5px;
      }
      &-price {
        height: 48px;
        display: flex;
        justify-content: flex-end;
        align-items: center;
        font-size: 12px;
      }

      &-price1 {
        height: 48px;
        display: flex;
        justify-content: flex-end;
        align-items: center;
        font-size: 10px;
      }
    }

    &-footer {
      display: flex;
      align-items: center;
      justify-content: flex-end;
      padding: 10px 10px 0;
    }

    &-action-btn {
      height: 32px;
      padding: 0 8px;
      min-width: 80px;
      font-size: 14px;

      &:not(:last-child) {
        margin-right: 12px;
      }
    }
  }
}

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
    -webkit-line-clamp: 2;
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
