
<script lang="ts" setup>
import { decimalFormat } from '@/utils/format';
import { useOrderStore } from '@/store/modules/order';

import {reactive, ref, unref } from 'vue';
import ReturnNavBar from '@/components/ReturnNavBar/index.vue';

import API_ORDER from '@/apis/order';
import ProList from '@/components/ProList/index.vue';
import {isFixedData} from '@/constants';
import axios from 'axios';

const orderStore = useOrderStore();

const listQuery = reactive({
  pageNum: 1,
  pageSize: 5,
});

const listEmptyText = ref('暂无订单');
 
function loadList() {
  const jsonFetch = ()=>{
    return axios.get('/src/views/order/data.json').then((response)=>response.data);
  }
  const params: Recordable = {
    page: listQuery.pageNum,
    pageSize: listQuery.pageSize,
    status: 3,
  };
  return isFixedData? jsonFetch() : API_ORDER.fetchOrderList(params);
}

// 订单状态
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

function onOrderClicked(goodInfo: Recordable, orderInfo: Recordable){
  orderStore.setTradeGoods({orderInfo, goodInfo});
}

</script>

<template>
  <ReturnNavBar title="售后" />
  <div class="container">
    <ProList :api="loadList" :pagination="listQuery" :empty-text="listEmptyText">
      <template #item="{ item, index }">
        <div :key="index" class="list-item">
          <div class="list-item-header van-hairline--bottom">
            <div class="list-item-header-hd">
              <span class="title">订单编号：{{ item.orderSn }}</span>
            </div>
            <div :class="['list-item-header-state', item.status !== -1 ? 'text-brand-color' : '']">
              {{ statusTransform(item.status) }}
            </div>
          </div>

          <div class="list-item-body" v-if="item.orderItemList.length">
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
              <!-- ▲ 操作按钮组 -->
              <van-button class="list-item-action-btn" round plain type="primary" @click="onOrderClicked(goodInfo, item)">
                申请售后
              </van-button>
            </div>
          </div>
        </div>
      </template>
    </ProList>
  </div>
</template>


<style lang="less" scoped>
.search {
  display: flex;
  padding: 0 15px;
  align-items: center;
  height: 60px;
  background: #fff;

  &-form {
    flex: 1;
    display: flex;
    align-items: center;
  }

  &-field {
    width: 100%;
    padding: 0;
    margin-right: 10px;

    :deep(.van-icon-search) {
      color: var(--brand-color);
      font-size: 17px;
    }
    :deep(.van-search) {
      padding: 6px 8px 6px 0;
    }
  }

  &-btn {
    box-sizing: border-box;
    padding: 0;
    width: 52px;
    height: 36px;
    line-height: 36px;
    border: 1px solid #c7c7c7;
    color: var(--gray-color-8);
    font-size: 14px;
  }
}

.list {
  &-item {
    .van-hairline--bottom::after {
      right: -44%;
      left: -44%;
    }

    margin: 10px;
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
      }

      &-state {
        text-align: right;
        color: var(--gray-color-6);
      }
    }

    &-footer {
      display: flex;
      align-items: center;
      justify-content: flex-end;
      padding: 10px 10px 0;
      font-size: 12px;
      color: var(--gray-color-6);
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
