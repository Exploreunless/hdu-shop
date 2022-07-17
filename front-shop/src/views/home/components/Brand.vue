<template>
	<div class="list-tap">
		<div class="list-tap-left">推荐品牌</div>
		<div class="list-tap-right" @click="onMoreClicked">
			<span class="tap-span">更多推荐</span>
			<van-icon name="upgrade" class="tap-grade" />
		</div>
	</div>

  <div class="list">
    <div v-for="item in brandList">
      <div class="item" @click="onBrandClicker(item.id)">
        <van-image class="item-avatar" :src="item.logo"></van-image>
        <span class="item-title">{{item.name}}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {useRouter} from 'vue-router'

const router = useRouter();

withDefaults(
  defineProps<{ brandList?: Recordable[]}>(),{
      brandList: ()=>[],
  }
);

const onMoreClicked = ()=>{

}

const onBrandClicker = (id: number)=>{
	router.push({path: '/brand', query: {id}});
}

</script>

<style lang="less" scoped>
.list-tap{
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 5px 15px;
  background-color: var(--gray-color-2);

  &-left{
    font-size: 15px;
    color: var(--gray-color-8);
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

.list{
	flex-wrap: nowrap;
	overflow: auto;
	display: flex;
	align-items: center;
	
	&::-webkit-scrollbar {
		 width: 0 !important ;
	}
	scrollbar-width: none;
	&{
		overflow: -moz-scrollbars-none; 
	}
}
.item{
	display: flex;
	flex-direction: column;
	padding: 10px 0;
	align-items: center;
	justify-content: space-between;
	overflow-x: auto;
	width: 70px;
	height: 60px;
	margin: 0 5px;
	background-color: #fff;
	border-radius: 14px;
	
	&-avatar{
		// width: 50%;
		height: 50%;
	}
	&-title{
		color: var(--gray-color-7);
		font-size: 14px;
	}
}

</style>
