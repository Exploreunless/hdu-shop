<script lang="ts" setup>
import { computed, onMounted, reactive, ref, unref } from 'vue';
import { useRouter } from 'vue-router';
import { Dialog, Toast } from 'vant';
import NP from 'number-precision';
import API_ORDER from '@/apis/order';
import { decimalFormat, mobileShow } from '@/utils/format';
import SelectAddress from './components/SelectAddress.vue';
import orderCoupon from './components/OrderCoupon.vue';
import orderBalance from './components/OrderBalance.vue';
import GoodCard from '@/components/GoodCard3/index.vue';
import returnNavBar from '@/components/ReturnNavBar/index.vue';
import {isFixedData} from '@/constants';

import axios from 'axios';

import {useRoute} from 'vue-router';

const route = useRoute();

function fetchOrderList(){
  return axios.get('/src/views/order/data2.json').then((response)=>response.data);
} 

const origin = computed(()=>{
  return route.query?.origin ?? 'cart';
})

const cartIds = computed(()=>{
  return (typeof route.query?.ids === 'object') ? route.query?.ids as string[] : [route.query?.ids];
})

onMounted(() => {
  getDetail();
  
  // getUserAmount();
  // getOrderSetInfo();
});

function getDetail(){
  const api = isFixedData ? fetchOrderList() : API_ORDER.generateConfirmOrder(unref(cartIds));
  api.then((res)=>{
    // 地址
    addressList.value = res.data?.memberReceiveAddressList ?? [];
    addressInfo.value = addressList.value.find((item)=>{
      return !!item.defaultStatus;
    }) || (addressList.value && addressList.value[0]);
    // 商品
    goodList.value = res.data?.cartPromotionItemList ?? [];

    // 优惠券
    couponList.value = res.data?.couponHistoryDetailList ?? [];

    // 用户积分
    balance.value = res.data?.memberIntegration ?? 0;

    // 积分规则
    balanceSetting.value = res.data?.integrationConsumeSetting ?? {};

    // 金额
    calcAmount.value = res.data?.calcAmount ?? {};

  }).catch((error)=>{
    console.log(error);
  })
}

const router = useRouter();

// 地址信息
const addressInfo = ref<Recordable>();
const addressList = ref<Recordable[]>();
const addressPopupShow = ref(false);

function onAddressClicked() {
  addressPopupShow.value = true;
}

function formatAreaStr(province: string, city: string, region: string) {
  let str = province;
  city.length > 1 && city !== province && (str += `${city}`);
  region.length > 1 && (str += `${region}`);
  return str;
}

function onAddressSelected(item: Recordable) {
  addressInfo.value = item;
}

// 商品信息
const goodList = ref<Recordable[]>([]);
const calcAmount = ref<Recordable>({});
const couponAmount = computed(()=>{
  return selectedCoupon.value? selectedCoupon.value.coupon.amount: 0.00;
});
const balanceAmount = computed(()=>{
  return selectedBalance.value? 
    NP.divide(selectedBalance.value, balanceSetting.value.deductionPerAmount).toFixed(2):0.00;
})
// 总价格
const totalAmount = computed(()=>{
  return calcAmount.value.payAmount ? NP.minus(calcAmount.value.payAmount, balanceAmount.value, couponAmount.value):undefined;
})

// 优惠券
const couponList = ref<Recordable[]>();
const couponShow = ref(false);
function onCouponClicker(){
  couponShow.value = true;
}
const selectedCoupon = ref<Recordable>();

// 钱包
const money = ref<number>(0.00);
const balance = ref<number>(0);
const balanceSetting = ref<Recordable>();
const balanceShow = ref(false);
const selectedBalance = ref<number>(0);
function onSelectBalance(i:number){
  selectedBalance.value = i;
}
function onBalanceClicker(){
  balanceShow.value = true;
}

// 支付方式
const payType = reactive([
  {name: '余额',  value: 0, label: true},
  {name: '支付宝', value: 1, label: false},
  {name: '微信', value: 2, label: false},
])

const selectedPayType = ref<number>(-1);
function onPayTypeClicker(value: number){
  selectedPayType.value = value;
}

const remark = ref('');

// const tradeGoods = computed(() => orderStore.getTradeGoods);
// const goodList = computed(() => unref(tradeGoods).list);

const submitLoading = ref(false);

function onSubmit() {
  if (!unref(addressInfo)) {
    Toast({ message: '地址栏不能为空', duration: 1500 });
    return;
  }
   if (unref(selectedPayType) === -1) {
    Toast({ message: '请选择支付方式', duration: 1500 });
    return;
  }

  if (unref(selectedPayType) === 0 && unref(money) < unref(totalAmount)) {
    Dialog.confirm({
      title: '余额不足',
      message: '请充值',
      confirmButtonText: '我知道了',
    })
      .then(() => {})
      .catch(() => {
        // on cancel
      });
    return;
  }

  createOrder();
}

/**
 * 创建订单
 */
async function createOrder() {
  // let orderParams = new URLSearchParams();
  // // @ts-ignore
  // orderParams.append('cartIds', unref(cartIds).map(item=>Number(item)));
  // orderParams.append('memberReceiveAddressId',  unref(addressInfo).id);
  // // @ts-ignore
  // orderParams.append('payType',  unref(selectedPayType));
  // // @ts-ignore
  // orderParams.append('useIntegration',  unref(selectedBalance));
  // unref(selectedCoupon) && (orderParams.append('couponId', unref(selectedCoupon).couponId));
  const orderParams: Recordable = {
    cartIds: unref(cartIds).map(item=>Number(item)), 
    memberReceiveAddressId: unref(addressInfo).id, 
    payType: unref(selectedPayType),
    // useIntegration: unref(selectedBalance)
  };
  unref(selectedBalance) && (orderParams['useIntegration'] = unref(selectedBalance))
  unref(selectedCoupon) && (orderParams['couponId'] = unref(selectedCoupon).couponId) ;
  Toast.loading({
    forbidClick: true,
    message: '订单创建中...',
    duration: 0,
  });
  submitLoading.value = true;

  try {
    const res = await API_ORDER.generateOrder(orderParams);

    Toast.loading({
      forbidClick: true,
      message: '用户支付中...',
      duration: 0,
    });
    
    await payOrder(res.data.order.id);

    Toast.clear();
    submitLoading.value = false;
    router.replace({
      path: '/order/payResult',
      query: {
        orderNumber: res.data.order.id,
      },
    });
  } catch (error) {
    Toast.clear();
    submitLoading.value = false;
    console.error(error);
  }
}

/**
 * 付款方式 有且仅有一种 钱包支付T.T
 */
function payOrder(orderId: number) {
  return API_ORDER.paySuccess({ orderId, payType: unref(selectedPayType) });
}

</script>

<template>
  <return-nav-bar title="填写订单"/>
  <div class="container">
    <!-- 收货地址 -->
    <div class="section" style="margin-top: 0">
      <div v-if="addressList && addressList.length" class="address" @click="onAddressClicked">
        <div class="address-sub van-ellipsis">
          {{ formatAreaStr(addressInfo.province, addressInfo.city, addressInfo.region) }}
        </div>
        <div class="address-title van-ellipsis">{{ addressInfo.detailAddress }}</div>
        <div class="address-sub van-ellipsis">{{ addressInfo.name }} {{ mobileShow(addressInfo.phoneNumber) }}</div>
        <van-icon class="address-arrow" name="arrow" />
      </div>
      <van-cell
        v-else
        class="address-card mb10"
        title="新增收货地址"
        icon="add-square"
        is-link
        @click="onAddressClicked"
      ></van-cell>
      <van-cell title="配送方式" value="快递"></van-cell>
      <SelectAddress v-model="addressPopupShow" @select="onAddressSelected" :list="addressList"/>
    </div>
    <!-- 商品列表 -->
    <div class="section">
      <div class="section-header van-hairline--bottom">
        <van-icon class="section-header-icon" name="shop-o" />
        <span class="section-header-title">商品列表</span>
      </div>
      <div class="list" v-if="goodList && goodList.length">
        <div v-for="goodInfo in goodList" :key="goodInfo.id" class="good-card">
          <GoodCard :goodInfo="goodInfo" />
        </div>
      </div>
      <div class="subtotal">
        <span class="subtotal-num">共{{ goodList.length }}件</span>
      </div>
    </div>
    <div class="section">
      <div class="section-header van-hairline--bottom">
        <span class="section-header-title">付款金额</span>
      </div>
      <van-cell title="商品金额" center>
        <template #value> 
          <span class="subtotal-price-symbol">¥</span>
          <span class="subtotal-price-integer">{{ decimalFormat(calcAmount.totalAmount) }}</span>
        </template>
      </van-cell>
      <van-cell title="运费" center>
        <template #value> 
          <span class="subtotal-price-symbol">¥</span>
          <span class="subtotal-price-integer">{{ decimalFormat(calcAmount.freightAmount)}}</span>
        </template>
      </van-cell>
      <van-cell title="活动优惠" v-if="calcAmount.promotionAmount != 0" center>
        <template #value> 
          <span class="subtotal-price-symbol">¥</span>
          <span class="subtotal-price-integer">{{ decimalFormat(calcAmount.promotionAmount)}}</span>
        </template>
      </van-cell>
      <van-cell title="优惠券" center is-link @click="onCouponClicker">
        <template #value v-if="selectedCoupon"> 
          <span class="subtotal-price-symbol">- ¥</span>
          <span class="subtotal-price-integer">{{decimalFormat(couponAmount)}}</span>
        </template>
      </van-cell>
      <order-coupon :list="couponList" v-model:show="couponShow" v-model:selected=selectedCoupon />
      <van-cell title="积分" center is-link @click="onBalanceClicker">
        <template #value v-if="selectedBalance!=0"> 
          <span class="subtotal-price-symbol">- ¥</span>
          <span class="subtotal-price-integer">{{ decimalFormat(balanceAmount)}}</span>
        </template>
      </van-cell>
      <order-balance :total="balance" v-model:balance-show="balanceShow" :rules="balanceSetting" @success=onSelectBalance />
    </div>
    <!-- 付款方式 默认钱包支付-->
    <div class="section">
      <div class="section-header van-hairline--bottom">
        <span class="section-header-title">付款方式</span>
      </div>

      <van-cell :title="pay.name" center v-for="pay in payType" :key="pay.value">
        <template #label v-if="pay.label"> 账户余额：{{ decimalFormat(money) }} </template>
        <template #right-icon>
          <van-checkbox :model-value="pay.value === selectedPayType" @click="onPayTypeClicker(pay.value)"> </van-checkbox>
        </template>
      </van-cell>
    </div>
     <!-- 备注 -->
    <div class="section">
      <van-field
        v-model="remark"
        label="买家留言"
        type="textarea"
        placeholder="留言建议提前协商（250字以内）"
        maxlength="250"
        rows="1"
        autosize
      />
    </div>
    <!--提交订单栏 -->
    <div class="submit-bar-wrap">
      <div class="submit-bar">
        <div class="submit-bar-hd">
          <span class="submit-bar-total">应付：</span>
          <div class="submit-bar-price">
            <span class="submit-bar-price-symbol">¥</span>
            <span class="submit-bar-price-integer">{{ decimalFormat(totalAmount) }}</span>
          </div>
        </div>
        <van-button class="submit-bar-button" :loading="submitLoading" round type="primary" @click="onSubmit">
          提交订单
        </van-button>
      </div>
    </div>
  </div>
</template>

<style lang="less" scoped>
.small-size{
  font-size: 10px;
}
.section {
  box-sizing: border-box;
  position: relative;
  overflow: hidden;
  margin: 12px 10px;
  border-radius: 8px;
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
      font-size: 14px;
      font-family: @font-family-price-integer;
    }
  }
}

.submit-bar {
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
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.5);

  &-wrap {
    height: calc(50px + constant(safe-area-inset-bottom));
    height: calc(50px + env(safe-area-inset-bottom));
  }

  &-hd {
    flex: 1;
    display: flex;
    align-items: center;
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
      font-size: 15px;
      font-family: @font-family-price-integer;
    }
  }

  &-button {
    width: 110px;
    height: 40px;
  }
}

.address {
  box-sizing: border-box;
  position: relative;
  background-color: #fff;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  justify-content: center;
  height: auto;
  padding: 16px 40px 12px 12px;

  &-arrow {
    position: absolute;
    right: 12px;
    top: 0;
    bottom: 0;
    margin: auto 0;
    height: 16px;
  }

  &-title {
    font-size: 17px;
    color: var(--gray-color-8);
    font-weight: bold;
    margin: 8px 0;
  }

  &-sub {
    font-size: 13px;
    color: var(--gray-color-8);
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

.address-card {
  position: relative;
  padding: 10px 15px;
  align-items: center;
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
.address-card :deep(.van-cell__left-icon) {
  color: #1989fa;
  font-size: 40px;
}
.address-card :deep(.van-cell__title) {
  line-height: 40px;
}
</style>
