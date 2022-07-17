<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'Price',
  props: {
    price: [Number, String],
    symbol: {
      type: String,
      default: '¥',
    },
    type: {
      type: Boolean,
      default: false
    }
  },
  setup(props) {
    function getInteger(n: any) {
      if (Number.isNaN(Number(n))) {
        // eslint-disable-next-line no-param-reassign
        n = 0;
      }
      const numArr: string[] = Number(n).toFixed(2).split('.');
      return numArr[0];
    }

    function getDecimal(n: any) {
      if (Number.isNaN(Number(n))) {
        // eslint-disable-next-line no-param-reassign
        n = 0;
      }
      const numArr: string[] = Number(n).toFixed(2).split('.');

      return `.${numArr[1]}`;
    }

    return {
      getInteger,
      getDecimal
    }
  },
});
</script>

<template>
<span class="price" >
  <span :class="{'price-symbol':true, 'color-grey': type }">{{symbol}}</span>
  <span :class="{'price-integer': true, 'color-grey': type }">{{getInteger(price)}}</span>
  <span :class="{'price-decimal': true, 'color-grey': type }">{{getDecimal(price)}}</span>
</span>
</template>
<style lang="less" scoped>
.price {
  &-symbol {
    margin-right: 2px;
    font-size: 12px;
  }

  &-integer {
    font-size: 18px;
    font-weight: bold;
    font-family: @font-family-price-integer;
  }

  &-decimal {
    font-size: 12px;
    font-weight: bold;
  }
}

.color-grey{
  color: var(--gray-color-6);
}
</style>
