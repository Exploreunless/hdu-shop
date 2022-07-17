<script lang="ts" setup>
import type { PropType } from 'vue';
import { ref } from 'vue';
import IMAGE_LIST_EMPTY from '@/assets/images/empty/coupon.png';
import { useDebounceFn } from '@vueuse/core';

const props = defineProps({
  show: { type: Boolean },
  list: { type: Array as PropType<Recordable[]>, default: () => [] },
});

const emit = defineEmits(['update:show', 'selected']);

const popupStyle = {
  display: 'flex',
  'flex-direction': 'column',
  'align-items': 'stretch',
  'font-size': '14px',
  background: '#fff',
};

// 数据处理格式
const thresholdTitle = (val: number) => {
  let str = '';
  if (val === 0) {
    str = '满任意金额可用';
  } else {
    str = `满${val}元可用`;
  }
  return str;
}

const dateFormat = (val)=> {
  return val.slice(0, 10);
}

const formatPlatform = (platform: number)=>{
  if(platform===1){
    return '移动平台';
  }else if(platform===2){
    return 'PC平台';
  }else{
    return '全平台';
  }
}

const hasGet = ref('领取')
function onClose() {
  emit('update:show', false);
}

const onSelect = useDebounceFn((item) => {
  item.hasGet = 1;
  emit('selected', item);
}, 300);

</script>

<template>
  <van-popup
    :show="show"
    round
    closeable
    position="bottom"
    :style="popupStyle"
    @click-close-icon="onClose"
    @click-overlay="onClose"
  >
    <div class="header">优惠券</div>
    <div v-if="list.length" class="list">
      <div v-for="item in list" :key="item.id" class="list-item">
        <div class="list-item-hd">
          <div class="list-item-money">
            <span class="list-item-price">{{ item.amount }}</span>
            <span class="list-item-price-unit">元</span>
          </div>
          <div class="list-item-desc van-ellipsis">{{ thresholdTitle(item.minPoint) }}</div>
        </div>
        <div class="list-item-bd">
          <div class="list-item-bd-inner">
            <div class="list-item-bd-title van-ellipsis">{{ item.name }}</div>
            <div class="list-item-bd-txt">{{ formatPlatform(item.platform) }}</div>
            <div class="list-item-bd-txt">{{ dateFormat(item.startTime) }}至{{ dateFormat(item.endTime) }}</div>
          </div>
          <div class="list-item-bd-action" >
            <van-button v-if="!item.hasGet" class="list-item-btn" @click="onSelect(item)">领取</van-button>
            <van-button v-else class="list-item-btn" >已领取</van-button>
          </div>
        </div>
      </div>
      
    </div>
    <van-empty v-else class="empty" :image="IMAGE_LIST_EMPTY" description="暂无优惠券">
    </van-empty>
  </van-popup>
</template>

<style lang="less" scoped>

.header {
    box-sizing: border-box;
    text-align: center;
    padding: 0 15px;
    width: 100%;
    font-size: 16px;
    font-weight: bold;
    color: var(--gray-color-8);
    height: 50px;
    line-height: 50px;
  }
.list-item {
  box-sizing: border-box;
  height: 80px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  border-radius: 8px;
  overflow: hidden;
  margin-bottom: 30px;
  margin-left: 15px;
  margin-right: 15px;
  background: var(--white);
  box-shadow: 0px 2px 4px 2px rgba(228, 228, 228, 0.5);

  &-hd {
    box-sizing: border-box;
    width: 34%;
    text-align: center;
    height: 100%;
    padding: 20px 0;
    font-size: 12px;
    color: var(--white);
    background: linear-gradient(300deg, rgb(250, 122, 122), rgb(254, 49, 78)) ;
  }

  &-money {
    margin-bottom: 5px;
  }

  &-price {
    font-size: 30px;
    font-weight: bold;

    &-unit {
      margin-left: 5px;
      font-size: 12px;
    }
  }

  &-bd {
    flex: 1;
    display: flex;
    justify-content: space-around;
    align-items: center;
    padding: 20px 0;

    &-title {
      font-size: 16px;
      color: var(--gray-color-8);
      margin-bottom: 10px;
    }

    &-txt {
      font-size: 12px;
      color: var(--gray-color-6);
    }

    &-action {
      font-size: 10px;
      color: var(--red-color);
      // border: 1px solid var(--red-color);
      border-radius: 15px;
      padding: 5px 10px;
    }
  }
  &-btn{
    box-sizing: border-box;
    height: 30px;
    padding: 10px;
    border-radius: 5px;
    // background-color: var(--brand-color);
  }
}
</style>
