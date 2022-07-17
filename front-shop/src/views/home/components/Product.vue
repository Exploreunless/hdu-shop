<template>
<div class="list-tap">
  <div class="list-tap-left">{{typeProduct[ptype]}}</div>
  <div class="list-tap-right" @click="onMoreClicked">
    <span class="tap-span">更多推荐</span>
    <van-icon name="upgrade" class="tap-grade" />
  </div>
</div>
<div class="list">
  <div class="list-col" v-for="item in productList" :key="item.id">
    <good-card :good="item" :ptype="ptype"></good-card>
  </div>
</div>
</template>

<script setup lang="ts">
import goodCard from '@/components/GoodCard/index.vue';
import { reactive, unref } from 'vue';
import {useRouter} from 'vue-router'

const router = useRouter();
const typeProduct = reactive({
  'hot': '人气推荐',
  'new': '新鲜好物'
})
const props = withDefaults(
  defineProps<{ productList?: any, ptype: string }>(),{
      productList: [],
      ptype: '',
  }
);

// const props = defineProps({
//   productList: {
//     // type: Array,
//     default: {}
//   },
//   ptype: {
//     type: String,
//     default: ''
//   },
//   aa: {
//     default: []
//   }
// })
const {ptype} = unref(props);

// const productList = ref(props.productList);
// const ptype = ref(props.ptype);

const onMoreClicked = ()=>{
  if(ptype === 'hot'){
    router.push({path: '/good/more', query:{ptype}})
    
  }else if(ptype === 'new'){
    router.push({path: '/good/more', query:{ptype}})
  }else{
    console.log('不存在')
  }
}

</script>

<style lang="less" scoped>
.list-tap{
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 5px 15px;
  background-color: var(--gray-color-2);

  &-left{
    font-size: 15px;
    color: var(--gray-color-8);
  }
  &-right{
    font-size: 12px;
    color: var(--gray-color-6);
    .tap-grade{
      margin-left: 5px;
      transform: rotate(90deg);
    }
  }
}

.list {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  // padding: 0 5px;

  :deep(.van-list__loading),
  :deep(.van-list__finished-text),
  :deep(.van-list__error-text) {
    width: 100%;
  }

  &-col {
    width: 50%;
    box-sizing: border-box;

    // padding-left: 5px;
    // padding-right: 5px;
    // margin-bottom: 10px;
  }
}
</style>
