<script lang="ts" setup>
import type { PropType } from 'vue';
import { ref, unref } from 'vue';
import { Toast } from 'vant';

const props = defineProps({
  show: { type: Boolean },
});

const popupStyle = {
  display: 'flex',
  'flex-direction': 'column',
  'align-items': 'stretch',
  'font-size': '14px',
  background: '#fff',
};
const rateValue = ref(5);
const rateRemark = ref('');

const emit = defineEmits(['update:show', 'success']);

function onClose() {
  handleShowChange(false);
}

// function onOpen() {
//   handleShowChange(true);
// }

function handleShowChange(v: boolean) {
  emit('update:show', v);
}

function onSubmit() {
  Toast.loading({
    overlay: true,
    message: '加载中...',
    duration: 0,
  });

  Toast({ message: '评价成功!', duration: 1500 });
  onClose();
  emit('success');
   
}
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
    <div class="rate-header">发表评价</div>
    <div class="rate-body">
      <van-cell title="请选择您的评分" :border="false"></van-cell>
      <div class="rate-box">
        <van-rate v-model="rateValue" :size="24" :gutter="8" />
      </div>
      <van-field
        v-model="rateRemark"
        :border="false"
        label="备注"
        type="textarea"
        placeholder="非常愉快的一次购物！"
        maxlength="200"
        rows="1"
        autosize
      />
    </div>
    <div class="rate-actions">
      <van-button type="primary" round block @click="onSubmit">提交评价</van-button>
    </div>
  </van-popup>
</template>

<style lang="less" scoped>
.rate {
  &-header {
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

  &-bottom {
    width: 100%;
  }

  &-box {
    padding: 0px 15px;
    margin-bottom: 10px;
    // margin-left: 25%;
  }

  &-actions {
    box-sizing: border-box;
    display: flex;
    padding: 8px 15px;
    width: 100%;
  }
}
</style>
