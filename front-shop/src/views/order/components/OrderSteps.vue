<script lang="ts" setup>
import type { PropType } from 'vue';
import {computed} from 'vue'

const props = defineProps({
  show: { type: Boolean },
  list: { type: Array as PropType<Recordable[]>, default: () => [] },
});

const logList = computed(()=>{
  return props.list.filter((item)=>{
    return item?.dateAdd;
  })
})
// const active = ref(0);
const emit = defineEmits(['update:show', 'success']);

const popupStyle = {
  display: 'flex',
  'flex-direction': 'column',
  'align-items': 'stretch',
  'font-size': '14px',
  background: '#fff',
};

function onClose() {
  handleShowChange(false);
}

// function onOpen() {
//   handleShowChange(true);
// }

function handleShowChange(v: boolean) {
  emit('update:show', v);
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
    <div class="steps-header">订单跟踪</div>
    <div class="steps-body">
      <van-steps direction="vertical" :active="logList.length - 1">
        <van-step v-for="(item, index) in logList" :key="index">
          <div class="steps-item-label">{{ item.typeStr }}</div>
          <div class="steps-item-time">{{ item.dateAdd }}</div>
        </van-step>
      </van-steps>
    </div>
  </van-popup>
</template>

<style lang="less" scoped>
.steps {
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

  &-body {
    max-height: 80vh;

    :deep(.van-step__title) {
      color: var(--gray-color-6);
    }

    :deep(.van-step__title--active) {
      color: var(--green-color);
    }
  }
}
</style>
