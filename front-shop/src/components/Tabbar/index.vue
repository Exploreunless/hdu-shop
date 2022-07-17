<script lang="ts">
import { defineComponent, reactive, ref, watchEffect } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAppStore } from '@/store/modules/app';
export default defineComponent({
  setup(){
    const router = useRouter();
    const route = useRoute();
    const appStore = useAppStore();

    const tabList = reactive(appStore.getTabBar.list);
    const active = ref('/home');

    watchEffect(() => {
      active.value = route.path;
    });

    return{
      tabList,
      active
    }
  }

})

</script>

<template>
<div class="tabbar-wrap">
  <van-tabbar v-model="active" route class="tabbar" fixed>
    <van-tabbar-item v-for="(item, index) in tabList" :icon="item.icon" replace :to="item.pagePath" :name="item.pagePath">
      {{item.text}}
    </van-tabbar-item>
  </van-tabbar>
</div>
 
</template>

<style lang="less" scoped>
.tabbar-wrap {
  height: calc(50px + constant(safe-area-inset-bottom));
  height: calc(50px + env(safe-area-inset-bottom));
  z-index: 999;
}

.tabbar {
  z-index: 999;
  :deep(.van-tabbar-item--active) {
    color: var(--brand-color);
    color: var(--brand-color);
  }
}
</style>