<script lang="ts" setup>
import { useRouter } from 'vue-router';
import { version } from '../../../package.json';
import { useUserStore } from '@/store/modules/user';
import ReturnNavBar from '@/components/ReturnNavBar/index.vue';
import { usePage } from '@/hooks/shared/usePage';

const { hasLogin} = usePage();

const router = useRouter();
const userStore = useUserStore();


const versionName = `版本号 v${version}`;

function onLogout() {
  userStore.logout().then(() => {
    router.back();
  });
}
</script>

<template>
  <ReturnNavBar title="设置" />
  <div class="container">
    <van-cell title="个人资料" is-link to="/profile" />
    <van-cell title="地址管理" is-link to="/address" />
    <!-- <van-cell title="深色模式（实验）" class="mb10" @click="onDarkThemeToggle" /> -->
    <van-cell title="关于" :value="versionName" />
    <div class="mb10"></div>
    <van-button v-if="hasLogin" block @click="onLogout">退出登录</van-button>
  </div>
</template>

<style lang="less" scoped>
.mb10 {
  margin-bottom: 10px;
}
</style>
