<script lang="ts" setup>
import type { PropType } from 'vue';
import {ref} from 'vue';

defineProps({
  balanceShow: { type: Boolean },
  total: { type: Number, default: 0 },
  rules: { type: Object as PropType<Recordable>, default: ()=>({} as Recordable) }
});

const emit = defineEmits(['update:balanceShow', 'success']);

const popupStyle = {
  display: 'flex',
  'flex-direction': 'column',
  'align-items': 'stretch',
  'font-size': '14px',
  background: '#fff',
};

const balanceValue = ref(100);
function onClose() {
  emit('update:balanceShow', false);
}

function onSelect(){
  emit('success', Number(balanceValue.value));
  emit('update:balanceShow', false);
}

</script>

<template>
  <van-popup
    :show="balanceShow"
    round
    closeable
    position="bottom"
    :style="popupStyle"
    @click-close-icon="onClose"
    @click-overlay="onClose"
  >
    <div class="header">积分</div>
    <div class="list-item">
      <div class="list-item-balance">
        <span class="list-item-balance-label">积分兑换:</span>
        <van-stepper v-model="balanceValue" theme="round" button-size="20" class="list-item-balance-step"
          :step="rules.deductionPerAmount" :min="0" :max="total"/>
        <span class="list-item-balance-tip">(每{{rules.deductionPerAmount}}兑换1元)</span>
      </div>
      <span class="list-item-total">可用积分：{{total}}</span>
      <van-button class="list-item-btn" @click="onSelect">确定</van-button>
    </div>
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

.list-item{
  padding: 0 15px;
  margin: 0 auto;
  min-height: 10vh;
  max-height: 20vh;
  width: 80%;
  display: flex;
  flex-direction: column;
  align-items: center;

  &-balance{
    font-size: 15px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    &-label{
      margin-right: 10px;
    }

    &-tip{
      margin-left: 5px;
      font-size: 12px;
      color: var(--gray-color-6)
    }
  }

  &-total{
    font-size: 13px;
    color: var(--gray-color-6);
    align-self: center;
    margin: 10px 0;
  }

  &-btn{
    box-sizing: border-box;
    height: 30px;
    padding: 10px;
    width: 100%;
    border-radius: 5px;
    background-color: var(--brand-color);
    margin-bottom: 20px;
  }
}

</style>
