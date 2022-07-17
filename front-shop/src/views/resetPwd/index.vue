<script setup lang="ts">
import { ref, computed, unref } from 'vue'
import { loginProviderType} from '@/constants/modules/user';

import PwdField from '@/components/PwdField/index.vue'
import { Toast } from 'vant';
import { isMobile, isPassWord, isSame } from '@/utils/validate';
import {useRouter} from 'vue-router'
import {useUserStore} from '@/store/modules/user';
import { useSmsCode } from '@/hooks/shared/useSmsCode';

const router = useRouter();
const userStore = useUserStore();

// 标记注册界面
const loginType = ref('resetPwd');
const loginProvider = computed(() => {
  return loginProviderType[loginType.value] || {};
});
// 表单数据
const { mobile, smsCode, smsTimer, smsText, onSmsBtnClicked } = useSmsCode();
const pwd = ref('');
const pwd2  =ref('');

// 注册中记号
const submitLoading = ref(false);

// 是否可重置
const submitted = computed(()=>{
  return unref(mobile) && pwd.value && pwd2.value && unref(smsCode);
})

// 重置密码提交事件
const onSubmit = ()=>{
  if (!isMobile(unref(mobile))) {
    Toast('手机号格式错误');
    return;
  }

   if (!isPassWord(unref(pwd))) {
    Toast('请设置8-25位(数字+字母)密码');
    return;
  }

  if (!isSame(unref(pwd), unref(pwd2))) {
    Toast('2次输入密码不一致');
    return;
  }

  const params: Recordable = {
    telephone: unref(mobile),
    password: unref(pwd),
    authCode: unref(smsCode),
  }

  submitLoading.value = true;
  userStore.resetPwd({params})
  .then(()=>{
    submitLoading.value = false;
    router.replace({ path: '/login' })
    Toast.success('重置成功');
  }).catch((error)=>{
    submitLoading.value = false;
    console.error(error);
  });
  
}

</script>

<template>
  <div class="container">
    <main class="main">
      <h2 class="h2">{{loginProvider.h2}}</h2>
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
        <div class="form-item">
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
        {{pwd}}
        <div class="form-item">
          <PwdField
            v-model="pwd"
            key="pwd"
            class="form-field"
            :border="false"
            placeholder="请设置8-25位(数字+字母)密码"
            clearable
          />
        </div>
        {{pwd2}}
         <div class="form-item">
          <PwdField
            v-model="pwd2"
            key="pwd2"
            class="form-field"
            :border="false"
            placeholder="请再次输入密码"
            clearable
          />
        </div>
        
        <van-button
          class="form-submit"
          block
          :disabled="!submitted"
          :loading="submitLoading"
          loading-text="重置密码中..."
          type="primary"
          @click="onSubmit"
          >确定</van-button
        >
      </div>
    </main>
  </div>
</template>

<style lang="less" scoped>

@import '../login/style.less';
</style>
