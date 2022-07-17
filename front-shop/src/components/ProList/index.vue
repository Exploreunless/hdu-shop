<script lang="ts">
import { defineComponent, onMounted, PropType, ref, unref, watch } from 'vue';
import { isFunction } from '@/utils/validate';

export default defineComponent({
  name: 'ProList',
  props: {
    // 接口请求Promise对象
    api: {
      type: Function as PropType<(...arg: any[]) => Promise<any>>,
      required: true,
      default: null,
    },
    // 自定义处理接口返回数据
    afterFetch: {
      type: Function as PropType<Fn>,
      default: null,
    },
    // 分页配置
    pagination: {
      type: Object,
      default: () => ({
        pageNum: 1,
        pageSize: 20,
      }),
    },
    // 立即请求接口
    immediate: {
      type: Boolean,
      default: true,
    },
    emptyImage: {
      type: String,
      default: '',
    },
    emptyText: {
      type: String,
      default: '暂无数据',
    },
    errorText: {
      type: String,
      default: '请求失败，点击重新加载',
    },
    loadingText: {
      type: String,
      default: '加载中...',
    },
    finishedText: {
      type: String,
      default: '没有更多了',
    },
    offset: {
      type: [Number, String],
      default: 300,
    },
    direction: {
      type: String,
      default: 'down',
    },
    flex:{
      type: Boolean,
      default: false
    }
  },
  setup(props, { expose }) {
    const list = ref<Recordable[]>([]);
    const loading = ref(false);
    const error = ref(false);
    const finished = ref(false);

    function deleteItemByIndex(index: number) {
      list.value.splice(index, 1);
    }

    function refresh() {
      if (unref(loading)) {
        return;
      }

      // eslint-disable-next-line vue/no-mutating-props
      props.pagination.pageNum = 1;
      list.value = [];
      finished.value = false;
      onLoad();
    }

    function onLoadMore() {
      if (unref(finished)) {
        return;
      }
      // eslint-disable-next-line vue/no-mutating-props
      props.pagination.pageNum += 1;
      onLoad();
    }

    function onSelectAll(flag: boolean) {
      if (!list.value.length || list.value[0].selected === undefined) {
        return;
      }
      list.value.forEach((item)=>{
        item.selected = flag;
      })
      // eslint-disable-next-line vue/no-mutating-props
    }

    function sendSelected(){
      if (!list.value.length || list.value[0].selected === undefined) {
        return;
      }
      return list.value.filter((item)=>{
        return item.selected === true;
      })
    }

    function onLoad() {
      loading.value = true;
      props
        .api()
        .then((res) => {
          let records = res.data?.list ?? [];
          const total = res.data?.total ?? 0;

          if (props.afterFetch && isFunction(props.afterFetch)) {
            records = props.afterFetch(res.data);
          }

          list.value = props.pagination.pageNum === 1 ? records : list.value.concat(records);
          finished.value = list.value.length >= total;
        })
        .catch((err) => {
          console.error(err);
          error.value = true;
        })
        .finally(() => {
          loading.value = false;
        });
    }

    expose({ deleteItemByIndex, refresh, onLoadMore, onSelectAll, sendSelected });

    const unwatch = watch(()=>props.immediate, function(newValue){
      if(newValue){
        onLoad()
        unwatch();
      }
    });

    onMounted(() => {
      props.immediate && onLoad();
      // 立刻执行
    });

    return {
      list,
      loading,
      error,
      finished,
      // methods
      onLoadMore,
      onLoad,
    };
  },
});
</script>

<template>
  <van-list 
    v-model:loading="loading"
    v-model:error="error"
    :class="{'list':flex}"
    :finished="finished"
    :finished-text="finishedText"
    :error-text="errorText"
    :immediate-check="false"
    :offset="offset"
    @load="onLoadMore"
  >
    <template v-for="(item, index) in list">
      <slot name="item" v-bind="{ item, index }"></slot>
    </template>
    <template #finished>
      <span v-if="list.length">{{ finishedText }}</span>
      <van-empty v-else :image="emptyImage || 'default'" :description="emptyText" />
    </template>
  </van-list>
</template>

<style lang="less" scoped>
.list{
  display: flex;
  flex-wrap: wrap;
  align-items: center;
}

.van-list__finished-text{
  width: 100%;
}
.finish{
  width: 100%;
  // display: flex;
  justify-content: center;
  // position: absolute;
  // bottom: 0;


}

</style>
