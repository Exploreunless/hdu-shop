<script lang="ts" setup>
import {reactive, ref , unref} from 'vue';
import ReturnNavBar from '@/components/ReturnNavBar/index.vue';
import {Dialog, Toast} from 'vant';
import ProList from '@/components/ProList/index.vue';
import goodCard from '@/components/GoodCard3/index.vue';
import API_HISTORY from '@/apis/history';
import {isFixedData} from '@/constants';
import axios from 'axios';

const listRef = ref<any>(null);

const listQuery = reactive({
  pageNum: 1,
  pageSize: 5,
});

const listEmptyText = ref('暂无浏览商品');
 
function loadList() {
  const jsonFetch = () => 
    axios.get('/src/views/collect/data.json')
    .then(response=>{
      return response.data;
  });
  const params: Recordable = {
    pageNum: listQuery.pageNum,
    pageSize: listQuery.pageSize,
  };

  return isFixedData ? jsonFetch() : API_HISTORY.fetchHistory(params);;
}

function afterFetch(data: Recordable){
  data.list = data.list.map((item: Recordable)=>{
    item['selected'] = false;
    return item;
  });
  return data.list;
}
// 编辑
const editStatus = ref(1); // 编辑, 取消
function onEditStatusChange() {
  editStatus.value = unref(editStatus) === 1 ? 2 : 1;
}

const all = ref(false);
function onToggleAll(){
  listRef.value?.onSelectAll(all.value);
}

function onDelete(){
  if(all.value){
     Dialog.confirm({
      title: '提示',
      message: '是否全部清空？',
    })
    .then(() => {
      API_HISTORY.clearHistory().then(()=>{
        Toast('清空成功');
        listRef.value?.refresh();
        onEditStatusChange();
      }).catch((error)=>{
        console.log(error);
      });
    });
    
  }else{
    const ids = listRef.value?.sendSelected()?.map((item)=>item.id);
    if(!ids || !ids.length){
      Toast('请选择某项商品');
      return;
    }
     Dialog.confirm({
      title: '提示',
      message: '是否删除？',
    })
    .then(() => {
      API_HISTORY.deleteHistory(ids).then(()=>{
        Toast('删除成功');
        listRef.value?.refresh();
        onEditStatusChange();
      }).catch((error)=>{
        console.log(error);
      });
    });
  }
}

</script>

<template>
  <ReturnNavBar title="浏览列表" >
    <template #right>
      <div @click="onEditStatusChange">
        {{ editStatus === 1 ? '编辑' : '完成' }}
      </div>
    </template>
  </ReturnNavBar>
  <div class="container">
    <ProList
      ref="listRef"
      :api="loadList"
      :afterFetch="afterFetch"
      :pagination="listQuery"
      :empty-text="listEmptyText"
    >
      <template #item="{ item, index }">
        <div class="list-item">
          <div class="list-item-selected" v-if="editStatus !== 1"  >
            <van-checkbox v-model="item.selected"></van-checkbox>
          </div>
          <div class="list-item-good">
            <good-card :key="item.id" :good-info="item" />
          </div>
        </div>
      </template>
    </ProList>

    <div class="submit-bar-wrap" v-if="editStatus !== 1">
      <div class="submit-bar">
        <van-checkbox v-model="all" @click="onToggleAll">全选</van-checkbox>
        
        <div class="submit-bar-hd"></div>
        <van-button class="submit-bar-button" round plain @click="onDelete">删除</van-button>
        
      </div>
    </div>
  </div>
</template>

<style lang="less" scoped>
//

.list-item{
  display: flex;
  align-items: center;
  flex: 1;
  width: 100%;

  &-selected{
    margin-left: 10px;
  }

  // &-good{

  // }
}

.submit-bar {
  box-sizing: border-box;
  position: fixed;
  left: 0;
  bottom: calc(0px + constant(safe-area-inset-bottom));
  bottom: calc(0px + env(safe-area-inset-bottom));
  z-index: 100;
  width: 100%;
  padding: 0 16px;
  background-color: #fff;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  height: 50px;
  font-size: 14px;

  // &-wrap {
  //   height: calc(50px + constant(safe-area-inset-bottom));
  //   height: calc(50px + env(safe-area-inset-bottom));
  // }

  &-hd {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    padding-right: 15px;
    color: var(--gray-color-8);
  }
  &-button{
    width: 60px;
    height: 30px;
    background: transparent;
  }
}
</style>
