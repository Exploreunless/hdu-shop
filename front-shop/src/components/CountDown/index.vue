<template>
  <van-count-down :time="time">
    <template #default="timeData">
      <span class="block">{{ timeData.hours }}</span>
      <span class="colon">:</span>
      <span class="block">{{ timeData.minutes }}</span>
      <span class="colon">:</span>
      <span class="block">{{ timeData.seconds }}</span>
    </template>
  </van-count-down>
</template>

<script setup lang="ts">
defineProps({
  time: {
    // type: Array,
    default: ''
  },
})
</script>

<style lang="less" scoped>
 .colon {
    display: inline-block;
    margin: 0 4px;
    color: #ee0a24;
  }
.block {
  display: inline-block;
  width: 22px;
  color: #fff;
  font-size: 12px;
  text-align: center;
  background-color: #ee0a24;
}

</style>
