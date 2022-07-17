<script setup lang="ts">
import { computed, unref, reactive } from 'vue';
import type { PropType } from 'vue';
import { GoodInfo, ISku, ISelectedSkuComb, KeyValue, IInitialSku } from './typings';
import {Toast} from 'vant'

const props = defineProps({
  show: { type: Boolean, default: false },
  sku: { type: Array as PropType<ISku>, default: () => ([]) },
  initialSku: { type: Object as PropType<IInitialSku>, default: () => ({}) },
  goodInfo: { type: Object as PropType<GoodInfo>, default: () => ({}) }
});

// // 选中的规格数据
// const initialSku = reactive({
//   selectedNum: 1,
//   selectedAttr: {
//     // '颜色': '金色'
//   }
// })
const emit = defineEmits(['update:show', 'confirm']);

// 关闭弹窗
function onClose() {
  handleShowChange(false);
}

const hasSku = computed(() => !!props.sku.length);
// 规格
const skuAttrList = computed(() => {
  if(unref(hasSku)){
    let sk = props.sku[0];
    let spData: Array<KeyValue> = JSON.parse(sk['spData']);
    return spData.map((item)=>item['key'])
  }
  return []
});

// 规格展示数据
const skuAttrValueObj = computed(() => {
  const obj = {};
  props.sku.forEach((item)=>{
    let spData: Array<KeyValue> = JSON.parse(item['spData']);
    if(spData!= null && spData.length>=1){
      spData.forEach((spItem)=>{
        if(!obj.hasOwnProperty(spItem['key'])){
          obj[spItem['key']] = [spItem['value']]
        }else if(!obj[spItem['key']].includes(spItem['value'])){
          obj[spItem['key']].push(spItem['value'])
        }
      });
    }
  })
  return obj;
})

// 不同规格产品数据映射表
const skuProductMap = computed(()=>{
  let obj = {};
  props.sku.forEach((item, i)=>{
    let spData:Array<KeyValue> = JSON.parse(item['spData']);
    let attrId = ``;
    for(let key of unref(skuAttrList)){
      let value = spData.find((item)=>(item['key'] === key))['value'];
      attrId += `${key}:${value}`;
    }
    obj[attrId] = i;
  })
  return obj;
})

// 点击规格按钮
const onAttrClicked = (k:string, v:string)=>{
  let s = undefined;
  if(!props.initialSku.selectedAttr[k] || props.initialSku.selectedAttr[k] !== v){
    s = v;
  }
  props.initialSku.selectedAttr[k] = s;
}
function handleShowChange(v: boolean) {
  emit('update:show', v);
}
// 根据选中的规格去寻找该商品数据
const skuValue = computed((): Recordable | undefined => {
  if (unref(hasSku)) {
    let attrId = ``;
    for(let key of unref(skuAttrList)){
      if(!props.initialSku.selectedAttr[key])
        return undefined;
      attrId += `${key}:${props.initialSku.selectedAttr[key]}`
    }
    return props.sku[unref(skuProductMap)[attrId]];
  }
  return undefined;
});

// 选择商品参数
const selectedPropTitle = computed(() => {
  if (unref(hasSku)) {
    const { selectedAttr } = props.initialSku;
    let keys = unref(skuAttrList)
    return unref(skuValue)
      ? `已选 ${keys.reduce((acc, cur) => `${acc} ${selectedAttr[cur]}`, '')}`
      : `请选择 ${keys.reduce(
          (acc, cur) => `${acc}${!selectedAttr[cur] ? cur : ''}`,
          '',
        )}`;
  } else {
    return '';
  }
});

// 商品价格，库存
const selectedSkuComb = computed((): ISelectedSkuComb => {
  if (unref(hasSku) && unref(skuValue)) {
    return {
      price: unref(skuValue)?.price,
      pic: unref(skuValue)?.pic || props.goodInfo.pic,
      stock: unref(skuValue)?.stock,
    };
    } else {
    return {
      price: props.goodInfo.price,
      pic: props.goodInfo.pic,
      stock: props.goodInfo.stock,
    };
    
  } 
});

// 提交
function onSubmit() {
  if (props.initialSku.selectedNum > unref(selectedSkuComb).stock) {
    Toast({
      message: '库存不足',
      duration: 1500,
    });
    return;
  }

  if (unref(hasSku) && !unref(skuValue)) {
    Toast({
      message: '请选择商品规格',
      duration: 1500,
    });
    return;
  }

  const data = {
    sku: (unref(hasSku) ? unref(skuValue) : unref(props.goodInfo))
  };

  props.initialSku.selectedNum && (data['num'] = props.initialSku.selectedNum );

  emit('confirm', data);
  emit('update:show', false);
}
</script>

<template>
 <van-popup
    :show="show"
    round
    closeable
    position="bottom"
    class="popupStyle"
    @click-close-icon="onClose"
    @click-overlay="onClose"
  >
  <div class="sku-header van-hairline--bottom">
    <van-image class="sku-header-pic" :src="selectedSkuComb.pic" fit="cover" />
    <div class="sku-header-good-info">
      <div class="sku-header-good-name van-multi-ellipsis--l2">{{ goodInfo.name }}</div>
      <div class="sku-header-good-info-bd">
        <div class="sku-header-good-price">
          <span class="sku-header-good-price-symbol">¥</span>
          <span class="sku-header-good-price-integer">
            {{ selectedSkuComb.price }}
          </span>
        </div>
        <div class="sku-header-item">
          剩余 <span class="sku-header-good-stock-num">{{ selectedSkuComb.stock }}</span>
          {{ goodInfo.unit || '件' }}
        </div>
        <div v-if="selectedPropTitle" class="sku-header-item">{{ selectedPropTitle }}</div>
      </div>
    </div>
  </div>
    <div class="sku-body">
      <div v-for="(value, key) in skuAttrValueObj" :key="key" class="sku-group van-hairline--bottom">
        <div class="sku-group-hd">
          {{ key }}
        </div>
        <div v-if="value" class="sku-group-list">
          <div
            v-for="(v, i) in value"
            :key="i"
            :class="['sku-group-list-item', initialSku.selectedAttr[key] === v ? 'active' : '']"
            @click="onAttrClicked(key, v)"
          >
            <span class="sku-group-list-item-name">{{ v }}</span>
          </div>
        </div>
      </div>
      <div class="sku-num" v-if="initialSku.selectedNum">
        <div class="sku-num-title">购买数量</div>
        <!-- eslint-disable-next-line vue/no-mutating-props -->
        <van-stepper v-model="initialSku.selectedNum" class="sku-num-stepper" />
      </div>
    </div>
    <div class="sku-actions">
      <van-button type="primary" round block @click="onSubmit">确定</van-button>
    </div>
 </van-popup>

</template>

<style lang="less" scoped>
.popupStyle{
  display: flex;
  flex-direction: column;
  align-items: stretch;
  max-height: 80%;
  min-height: 50%;
  overflow-y: visible;
  font-size: 14px;
  background: #fff;
};

.sku {
  &-header {
    margin: 0 15px;
    display: flex;

    &-pic {
      width: 96px;
      height: 96px;
      margin: 10px 10px 10px 0;
      overflow: hidden;
      border-radius: 4px;
    }

    &-good-info {
      flex: 1;
      min-width: 0;
      display: flex;
      flex-direction: column;
      justify-content: flex-end;
      padding: 10px 20px 10px 0;
    }

    &-good-name {
      margin-bottom: 5px;
      flex: 1;
    }

    &-good-price {
      margin-left: -2px;
      color: var(--brand-color);
      line-height: 1.15;

      &-symbol {
        margin-right: 2px;
        line-height: 18px;
      }

      &-integer {
        font-weight: bold;
        font-size: 22px;
        font-family: @font-family-price-integer;
      }
    }

    &-item {
      margin-top: 5px;
      color: var(--gray-color-6);
      font-size: 12px;
      line-height: 16px;
    }
  }

  &-body {
    flex: 1 1 auto;
    min-height: 44px;
    overflow-y: scroll;
    -webkit-overflow-scrolling: touch;
  }

  &-group {
    padding-top: 10px;
    margin: 0 15px 10px;
    font-size: 14px;
    color: var(--gray-color-8);

    &-hd {
      padding-bottom: 12px;
      font-size: 16px;
    }
    &-list {
      display: flex;
      align-items: center;
      flex-wrap: wrap;

      &-item {
        position: relative;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        min-width: 40px;
        margin: 0 10px 10px 0;
        font-size: 12px;
        line-height: 16px;
        overflow: hidden;
        color: var(--gray-color-8);
        border-radius: 4px;

        &::before {
          position: absolute;
          content: '';
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: var(--gray-color-1);
        }

        &-name {
          padding: 8px;
          z-index: 1;
        }

        &.active {
          color: var(--brand-color);
        }

        &.active::before {
          background: currentColor;
          opacity: 0.1;
        }
      }
    }
  }

  &-num {
    box-sizing: border-box;
    display: flex;
    justify-content: space-between;
    padding: 12px 16px;
    overflow: hidden;
    line-height: 30px;

    overflow: hidden;
  }

  &-actions {
    box-sizing: border-box;
    display: flex;
    padding: 8px 15px;
    width: 100%;
  }
}

</style>