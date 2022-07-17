<script lang="ts">
import { defineComponent} from 'vue';
import {useRouter} from 'vue-router';
export default defineComponent({
  name: 'ReturnNavBar',
  props:{
      title: {
          default: 'App',
      }
  },
  setup() {
    const router = useRouter();
    const returnRouter = ()=>{
      router.back();
    }
    return {
      returnRouter
    }
  },
});
</script>

<template>
  <div class="demo-nav" style="">
    <div class="demo-nav__back" viewBox="0 0 1000 1000" @click="returnRouter">
        <van-icon name="arrow-left" />
    </div>
    <div class="demo-nav__title">{{title}}</div>
    <div class="demo-nav__right" viewBox="0 0 1000 1000">
      <slot name="right"></slot>
    </div>
  </div>
</template>

<style lang="less" scoped>
.demo-nav {
    position: relative;
    display: flex;
    align-items: center;
    padding: 0 15px;
    justify-content: space-between;
    // background-color: #fff;
    height: calc(45px + constant(safe-area-inset-bottom));
    height: calc(45px + env(safe-area-inset-bottom));
    // border-bottom: solid 1px #ddd;

  .demo-nav__title {
    font-weight: 600;
    font-size: 16px;
    text-transform: capitalize;
  }
  .demo-nav__back {
    // position: absolute;
    // top: 16px;
    // left: 16px;
    width: 24px;
    height: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
  }
   .demo-nav__right {
    // position: absolute;
    // top: 16px;
    // right: 16px;
    // width: 24px;
    height: 24px;
    cursor: pointer;
  }
}
</style>