<script lang="ts">
import { defineComponent} from 'vue';
import {useRouter} from 'vue-router'
export default defineComponent({
  name: 'HomeNavBar',
  setup() {
    const router = useRouter();
    function onSearch(){
      router.push('/search');
    }
    return {
      onSearch
    }
  },
});
</script>

<template>
  <div class="demo-nav" style="">
    <div class="demo-nav__title">shop 商城</div>
    <div class="demo-nav__left" viewBox="0 0 1000 1000" >
        <van-icon name="chat-o" dot size="20px"/>
    </div>
    <div class="demo-nav__right" viewBox="0 0 1000 1000" >
      <van-icon name="search" @click='onSearch' size="20px"/>
      <van-icon name="ellipsis" />
    </div>
  </div>
</template>

<style lang="less" scoped>
.demo-nav {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #fff;
    height: calc(45px + constant(safe-area-inset-bottom));
    height: calc(45px + env(safe-area-inset-bottom));
    // border-bottom: solid 1px #ddd;

  .demo-nav__title {
    font-weight: 600;
    font-size: 16px;
    text-transform: capitalize;
  }
  .demo-nav__left {
    position: absolute;
    top: 16px;
    left: 16px;
    width: 24px;
    height: 24px;
    cursor: pointer;
}
 .demo-nav__right {
    position: absolute;
    top: 16px;
    right: 16px;
    width: 45px;
    height: 24px;
    cursor: pointer;
    display: flex;
    justify-content: space-between;
}
}
</style>