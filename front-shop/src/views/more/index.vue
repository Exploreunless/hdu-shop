<script setup lang="ts">
import ReturnNavBar from '@/components/ReturnNavBar/index.vue';
import MoreGoods from '@/components/MoreGoods/index.vue';
import {computed, reactive} from 'vue';
import {useRoute} from 'vue-router';
import IMAGE_NEW from '@/assets/images/new.jpeg';
import IMAGE_HOT from '@/assets/images/hot.jpeg';

const route = useRoute();
// 人气
const typeProduct = reactive({
  'hot': {name: '人气推荐', pic: IMAGE_HOT},
  'new': {name: '新鲜好物', pic: IMAGE_NEW}
})

const ptype = computed(()=>String(route.query.ptype))

</script>

<template>
<ReturnNavBar :title="typeProduct[ptype].name" />
<MoreGoods :pic="typeProduct[ptype].pic" :ptype="ptype"></MoreGoods>

</template>

<style lang="less" scoped>

</style>