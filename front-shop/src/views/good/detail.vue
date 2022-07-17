<script setup lang="ts">
import { onMounted, ref, computed, unref, onUnmounted } from 'vue';
import axios from 'axios';
import {Toast, Dialog} from 'vant';
import {useRoute, useRouter} from 'vue-router'
import ReturnNavBar from '@/components/ReturnNavBar/index.vue';
import Sku from '@/components/Sku/index.vue';
import Plate from '@/components/Plate/index.vue';
import Brand from '@/views/good/brand.vue';
import {isFixedData} from '@/constants';
import API_GOOD from '@/apis/good';
import API_CART from '@/apis/cart';
import API_COUPON from '@/apis/coupon';
import API_COLLECT from '@/apis/collect';
import API_HISTORY from '@/apis/history';
import {useUserStore} from '@/store/modules/user';
import couponBox from './coupon.vue';
import {dateDiff} from '@/utils/date';
import countDown from '@/components/CountDown/index.vue';


const route = useRoute();
const router = useRouter();
const userStore = useUserStore();

onMounted(()=>{
  getGoodsDetail();
  getCollection();
  addHistory();
});

onUnmounted(()=>{
  clearTimeout(time.value);
})

function fetchGoodList(){
  return axios.get('/src/views/good/data.json').then((response)=>response.data);
} 

const productId = computed(()=>{
  return Number(route.query.id);
})

function getGoodsDetail() {
  const api = isFixedData ? fetchGoodList() : API_GOOD.umsGetGoodDetail(unref(productId));
  api.then((response)=>{
    const res = response.data;
    product.value = res['product'];
    brand.value = res['brand'];
    productAttributeList.value = res['productAttributeList'];
    productAttributeValueList.value = res['productAttributeValueList'];
    skuStockList.value = res['skuStockList'];
    couponList.value = res['couponList'];

    // 商品已下架
    if (unref(product).publishStatus === 0) {
      Toast('商品已下架');
      return;
    }
    // 商品库存为0
    if (unref(product).stock === 0) {
      Dialog.confirm({
        title: '提示',
        message: '该商品已售罄,去看看其他商品吧！',
        showCancelButton: false,
      }).then(() => {
        // on confirm
        router.replace({ path: '/home' });
      });
      return;
    }
  })
}

// 商品
const product = ref();
const picList = computed(()=>{
  return product.value ? [product.value['pic'], ...product.value['albumPics'].split(',')]: []
})
// 服务弹出层
const serviceShow = ref(false);
const showServicePopup = ()=>{
  serviceShow.value = true;
}
// 商品参数弹出层
const attrShow = ref(false);
const showAttrPopup = ()=>{
  attrShow.value = true;
}

// 品牌
const brand = ref();

// 商品属性
const productAttributeList = ref();

// 秒杀
const isPromotion = computed(()=>{
  if(!product.value || !product.value.promotionStartTime || !product.value.promotionEndTime)
    return false;
  console.log(dateDiff(product.value.promotionStartTime))
  return dateDiff(product.value.promotionStartTime)==='0' && dateDiff(product.value.promotionEndTime) !== '0';
})

const restTime = (time)=>{
  if(time==null||time===''){
    return '0';
  }
  return dateDiff(time)
}

// 商品属性值
const productAttributeValueList = ref();

// 库存
const skuStockList = ref();
const hasSku = computed(() =>skuStockList.value && !!skuStockList.value.length);

// 点击加入购物车或者立即购买或者选择
const skuNextActionType = ref('goBuy');
const skuShow = ref(false);
function onSkuShow(type: string) {
  skuNextActionType.value = type;
  skuShow.value = true;
}

const initialSku = ref({selectedAttr: {}, selectedNum: 1});
const selectedSku = ref<Recordable>();
const selectedSkuAttr = computed(()=>{
  if(!unref(hasSku)) return '';
  return selectedSku.value ? JSON.parse(selectedSku.value.spData).map(item=>item.value).join('/'):'选择';
})

function onSkuConfirm(data: Recordable){
  const {sku} = data;
  selectedSku.value = sku;
  if(skuNextActionType.value !== 'select'){
    addCartOrBuy()
  }
}

// 加入购物车，购买
function addCartOrBuy(){
  const cartItem = {
    "createDate": "",
    "deleteStatus": unref(product).deleteStatus,
    "id": unref(product).id,
    "memberId": userStore.getUserInfo.id,
    "memberNickname": userStore.getUserInfo.username,
    "modifyDate": "",
    "price": unref(selectedSku).price,
    "productAttr": unref(selectedSku)?.spData || null,
    "productBrand": unref(selectedSku).brandName,
    "productCategoryId": unref(product).productCategoryId,
    "productId": unref(product).id,
    "productName": unref(product).name,
    "productPic": unref(product).pic,
    "productSkuCode": unref(selectedSku)?.skuCode ?? null,
    "productSkuId": unref(selectedSku)?.id ?? null,
    "productSn": unref(product).productSn,
    "productSubTitle": unref(product).subTitle,
    "quantity": unref(initialSku).selectedNum
  }
  if(skuNextActionType.value === 'addCart'){
    API_CART.addCart(cartItem)
      .then((res) => {
        if(res.code === 200){
          Toast('已成功加入购物车');
        }else{
          Toast('加入失败');
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }else{
    Toast('暂无API');
  }
}

// 优惠券
const couponList = ref();
const couponShow = ref(false);
function showCouponPopup(){
  couponShow.value = true;
}
function addCoupon(coupon: Recordable){
  const {id} = coupon;
  console.log(coupon)
  API_COUPON.umsGetCoupon(id)
    .then(() => {
      Toast('领取成功');
    })
    .catch((error) => {
      console.error(error);
    });
}

// 购物车标签栏
const onConcatService = ()=>{
  Toast('未开放：客服');
}

const collectList = ref([]);
// 收藏
const isCollect = computed(()=>{
  const good = collectList.value.find((item)=>(item.productId == unref(productId)));
  return good?true:false;
});

function getCollection(){
  const jsonFetch = () => 
    axios.get('/src/views/collect/data.json')
    .then(response=>{
      return response.data;
    });
  
  const api = isFixedData ? jsonFetch() : API_COLLECT.fetchCollection();
  api.then((res)=>{
    collectList.value = res.data?.list ?? [];
  }).catch((error)=>{
    console.log(error);
  });
}
function onCollect(){
  if(isCollect.value){
    API_COLLECT.deleteCollection(unref(productId))
    .then(()=>{
      Toast('已取消收藏');
      getCollection();
    }).catch((error)=>{
      console.log(error);
    });
  }else{
    const productCollection = {
      "createTime": "",
      "id": "",
      "memberIcon": "",
      "memberId": 0,
      "memberNickname": "",
      "productId": unref(product).id,
      "productName": unref(product).name,
      "productPic": unref(product).pic,
      "productPrice": unref(product).price,
      "productSubTitle": unref(product).subTitle
    }
    API_COLLECT.addCollection(productCollection)
    .then(()=>{
      getCollection();
      Toast('已收藏');
    }).catch((error)=>{
      console.log(error);
    });
  }
}

// 浏览历史
const time = ref();

function addHistory(){
  time.value = setTimeout(()=>{
    const memberReadHistory = {
      "createTime": "",
      "id": "",
      "memberIcon": "",
      "memberId": 0,
      "memberNickname": "",
      "productId": unref(product).id,
      "productName": unref(product).name,
      "productPic": unref(product).pic,
      "productPrice": unref(product).price,
      "productSubTitle": unref(product).subTitle
    }
    API_HISTORY.addHistory(memberReadHistory)
    .then(()=>{
    }).catch((error)=>{
      console.log(error);
    });
    // console.log('1111')
  }, 15000);
}

</script>

<template>
<div class="container">
  <ReturnNavBar title="商品信息" />
  <van-swipe :autoplay="5000" class="swiper">
    <van-swipe-item v-for="(pic, index) in picList" :key="index" class="swiper-item">
      <van-image class="swiper-item-img" fit="contain" :src="pic" alt="" />
    </van-swipe-item>
    <template #indicator="{ active, total }">
    <div class="custom-indicator">{{ active + 1 }}/{{ total }}</div>
  </template>
  </van-swipe>
  <section class="section" v-if="!!product">
    <div class="list-item-price">
      <!-- 商品价格 -->
      <div class="price" >
        <div class="price-current" v-if="!isPromotion">
          <span class="price-current-symbol">¥</span>
          <span class="price-current-integer">{{ product.price }}</span>
        </div>
        <div class="price-current" v-else >
          <span class="price-current-symbol">¥</span>
          <span class="price-current-integer">{{ product.promotionPrice }}</span>
        </div>
        <div v-if="product.originalPrice > product.price" class="price-origin">
          <span class="price-origin-symbol">¥</span>
          <span class="price-origin-integer">{{ product.originalPrice }}</span>
        </div>
        <div class="price-current-promotion" v-if="isPromotion"> 
          <van-tag type="danger" round>该商品正在秒杀中</van-tag>
          &nbsp;&nbsp;
          <count-down :time="restTime(product.promotionEndTime)"></count-down>
        </div>
      </div>
    </div>
    <!-- 商品名称 -->
    <div class="desc">
      <div class="desc-hd">
        <div class="desc-title van-multi-ellipsis--l2">{{ product.name }}</div>
        <div v-if="product.subTitle" class="desc-brief">
          {{ product.subTitle }}
        </div>
      </div>
    </div>
    <!-- 剩余量 -->
    <div class="stock">
      <div class="stock-item">
         月售 {{product.sale}} 
      </div>
      <div class="stock-item">剩余 {{ product.stock }}</div>
    </div>
    <div class="product-info">
      <!-- 优惠券 -->
      <van-cell is-link @click="showCouponPopup" class="cell first-cell">
        <template #title>
          优惠券
        </template>
      </van-cell>
      <coupon-box v-model:show="couponShow" @selected="addCoupon" :list="couponList" />
      <!-- 服务 -->
      <van-cell is-link @click="showServicePopup" class="cell">
        <template #title>
          服务说明
        </template>
        <template #value>
          <span class="service-info">
            <van-icon name="passed" />无忧退货
            <van-icon name="passed" />快速退款
            <van-icon name="passed" />免费包邮
          </span>
        </template>
      </van-cell>
      <van-popup v-model:show="serviceShow" 
        :style="{ height: '40%' }" 
        position="bottom"
        closeable
        close-icon="close">
        <div class="service-list">
          <div class="service-list-item">
            <div class="title">
              <van-icon name="info-o" />
              30天无忧退货
            </div>
            <div class="info">
              自收到商品之日起30天内，可在线申请无忧退货服务（内裤、食品等特殊商品除外）。
            </div>
          </div>
          <div class="service-list-item">
            <div class="title">
              <van-icon name="info-o" />
              48小时快速退款
            </div>
            <div class="info">
              收到退货包裹并确认无误后，将在48小时内办理退款，退款将原路返回，不同银行处理时间不同，预计1-5个工作日到账。
            </div>
          </div>
          <div class="service-list-item">
            <div class="title">
              <van-icon name="info-o" />
              满88元免邮费
            </div>
            <div class="info">
              单笔订单金额(不含运费)满88元可免邮费，不满88元，单笔订单收取10元邮费。
            </div>
          </div>
        </div>
      </van-popup>
      <!-- 商品参数 -->
      <van-cell is-link @click="showAttrPopup" class="cell">
        <template #title>
          商品参数
        </template>
        <template #value>
          <span class="service-info">
            查看
          </span>
        </template>
      </van-cell>
      <van-popup v-model:show="attrShow" 
        position="bottom"
        closeable
        close-icon="close">
        <div class="attr-list">
          <van-row class="attr-list-item">
            <van-col class="item-key" span="8"> 商品编号</van-col>
            <van-col class="item-value" span="16"> {{product.productSn}}</van-col>
          </van-row>
          <van-row v-for="item in productAttributeList" :key="item.id" class="attr-list-item">
            <van-col class="item-key" span="8"> {{item.name}}</van-col>
            <van-col class="item-value" span="16"> {{item.inputList}}</van-col>
          </van-row>
        </div>
      </van-popup>
      <!-- 选择规格 -->
      <van-cell is-link @click="onSkuShow('select')" class="cell last-cell">
        <template #title>
          选择规格
        </template>
        <template #value>
          <span class="service-info">
            {{selectedSkuAttr}}
          </span>
        </template>
      </van-cell>
      <Sku v-model:show="skuShow" :sku="skuStockList" :good-info="product" :initial-sku="initialSku"
      @confirm="onSkuConfirm" />

    </div>
    <Plate title="商品详情" class="mt10" />
    <div class="goods-content" v-html="product.detailHtml"></div>
    <Plate title="品牌信息" class="mt10" />
    <brand :brand-info="brand"></brand>
    <div class="action-bar-perch"></div>
  </section>
  <!-- 商品导航栏 -->
  <van-action-bar>
    <van-action-bar-icon icon="chat-o" text="客服" @click="onConcatService" />
    <van-action-bar-icon icon="cart-o" text="购物车" to="/cart" replace />
    <van-action-bar-icon icon="star" @click="onCollect" :text="isCollect?'已收藏':'收藏'" :color="isCollect?'#ff5000':'#ddd'" />
    <van-action-bar-button type="warning" text="加入购物车" @click="onSkuShow('addCart')" />
    <van-action-bar-button type="danger" text="立即购买" @click="onSkuShow('goBuy')" />
  </van-action-bar>
</div>
</template>


<style lang="less" scoped>

.swiper {
  width: 100%;
  height: 375px;
  // border-bottom: solid 1px #ddd;
  box-shadow: 0 1px 5px rgba(0, 0, 0, 0.1);
  // margin-bottom: 10px;

  &-item,
  &-item-img {
    width: 100%;
    height: 100%;
  }
   .custom-indicator {
    position: absolute;
    right: 5px;
    bottom: 5px;
    padding: 2px 5px;
    font-size: 12px;
    color: grey;
    background: rgba(0, 0, 0, 0.1);
  }
}
.section {
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  padding: 0 15px 10px;
  background: #fff;
}

 .list-item-price {
    margin-top: 12px;
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.price {
  display: flex;
  align-items: center;

  &-current {
    margin-right: 5px;
    color: var(--brand-color);

    &-symbol {
      font-size: 14px;
      margin-right: 2px;
    }

    &-integer {
      font-size: 20px;
      font-family: @font-family-price-integer;
    }

    &-promotion{
      margin-left: 10px;
      font-size: 14px;
      color: red;
      display: flex;
      justify-content: space-between;

    }
  }

  &-origin {
    font-size: 14px;
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
.desc {
  margin-top: 10px;

  &-title {
    font-size: 16px;
    line-height: 20px;
  }

  &-brief {
    margin-top: 4px;
    color: var(--gray-color-6);
    font-size: 12px;
    word-break: break-all;
  }
}

.stock {
  box-sizing: border-box;
  width: 100%;
  display: flex;
  justify-content: space-between;
  padding: 10px 0;
  background: #fff;
  // margin-bottom: 10px;

  &-item {
    flex: 1;
    font-size: 12px;
    color: var(--gray-color-6);

    &:last-child {
      text-align: right;
    }
  }
}

.cell{
  padding: 10px 0;
}

.first-cell {
  border-top: 1px solid var(--van-cell-border-color);
}
.last-cell {
  border-bottom: 1px solid var(--van-cell-border-color);
}
.service-info{
  overflow: hidden;
  white-space: nowrap;
  font-size: 12px;
}
.service-list{
  padding: 15px 20px;
  margin-top: 15px;
  display: flex;
  flex-direction: column;
  // justify-content: space-between;
  height: 90%;
  &-item{
    padding: 5px;
    color: #666;
  }
  .title{
    font-size: 14px;
  }
  .info{
    font-size: 13px;
  }
}

.attr-list{
  padding: 15px 20px;
  margin-top: 20px;
  margin-bottom: 10px;
  &-item{
    padding: 5px 15px;
    border-bottom: 1px solid var(--van-cell-border-color);
    .item-key{
      color: #666;
      line-height: 20px;
      font-size: 15px;
    }
    .item-value{
      color: #666;
      line-height: 20px;
      font-size: 14px;
    }
  }

}


.goods-content {
  box-sizing: border-box;
  background: #fff;
  padding: 0 10px;
  padding-top: 10px;
  overflow: hidden;
  color: var(--color-gray-8);
  font-size: 16px;
  line-height: 1.5;
  text-align: left;
  word-wrap: break-word;

  :deep(i)mg {
    display: block;
    max-width: 100% !important;
    height: auto !important;
  }

  :deep(p) {
    margin: 0;
    padding: 0;
  }
}

.action-bar-perch {
  height: calc(50px + constant(safe-area-inset-bottom));
  height: calc(50px + env(safe-area-inset-bottom));
}
</style>