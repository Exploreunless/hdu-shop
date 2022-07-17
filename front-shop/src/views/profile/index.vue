<script setup lang="ts">
import { ref, reactive, unref,} from 'vue';
import { areaList } from '@vant/area-data';
import { AreaColumnOption, Toast } from 'vant';
import ReturnNavBar from '@/components/ReturnNavBar/index.vue';
import {useUserStore} from '@/store/modules/user';
import {mobileShow} from '@/utils/format'

const userStore = useUserStore();
const userInfo = reactive(Object.assign({}, unref(userStore.getUserInfo)));
// 生日
const showCalendar = ref(false);
const onBirthdayConfirm = (date)=>{
  userInfo.birthday = `${date.getMonth() + 1}/${date.getDate()}`;
  showCalendar.value = false;
}

// 城市
const showPicker = ref(false);
const onAreaConfirm = (values: Array<AreaColumnOption>)=>{
  userInfo.city = values[0].name + " " + values[1].name;
  showPicker.value = false;
}


// 提交信息
const onSubmit = ()=>{
  Toast({message: '暂时无法修改'});
  return
}
</script>

<template>
 <div class="container">
  <ReturnNavBar :title="'个人信息'"></ReturnNavBar>
  <van-form @submit="onSubmit">
    <van-cell-group class="avatar-box" inset>
      <div class="ava">
        <van-uploader>
          <div class="avatar">
            <van-image class="avatar-img" :src="userInfo.avatarUrl" />
            <div class="avatar-title">点击更换头像</div>
          </div>
        </van-uploader>
      </div>
      <!-- 用户id -->
      <van-field name="id" label="用户ID">
        <template #input>
          <span>{{userInfo.id}}</span>
        </template>
      </van-field>
      <!-- 昵称 -->
      <van-field
        v-model="userInfo.username"
        name="用户名"
        label="用户名"
        placeholder="用户名"
      />
      <!-- 性别 -->
      <van-field name="radio" label="单选框">
        <template #input>
          <van-radio-group v-model="userInfo.gender" direction="horizontal">
            <van-radio name="男">男</van-radio>
            <van-radio name="女">女</van-radio>
          </van-radio-group>
        </template>
      </van-field>
      <!-- 电话 -->
      <van-field name="id" label="手机号">
        <template #input>
          <span class="phone-span">{{mobileShow(userInfo.phone)}}</span>
          <van-icon name="arrow"  class="van-cell__right-icon"/>
        </template>
      </van-field>
      <!-- 生日 -->
      <van-field
        v-model="userInfo.birthday"
        is-link
        name="calendar"
        label="生日"
        placeholder="点击选择日期"
        @click="showCalendar = true"
      />
      <van-calendar v-model:show="showCalendar" @confirm="onBirthdayConfirm" />
      <!--  城市-->
      <van-field
        :model-value="userInfo.city"
        label="所在地"
        placeholder="点击选择城市"
        is-link
        :border="false"
        @click="showPicker = true"
      />
      <van-popup v-model:show="showPicker" position="bottom">
        <van-area :area-list="areaList" :columns-num="2" @cancel="showPicker = false" @confirm="onAreaConfirm" />
      </van-popup>
      <!-- 职业 -->
      <van-field
        v-model="userInfo.job"
        name="职业"
        label="职业"
        placeholder="填写职业"
      />
      <!-- 个性签名 -->
      <van-field
        v-model="userInfo.personalizedSignature"
        name="个性签名"
        label="个性签名"
        placeholder="填写你的个性签名"
      />
    </van-cell-group>
      <div style="margin: 16px;">
        <van-button round block type="primary" native-type="submit">
          提交
        </van-button>
      </div>
    </van-form>
  </div>
</template>

<style lang="less" scoped>

.container{
  overflow: auto;
}
.avatar-box{
  margin-bottom: 5px;
  .ava{
    display: flex;
    justify-content: center;
  }
.avatar {
  padding: 20px 0 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  &-img {
    width: 70px;
    height: 70px;
    border-radius: 50%;
    overflow: hidden;
    margin-bottom: 10px;
  }

  &-title {
    font-size: 12px;
    color: var(--gray-color-8);
  }
}
}
.phone-span{
  width: 100%;
}
</style>
