<script lang="ts" setup>
import { onMounted, ref, unref, computed } from 'vue';
import { useRouter } from 'vue-router';

import API_USER from '@/apis/user';
import AddressList from '@/components/AddressList/index.vue';

const props = defineProps({
  modelValue: Boolean,
  list: {default: []}
});

const emit = defineEmits(['update:modelValue', 'select']);

const router = useRouter();

const popupStyle = {
  display: 'flex',
  'flex-direction': 'column',
  'align-items': 'stretch',
  'max-height': '80%',
  'min-height': '50%',
  'overflow-y': 'visible',
  'font-size': '14px',
  background: '#fff',
};

const addressId = ref('');

const addressList = computed(()=>{
  return props.list.map((item)=>({
    'id': item['id'],
    'name': item['name'],
    'tel': item['phoneNumber'],
    'isDefault': !!(item['defaultStatus']),
    'address': item['province'] + item['city'] + item['region'] + item['detailAddress']
  }));;//api 获取
})

function onClose() {
  emit('update:modelValue', false);
}

function onSelect(item: Recordable, index: number) {
  emit('select', props.list[index]);
  onClose();
}

function onAdd() {
  router.push({ path: '/address/edit' })
}

function onEdit(item: Recordable) {
  router.push({path: '/address/edit', query: {'id': item['id']}})
}
</script>

<template>
  <van-popup
    :show="modelValue"
    round
    closeable
    position="bottom"
    :style="popupStyle"
    @click-close-icon="onClose"
    @click-overlay="onClose"
  >
    <div class="address-header">选择收货地址</div>
    <div class="address-body">
      <van-address-list
        v-model="addressId"
        :list="addressList"
        default-tag-text="默认"
        @add="onAdd"
        @edit="onEdit"
        @select="onSelect"
      />
    </div>
    <!-- <div class="address-actions">
      <van-button type="primary" round block @click="onSubmit">新增地址</van-button>
    </div> -->
  </van-popup>
</template>

<style lang="less" scoped>
.address {
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
    min-height: 40vh;
    max-height: 80vh;
    overflow-y: auto;
    background: var(--gray-color-1);
    overflow-y: scroll;
    -webkit-overflow-scrolling: touch;
  }

  &-list {
    margin: 12px 12px 80px;
  }

  &-actions {
    box-sizing: border-box;
    display: flex;
    padding: 8px 15px;
    width: 100%;
  }
}
</style>
