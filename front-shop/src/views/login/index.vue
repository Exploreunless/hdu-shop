<script setup lang="ts">
import { computed } from '@vue/reactivity';
import { ref, unref } from 'vue';
import {useRoute, useRouter} from 'vue-router'
import { usePage } from '@/hooks/shared/usePage';
import { loginProviderType } from '@/constants/modules/user';
import { useSmsCode } from '@/hooks/shared/useSmsCode';
import { Toast } from 'vant';
import { isMobile } from '@/utils/validate';
import { useUserStore } from '@/store/modules/user';

const { goPage } = usePage();
const route = useRoute();
const router = useRouter();
const userStore = useUserStore();
// const loginForm = reactive({
//   username: '',
//   password: '',
//   authcode: ''
// });

// 密码登录or验证码登录
const loginType = ref('system');
const checkTypeText = computed(() => {
  return loginType.value === 'sms' ? '密码登录' : '验证码登录';
});
const loginProvider = computed(() => {
  return loginProviderType[loginType.value] || {};
});
// 切换登录方式
const onLoginTypeChange = ()=>{
  loginType.value = loginType.value === 'sms' ? 'system' : 'sms';
}

// 验证码
const { mobile, smsCode, smsTimer, smsText, captchaShow, onSmsBtnClicked, onSmsSend } = useSmsCode();
const password = ref('a12345678');

// 登录中记号
const submitLoading = ref(false);

// 是否可登录
const submitted = computed(()=>{
  if (loginType.value === 'sms') {
    return unref(mobile) && unref(smsCode);
  }
  return unref(mobile) && password.value;
})


// 登录提交事件
const onSubmit = ()=>{
  // if (!isMobile(unref(mobile))) {
  //   Toast('手机号格式错误');
  //   return;
  // }

  const params: Recordable = {
    telephone: unref(mobile),
    password: unref(loginType) === 'system' ? unref(password): unref(smsCode)
  }

  submitLoading.value = true;
  userStore.login({params})
  .then(()=>{
    submitLoading.value = false;
    route.query.redirect ? router.replace({ path: route.query.redirect as string }) : router.replace({ path: '/' });

    Toast.success('登录成功');
  }).catch((error)=>{
    submitLoading.value = false;
    console.error(error);
  });
  
}

// 底部
const agree = ref(false);

</script>

<template>
  <div class="container">
    <main class="main">
      <h2 class="h2">{{loginProvider.h2}}</h2>
      <div class="safe-tips">为了你的账号安全，请用手机号登录</div>
      <div class="form">
        <div class="form-item">
          <div class="form-item-country">中国 +86</div>
          <van-field
            v-model="mobile"
            class="form-field"
            :border="false"
            type="tel"
            placeholder="请输入手机号"
            clearable
          />        
        </div>
        <div v-if="loginType === 'system'" class="form-item">
          <van-field
            v-model="password"
            class="form-field"
            :border="false"
            type="password"
            placeholder="请输入密码"
            clearable
          />
        </div>
        <div v-if="loginType === 'sms'" class="form-item">
          <van-field
            v-model="smsCode"
            class="form-field"
            :border="false"
            type="number"
            placeholder="请输入4位验证码"
            clearable
          />
          <template v-if="smsTimer">
            <span class="sms-btn countdown">{{ smsText }}</span>
          </template>
          <template v-else>
            <span class="sms-btn" @click="onSmsBtnClicked">{{ smsText }}</span>
          </template>
        </div>
        <van-button
          class="form-submit"
          block
          :disabled="!submitted"
          :loading="submitLoading"
          loading-text="登录中..."
          type="primary"
          @click="onSubmit"
          >登录</van-button
        >
      </div>
      <div class="check-type">
        <div class="check-type-hd">
          <span class="check-type-btn" @click="onLoginTypeChange">{{ checkTypeText }}</span>
        </div>
        <div class="check-type-bd">
          <template v-if="loginType === 'system'">
            <span class="check-type-btn" @click="goPage('/resetPwd')">忘记密码</span>
            <span class="check-type-separate">|</span>
          </template>
          <span class="check-type-btn" @click="goPage('register')">免费注册</span>
        </div>
      </div>
    </main>
    <footer class="footer">
      <div class="footer-agreement">
        <van-checkbox v-model="agree" icon-size="16px" />
        <span> 阅读并同意</span><a href="javascript:void(0);">《用户协议》</a>和<a href="javascript:void(0);"
          >《隐私政策》</a>
      </div>
    </footer>
  </div>
</template>

<style lang='less' scoped>
@import './style.less';
</style>
