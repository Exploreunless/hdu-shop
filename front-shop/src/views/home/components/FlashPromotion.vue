<script lang="ts">
import goodCard from '@/components/GoodCard2/index.vue';
import countDown from '@/components/CountDown/index.vue';
import { defineComponent } from 'vue';
import {dateDiff, formatDate} from '@/utils/date'

export default defineComponent({
  name: '',
  components: {countDown, goodCard}, 
  props:{
    flashList: {
      required: true,
      default: {
        "startTime": null,
        "endTime": null,
        "nextStartTime": null,
        "nextEndTime": null,
        "productList": []
      }
    }
  },
  setup(){
    const restTime = (time)=>{
      if(time==null||time===''){
        return '0';
      }
      return dateDiff(time)
    }

    const nextTime = (time)=>{
      if(time==null||time===''){
        return '';
      }
      const date = new Date(time);
      return formatDate(date, 'hh:ss')
    }

    return {
      restTime,
      nextTime
    }
  }
})

</script>

<template>
<div class="list-tap">
  <div class="list-tap-left">
    <div class="left-title">秒杀专区</div>
    <div class="left-next-time">下一场 <span class="next-time">{{nextTime(flashList['nextStartTime'])}}</span> 开始</div>
  </div>
  <div class="list-tap-right">
    <div class="right-tips">本场时间剩余</div>
    <count-down :time="restTime(flashList['endTime'])"></count-down>
  </div>
</div>
<div class="list">
  <div class="list-col" v-for="item in flashList.productList" :key="item.id">
    <good-card :good="item" ></good-card>
  </div>
</div>
</template>

<style lang="less" scoped>
.list-tap{
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 5px 15px;
  background-color: var(--gray-color-2);

  &-left{
    font-size: 15px;
    color: var(--gray-color-8);
    .left-next-time{
      font-size: 13px;
      .next-time{
        background-color: var(--red-color);
        color: #fff;
      }
    }
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
  padding: 0 5px;

  :deep(.van-list__loading),
  :deep(.van-list__finished-text),
  :deep(.van-list__error-text) {
    width: 100%;
  }

  &-col {
    width: 100%;
    box-sizing: border-box;
    // padding-left: 5px;
    // padding-right: 5px;
    // margin-bottom: 10px;
  }
}
</style>
