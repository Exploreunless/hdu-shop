<script lang="ts" setup>
import { onMounted, reactive, ref, unref, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import ReturnNavBar from '@/components/ReturnNavBar/index.vue';
import { decimalFormat, formatTime } from '@/utils/format';
import API_ORDER from '@/apis/order';
import {isFixedData} from '@/constants';
import axios from 'axios';
import {typeOrderItem} from './typing';
import {formatPayType, formatOrderType, statusOptions} from '@/constants/modules/order'
import {Toast, Dialog } from 'vant';
import { setClipboardData } from '@/utils/helpers/clipboard';
import { useOrderStore } from '@/store/modules/order';
import Price from '@/components/Price/index.vue';
import OrderSteps from './components/OrderSteps.vue';
import OrderRate from './components/OrderRate.vue';


onMounted(() => {
  getDetail();
});

const route = useRoute();
const router = useRouter();
const orderStore = useOrderStore();

const orderInfo = ref<typeOrderItem>({});

// 订单状态
const statusTransform = (status: number)=>{
  return statusOptions.find((item) => item.value === status)?.label;
}
// 超时订单处理
const closeTime = ref(30*60*1000);
function onCountDownFinish(){
  API_ORDER.cancelOutOrder({orderId: orderInfo.value.id}).then(()=>{
    Toast({message: '订单已超时，自动取消', duration: 1500})
  }).finally(()=>{
     onRefresh();
  });
}
// 加载标志
const isLoading = ref(false);

// 订单跟踪
const logList = computed(()=>{
  return [
    {typeStr: '下单', 'dateAdd': formatTime(orderInfo.value.createTime)},
    {typeStr: '支付', 'dateAdd': formatTime(orderInfo.value.paymentTime)},
    {typeStr: '发货中', 'dateAdd': formatTime(orderInfo.value.deliveryTime)},
    {typeStr: '已收货', 'dateAdd': formatTime(orderInfo.value.receiveTime)},
    {typeStr: '已评价', 'dateAdd': formatTime(orderInfo.value.commentTime)},
  ]
});
const stepsPopupShow = ref(false);
function onStepsOpen(){
  stepsPopupShow.value = true;
}

// 处理商品属性
const formatAttr = (attrStr: string)=>{
  const attrList = JSON.parse(attrStr);
  return attrList.reduce((str:string, attr:Recordable, i:number)=>{
    str += (i?";":'') + attr.value;
    return str
  }, '')
}

// 应付金额
const payAmount = computed(()=>{
  const item = orderInfo.value;
  return item.payAmount +item.freightAmount-item.discountAmount;
})
// 地址
const address = computed(()=>{
  const {receiverProvince, receiverCity, receiverRegion, receiverDetailAddress} = orderInfo.value;
  return receiverProvince + receiverCity + receiverRegion + receiverDetailAddress;
})

function fetchOrderList(){
  return axios.get('/src/views/order/data.json')
    .then(response=>{
      return {data: response.data.data.list[0]}
    }).catch((error)=>{
      console.log(error);
    });
} 

// 获取订单详情
function getDetail(){
  const api = isFixedData ? fetchOrderList() : API_ORDER.orderDetail(Number(route.query.id));
  
  api.then((res) => {
    orderInfo.value = res.data;
    // 待支付的订单
    if (unref(orderInfo).status === 0) {
      // const end = dayjs(unref(orderInfo).dateClose);
      // const now = dayjs();
      // closeTime.value = end.diff(now);
    }
  })
  .finally(() => {
    isLoading.value = false;
  });
}
// 删除订单
function onOrderDelete(orderId: number){
  orderStore
    .deleteOrder({ orderId })
    .then(() => {
      Toast({ message: '删除订单成功', duration: 1500 });
      router.back();
    })
    .catch((error) => {
      console.error(error);
    });
}

// 取消订单
function onOrderCancel(orderId: number){
  orderStore
    .closeOrder({ orderId })
    .then(() => {
      Toast({ message: '取消订单成功', duration: 1500 });
      onRefresh();
    })
    .catch((error) => {
      console.error(error);
    });
}

// 去支付
function onOrderPay(orderId: number){
  Toast({ message: '未开放：收银台', duration: 1500 });
}

// 联系客服
function onConcatService(_orderId: number){
  Toast('未开放：客服');
}
// 确认收货
function onOrderDelivery(orderId){
  Dialog.confirm({
    title: '提示',
    message: '确认您已收到商品？',
  })
  .then(() => {
    // on confirm
    Toast.loading({
      forbidClick: false,
      message: '加载中...',
      duration: 0,
    });
    API_ORDER.orderConfirmReceive({ orderId }).then(() => {
      Toast({ message: '确认收货成功', duration: 1500 });
      onRefresh();
    });
  })
  .catch(() => {
    // on cancel
  });
}

// 去评价
const ratePopupShow = ref(false);
function onOrderReputation(){
  ratePopupShow.value = true;
}

// 刷新
function onRefresh(){
  getDetail();
}

// 复制剪切板
function onCopy(text: string) {
  setClipboardData({ data: text }).then(() => {
    Toast({
      message: '复制成功',
      duration: 1500,
    });
  });
}

// 点击商品详情
function onGoodClicked(id: number) {
  router.push({
    path: '/good/detail',
    query: {
      id,
    },
  });
}

</script>

<template>
  <ReturnNavBar title="订单详情" />
  <div class="container">
    <van-pull-refresh v-model="isLoading" @refresh="onRefresh">
      <div class="container">
        <div class="header">
          <div :class="['order-status', `order-status--${orderInfo.status}`]">
            <div class="order-status-title">{{ statusTransform(orderInfo.status) }}</div>
            <template v-if="orderInfo.status === 0 && closeTime > 0">
              <div class="order-status-desc">
                请于<van-count-down
                  class="count-down"
                  :time="closeTime"
                  format="mm 分 ss 秒"
                  @finish="onCountDownFinish"
                />内付款， 超时订单将自动关闭
              </div>
            </template>
          </div>
          <div class="order-step" @click="onStepsOpen">
            <span class="order-step-label">订单跟踪</span>
            <van-icon class="order-step-icon" name="arrow" />
          </div>
          <OrderSteps v-model:show="stepsPopupShow" :list="logList" />
        </div>
        <template >
          <div class="address van-hairline--top">
            <div class="address-hd">
              <div class="address-inner">
                <van-icon name="location-o" class="address-inner-icon" />
                <div class="address-inner-title">收货人：{{ orderInfo.receiverName }}</div>
                <div class="address-inner-title">{{ orderInfo.receiverPhone }}</div>
              </div>
              <div class="address-inner-bottom">收货地址：{{ address }}</div>
            </div>
          </div>
          <van-cell title="物流信息" class="cell">
            <template v-if="orderInfo.deliverySn && orderInfo.deliverySn.length">
              {{ orderInfo.deliveryCompany }} {{ orderInfo.deliverySn }}
            </template>
            <template v-else>无</template>
          </van-cell>
        </template>
        <!-- 商品列表 -->
        <div class="section">
          <div class="section-header van-hairline--bottom">
            <van-icon class="section-header-icon" name="shop-o" />
            <span class="section-header-title">商品列表</span>
          </div>
          <div class="list">
            <div v-for="(item, index) in orderInfo.orderItemList" :key="item.id" class="list-item" @click="onGoodClicked(item.productId)">
              <van-image fit="contain" class="list-item-pic" :src="item.productPic" />
              <div class="list-item-content">
                <div class="list-item-title">{{ item.productName }}</div>
                <div class="list-item-desc">
                  <div class="list-item-prop">
                    {{ formatAttr(item.productAttr) }}
                  </div>
                </div>
                <div class="list-item-bottom">
                  <div class="list-item-price text-brand-color">
                    <span class="list-item-price-symbol">¥</span>
                    <span class="list-item-price-integer">{{ decimalFormat(item.productPrice) }}</span>
                  </div>
                  <div class="list-item-number">x{{ item.productQuantity }}</div>
                </div>
              </div>
            </div>
          </div>
          <div class="subtotal">
            <span class="subtotal-label">商品小计：</span>
            <span class="subtotal-price">
              <span class="subtotal-price-symbol">¥</span>
              <span class="subtotal-price-integer">{{ decimalFormat(orderInfo.totalAmount) }}</span>
            </span>
          </div>
        </div>
        <!-- 金额统计信息 -->
        <div class="section">
          <div class="amount">
            <div class="amount-hd">商品金额</div>
            <div class="amount-bd">¥ {{ decimalFormat(orderInfo.totalAmount) }}</div>
          </div>
          <div v-if="orderInfo.freightAmount" class="amount">
            <div class="amount-hd">运费</div>
            <div class="amount-bd">+ {{ decimalFormat(orderInfo.freightAmount) }}</div>
          </div>
          <div v-if="orderInfo.couponAmount" class="amount">
            <div class="amount-hd">优惠券</div>
            <div class="amount-bd">- {{ decimalFormat(orderInfo.couponAmount) }}</div>
          </div>
          <div v-if="orderInfo.promotionAmount" class="amount">
            <div class="amount-hd">活动优惠</div>
            <div class="amount-bd">- {{ decimalFormat(orderInfo.promotionAmount) }}</div>
          </div>
          <div v-if="orderInfo.discountAmount" class="amount">
            <div class="amount-hd">折扣金额</div>
            <div class="amount-bd">- {{ decimalFormat(orderInfo.discountAmount) }}</div>
          </div>
          <div v-if="orderInfo.integrationAmount" class="amount">
            <div class="amount-hd">积分抵扣</div>
            <div class="amount-bd">- {{ decimalFormat(orderInfo.integrationAmount) }}</div>
          </div>
          <div class="amount amount-total-price">
            <span class="amount-total-price-label">{{ orderInfo.status === 0 ? '需付款：' : '实付款：' }}</span>
            <Price class="amount-total-price-price" :price="payAmount" />
          </div>
        </div>
        <!-- 订单信息 -->
        <div class="section">
          <div class="order-no">
            <div class="order-no-p">
              订单编号：
              <span class="order-no-p-value">{{ orderInfo.orderSn }}</span>
              <van-button
                class="order-no-copy-btn"
                plain
                type="default"
                size="mini"
                @click="onCopy(orderInfo.orderSn)"
              >
                复制
              </van-button>
            </div>
            <div class="order-no-p">
              下单时间：
              <span class="order-no-p-value"> {{ formatTime(orderInfo.createTime) }}</span>
            </div>
            <div class="order-no-p" v-if="orderInfo.paymentTime">
              支付时间：
              <span class="order-no-p-value"> {{ formatTime(orderInfo.paymentTime) }}</span>
            </div>
            <div class="order-no-p">
              支付方式：
              <span class="order-no-p-value">在线支付</span>
            </div>
            <div class="order-no-p">
              付款方式：
              <span class="order-no-p-value">{{formatPayType(orderInfo.payType)}}</span>
            </div>
            <div class="order-no-p">
              订单类型：
              <span class="order-no-p-value">{{formatOrderType(orderInfo.orderType)}}</span>
            </div>
            <div v-if="orderInfo.deliveryCompany && orderInfo.deliveryCompany.length" class="order-no-p">
              配送方式：
              <span class="order-no-p-value"> {{orderInfo.deliveryCompany}}</span>
            </div>
          </div>
        </div>
        <!-- 备注 -->
        <div class="section">
          <van-cell title="买家留言" class="cell" :value="orderInfo.note || '无'" />
        </div>
        <!-- 底部操作栏 -->
        <div class="action-bar-wrap">
          <div class="action-bar">
            <!-- ▼ 操作按钮组（一行最好不要超过3个） -->
            <template v-if="orderInfo.status === -1 || orderInfo.status === 3 || orderInfo.status === 4">
              <van-button class="action-bar-btn" round @click.stop="onOrderDelete(orderInfo.id)"> 删除订单 </van-button>
            </template>
            <template v-if="orderInfo.status === 0">
              <div class="action-bar-hd">
                <span class="action-bar-total">合计：</span>
                <div class="action-bar-price">
                  <span class="action-bar-price-symbol">¥</span>
                  <span class="action-bar-price-integer">{{ decimalFormat(payAmount) }}</span>
                </div>
              </div>
              <van-button class="action-bar-btn" round plain @click.stop="onOrderCancel(orderInfo.id)">
                取消订单
              </van-button>
              <van-button class="action-bar-btn" round type="primary" @click.stop="onOrderPay(orderInfo.id)">
                去支付
              </van-button>
            </template>
            <template v-if="orderInfo.status === 1">
              <van-button icon="service" class="action-bar-btn" round @click.stop="onConcatService(orderInfo.id)">
                联系客服
              </van-button>
            </template>
            <template v-if="orderInfo.status === 2">
              <van-button class="action-bar-btn" round @click.stop="onOrderDelivery(orderInfo.id)">确认收货</van-button>
            </template>
            <template v-if="orderInfo.status === 3">
              <van-button class="action-bar-btn" round @click.stop="onOrderReputation">评价</van-button>
            </template>
            <!-- ▲ 操作按钮组 -->
          </div>
        </div>
        <!-- 评价弹层 -->
        <OrderRate v-model:show="ratePopupShow" />
      </div>
    </van-pull-refresh>
  </div>
</template>

<style lang="less" scoped>
.header {
  box-sizing: border-box;
  position: relative;
  padding: 0 15px;
  background: #fff;
}

.order-status {
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  padding: 10px 90px 10px 52px;
  min-height: 40px;
  background: url('@/assets/images/order/icon_status.png') 0 no-repeat;
  background-size: 40px 40px;

  &---1 {
    background-image: url('@/assets/images/order/icon_status_-1.png');
  }

  &--1 {
    background-image: url('@/assets/images/order/icon_status_1.png');
  }

  &--2 {
    background-image: url('@/assets/images/order/icon_status_2.png');
  }

  &-title {
    font-size: 14px;
    font-weight: bold;
    color: var(--gray-color-8);
  }

  &-desc {
    font-size: 12px;
    color: var(--gray-color-7);
  }

  .count-down {
    display: inline-flex;
    font-size: 12px;
    color: var(--gray-color-7);
  }
}

.order-step {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  right: 10px;
  color: var(--gray-color-6);
  font-size: 14px;

  &-icon {
    margin-left: 5px;
  }
}

.address {
  position: relative;
  box-sizing: border-box;
  min-height: 60px;
  // display: flex;
  // justify-content: flex-start;
  // align-items: center;
  padding: 8px 15px;
  background: #fff;
  &-hd {
    flex: 1;
    // padding:0 10px;
    padding-left: 20px;
  }
  &-bd {
    margin-top: 10px;
    padding: 10px 15px 5px;
    font-size: 14px;
    color: #333;
  }
  &-inner {
    position: relative;
    display: flex;
    justify-content: space-between;
    align-items: center;
    &-icon {
      position: absolute;
      top: 2px;
      left: -20px;
    }
    &-title {
      font-size: 14px;
      color: #333;
      font-weight: bold;
      margin-bottom: 5px;
    }
    &-bottom {
      font-size: 12px;
      color: #999;
    }
  }
  &:before {
    position: absolute;
    right: 0;
    bottom: 0;
    left: 0;
    height: 2px;
    background: -webkit-repeating-linear-gradient(
      135deg,
      #ff6c6c 0,
      #ff6c6c 20%,
      transparent 0,
      transparent 25%,
      #1989fa 0,
      #1989fa 45%,
      transparent 0,
      transparent 50%
    );
    background: repeating-linear-gradient(
      -45deg,
      #ff6c6c 0,
      #ff6c6c 20%,
      transparent 0,
      transparent 25%,
      #1989fa 0,
      #1989fa 45%,
      transparent 0,
      transparent 50%
    );
    background-size: 80px;
    content: '';
  }
}

.mb10 {
  margin-bottom: 10px;
}
.mt10 {
  margin-top: 10px;
}

.list {
  &-item {
    position: relative;
    box-sizing: border-box;
    padding: 8px 15px;
    display: flex;
    align-items: center;

    &-pic {
      width: 90px;
      height: 90px;
      border-radius: 8px;
      margin-right: 10px;
      overflow: hidden;
    }

    &-content {
      min-width: 0;
      min-height: 90px;
      flex: 1;
      display: flex;
      flex-direction: column;
    }

    &-bottom {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    &-title {
      font-size: 14px;
      line-height: 16px;
      color: var(--gray-color-8);
      display: -webkit-box;
      overflow: hidden;
      text-overflow: ellipsis;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
    }

    &-desc {
      flex: 1;
      font-size: 12px;
      line-height: 20px;
      color: var(--gray-color-6);
    }

    &-price {
      color: var(--gray-color-8);
      &-symbol {
        font-size: 12px;
        margin-right: 2px;
      }

      &-integer {
        font-size: 18px;
        font-family: @font-family-price-integer;
      }
    }

    &-bottom {
      font-size: 12px;
      color: var(--gray-color-6);
    }
  }
}

.section {
  box-sizing: border-box;
  position: relative;
  overflow: hidden;
  margin: 12px 0;
  // border-radius: 8px;
  background-color: var(--white);

  &-header {
    font-size: 14px;
    padding: 10px 15px;
    display: flex;
    align-items: center;
    margin-bottom: 2px;

    &-icon {
      margin-right: 8px;
      font-size: 18px;
    }

    &-title {
      font-weight: bold;
    }

    &.van-hairline--bottom::after {
      right: -40%;
      left: -40%;
    }
  }
}

.subtotal {
  box-sizing: border-box;
  padding: 0 15px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  height: 44px;
  font-size: 14px;
  color: var(--gray-color-8);

  &-num {
    margin-right: 8px;
  }

  &-price {
    color: var(--brand-color);
    &-symbol {
      font-size: 12px;
      margin-right: 2px;
    }

    &-integer {
      font-size: 16px;
      font-family: @font-family-price-integer;
    }
  }
}

.cell {
  font-size: 14px;
  .van-cell__title {
    color: var(--gray-color-6);
  }
  .van-cell__value {
    color: var(--gray-color-8);
  }
}

.amount {
  display: flex;
  align-items: center;
  padding: 10px 15px;
  font-size: 14px;

  &-hd {
    margin-right: 10px;
    color: var(--gray-color-6);
  }
  &-bd {
    flex: 1;
    margin-left: 10px;
    text-align: right;
    color: var(--gray-color-8);
  }

  &-total-price {
    height: 48px;
    padding: 0 15px;
    color: var(--gray-color-8);
    display: flex;
    justify-content: flex-end;
    align-items: center;
    font-size: 12px;

    &-price {
      color: var(--brand-color);
    }
  }
}

.order-no {
  font-size: 13px;
  padding: 10px 15px;

  &-p {
    height: 35px;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    color: var(--gray-color-6);

    &-value {
      margin-left: 10px;
      color: var(--gray-color-8);
    }
  }

  &-copy-btn {
    margin-left: 5px;
  }
}

.action-bar {
  box-sizing: border-box;
  position: fixed;
  left: 0;
  bottom: constant(safe-area-inset-bottom);
  bottom: env(safe-area-inset-bottom);
  z-index: 100;
  width: 100%;
  padding: 0 16px;
  background-color: #fff;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  height: 50px;
  font-size: 14px;

  &-wrap {
    height: calc(50px + constant(safe-area-inset-bottom));
    height: calc(50px + env(safe-area-inset-bottom));
  }

  &-hd {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    padding-right: 15px;
    color: var(--gray-color-8);
  }

  &-price {
    color: var(--brand-color);
    font-weight: bold;

    &-symbol {
      font-size: 12px;
      margin-right: 2px;
    }

    &-integer {
      font-size: 20px;
      font-family: @font-family-price-integer;
    }
  }

  &-btn {
    height: 32px;
    padding: 0 8px;
    min-width: 80px;
    font-size: 14px;

    &:not(:last-child) {
      margin-right: 12px;
    }
  }
}
</style>