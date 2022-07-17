<template>
  <ReturnNavBar title="填写退货单" />
  <div class="container">
    <div class="main">
      <van-form @submit="onRefundApplySubmit">
        <van-cell-group inset>
          <van-field
            readonly
            clickable
            label="售后原因"
            :model-value="reason"
            placeholder="退换货原因"
            @click="showPicker = true"
          />

          <van-field
            v-model="description"
            rows="4"
            autosize
            label="问题描述"
            type="textarea"
            maxlength="50"
            placeholder="退换货具体原因"
            show-word-limit
          />
          <van-field name="uploader" label="凭证上传">
            <template #input>
              <van-uploader v-model="proofPics" />
            </template>
          </van-field>
        </van-cell-group>

        <van-cell-group inset>
          <van-field
            v-model="returnName"
            name="用户名"
            label="用户名"
            placeholder="用户名"
            :rules="[{ required: true, message: '请填写退货人' }]"
          />
          <van-field
            v-model="returnPhone"
            name="手机号"
            label="手机号"
            placeholder="手机号"
            :rules="[{ required: true, message: '请填写退货电话' }]"
          />
        </van-cell-group>
        <div style="margin: 16px;">
          <van-button round block type="primary" native-type="submit">
            提交
          </van-button>
        </div>
      </van-form>
      <van-popup v-model:show="showPicker" position="bottom">
        <van-picker show-toolbar :columns="reasonItems" @cancel="showPicker = false" @confirm="onConfirm" />
      </van-popup>
    </div>
  </div>
</template>

<script lang="ts" setup>

import { useOrderStore } from '@/store/modules/order';
import {reactive, ref, unref } from 'vue';
import ReturnNavBar from '@/components/ReturnNavBar/index.vue';
import {Dialog, Toast} from 'vant';
import {useRouter} from 'vue-router'
import API_ORDER from '@/apis/order';
import {useUserStore} from '@/store/modules/user';
import {isMobile} from '@/utils/validate';


const orderStore = useOrderStore();
const userStore = useUserStore();
const router = useRouter();
// 原因
const reason = ref('');
const reasonItems = reactive([
  '不喜欢/不想要',
  '空包裹',
  '未按约定时间发货',
  '快递/物流一直未送达',
  '货物破损已拒签',
  '退运费',
  '规格尺寸与商品页面描述不符',
  '功能/效果不符',
  '质量问题',
  '少件/漏发',
  '包装/商品破损',
  '发票问题',
])

const showPicker = ref(false);
function onConfirm(value) {
  reason.value = value;
  showPicker.value = false;
}

// 描述
const description = ref('');
// 凭证
const proofPics = ref();
// 姓名
const returnName = ref('');
const returnPhone = ref('');

function onRefundApplySubmit() {
  if (!unref(reason)) {
    Toast('请选择退换货原因');
    return;
  }
  if (!isMobile(unref(returnPhone))) {
    Toast('请填写正确的手机号');
    return;
  }

  const returnApply = Object.assign({}, unref(orderStore.getTradeGoods));
  returnApply['reason'] = unref(reason);
  returnApply['returnName'] = unref(returnName);
  returnApply['returnPhone'] = unref(returnPhone);
  returnApply['proofPics'] = unref(proofPics)?unref(proofPics)[0]['content']:'';
  returnApply['description'] = unref(description);
  returnApply['memberUsername'] = unref(userStore.getUserInfo?.username);
  console.log(returnApply);
  API_ORDER.returnApply({returnApply}).then((res) => {
    Dialog
      .confirm({
        title: '提示',
        message: '提交成功，请耐心等待我们处理！',
        showCancelButton: false,
        confirmButtonText: '我知道了',
      })
      .then(() => {
        // on confirm
        router.back();
      })
      .catch((error) => {
        console.error(error);
      });
  });
}

</script>

<style lang="less" scoped>
</style>
