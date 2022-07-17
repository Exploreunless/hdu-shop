<script setup lang="ts">
import { computed, ref, unref, onMounted, Ref} from 'vue';
import {typeAddress} from './type'
import {Toast} from 'vant'
import { areaList } from '@vant/area-data';
import {useRoute, useRouter} from 'vue-router';
import ReturnNavBar from '@/components/ReturnNavBar/index.vue';
import API_ADDRESS from '@/apis/address';
import { isEmpty, isMobile } from '@/utils/validate';

const route = useRoute();
const router = useRouter();
const form: Ref<typeAddress> = ref({
  "city": "",
  "defaultStatus": 0,
  "detailAddress": "",
  "id": 1,
  "memberId": 0,
  "name": "",
  "phoneNumber": "",
  "postCode": "",
  "province": "",
  "region": ""
})

// 是否编辑
const isEdit = computed(()=>{
  return route.query.id !== undefined;
})

// 地址数据
onMounted(()=>{
  if(unref(isEdit)){
    API_ADDRESS.umsGetAddressDetail(Number(route.query.id))
    .then((res)=>{
      form.value = Object.assign(form.value, res.data);
    })
  }
})

const areaStr = computed(()=>{
  return formatAreaStr(form.value.province, form.value.city, form.value.region);
});

const isDefault = computed({
  get(){
    return !!form.value.defaultStatus;
  },
  set(val){
    form.value.defaultStatus = val?1:0;
  }
})

// 省市区地址
const showPicker = ref(false);
const formatAreaStr = (provinceStr: string, cityStr: string, countyStr: string) => {
  let str = provinceStr;
  cityStr.length > 1 && cityStr !== provinceStr && (str += ` / ${cityStr}`);
  countyStr.length > 1 && (str += ` / ${countyStr}`);
  return str;
}

// 更改地址
const onAreaConfirm = (values)=>{
  unref(form).province = values[0].name;
  unref(form).city = values[1].name;
  unref(form).region = values[2].name;
  unref(form).postCode = values[2].code;
  showPicker.value = false;
}

const onSave = () => {
  console.log(unref(form))
  if (isEmpty(unref(form).name)) {
    Toast('收货人不能为空');
    return;
  }

  if (!isMobile(unref(form).phoneNumber)) {
    Toast('请填写正确的电话');
    return;
  }

  if (isEmpty(unref(form).province)) {
    Toast('所在地不能为空');
    return;
  }
  if (isEmpty(unref(form).detailAddress)) {
    Toast('详细地址不能为空');
    return;
  }
  if(!unref(isEdit)){
    API_ADDRESS.umsAddAddress(unref(form))
    .then(()=>{
      Toast( '添加成功');
      router.back();
    })
    .catch((error) => {
      console.error(error);
    });
  }else{
    API_ADDRESS.umsUpdateAddress(unref(form).id, unref(form))
    .then(()=>{
      Toast( '修改成功');
      router.back();
    })
    .catch((error) => {
      console.error(error);
    });
  }
  
};
const onDelete = () => {
  Toast.loading({
    forbidClick: true,
    message: '加载中...',
    duration: 0,
  });
  API_ADDRESS.umsDeleteAddress(unref(form).id)
  .then(()=>{
    Toast( '删除成功');
    router.back();
  }).catch((error) => {
    console.error(error);
  });
};

</script>

<template>
  <ReturnNavBar :title="isEdit?'修改地址':'新增地址'" />
  <div class="container">
    <div class="group">
      <van-field v-model="form.name" label="收货人" placeholder="收货人姓名" clearable />
      <van-field v-model="form.phoneNumber" type="tel" label="手机号码" placeholder="收货人手机号" clearable />
      <van-field
        readonly
        :model-value="areaStr"
        label="所在地区"
        placeholder="选择省 / 市 / 区"
        is-link
        @click="showPicker = true"
      />
      <van-field
        v-model="form.detailAddress"
        label="详细地址"
        placeholder="街道门牌、楼层房间号等信息"
        rows="1"
        autosize
        type="textarea"
        clearable
      />
    </div>
    <div class="group">
      <van-cell center title="设为默认收货地址">
        <template #right-icon>
          <van-switch v-model="isDefault" size="24px" />
        </template>
      </van-cell>
    </div>
    <div class="group2">
    <van-button class="btn-submit" block type="primary" round @click="onSave">保存</van-button>
    <van-button v-if="form.id" class="btn-submit" block type="default" round @click="onDelete">删除收货地址</van-button>
    </div>
    <!-- 所在地 -->
    
    <van-popup v-model:show="showPicker" position="bottom">
      <van-area :area-list="areaList" @cancel="showPicker = false" @confirm="onAreaConfirm" />
    </van-popup>
  </div>
</template>

<style scoped>
.group {
  overflow: hidden;
  margin-bottom: 10px;
  border-radius: 8px;
  background-color: var(--white);
}

.group2 {
  padding: 0 12px;
}
.btn-submit {
  margin-top: 10px;
  box-sizing: border-box;
}
</style>