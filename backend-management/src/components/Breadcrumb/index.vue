<template>
  <el-breadcrumb class="app-breadcrumb" separator="/">
    <transition-group name="breadcrumb">
      <el-breadcrumb-item v-for="(item,index)  in levelList" :key="item.path">
        <span v-if="item.redirect==='noredirect'||index==levelList.length-1" class="no-redirect">{{item.meta.title}}</span>
        <router-link v-else :to="item.redirect||item.path">{{item.meta.title}}</router-link>
      </el-breadcrumb-item>
    </transition-group>
  </el-breadcrumb>
</template>

<script>
import {defineComponent, onMounted, ref, watch} from 'vue'
import {useRoute, useRouter} from 'vue-router'
export default defineComponent({

  setup(){
    const route = useRoute();
    const router = useRouter();
    let levelList = ref([])
    const getBreadcrumb = function(route){
      let matched = route.matched.filter((item)=>item.name);
      if(matched[0] && matched[0].name !== 'home'){
        matched.unshift({ path: '/home', meta: { title: '首页' }})
      }
      levelList.value = matched;
    }
    onMounted(()=>{
      getBreadcrumb(route);
    })
    watch(()=>router.currentRoute.value, (newValue)=>{
      getBreadcrumb(newValue)
    }, {immediate: true, deep: true})

    return {
      levelList,
      getBreadcrumb
    }
  }
  
    // getBreadcrumb() {
    //   let matched = this.$route.matched.filter(item => item.name)
    //   const first = matched[0]
    //   if (first && first.name !== 'home') {
    //     matched = [{ path: '/home', meta: { title: '首页' }}].concat(matched)
    //   }
    //   this.levelList = matched
    // }
  
})
</script>

<style  lang="less" scoped>
  .app-breadcrumb.el-breadcrumb {
    display: inline-block;
    font-size: 14px;
    line-height: 50px;
    margin-left: 10px;
    .no-redirect {
      color: #97a8be;
      cursor: text;
    }
  }

  
/*fade*/
.breadcrumb-enter-active,
.breadcrumb-leave-active {
  transition: all .5s;
}

.breadcrumb-enter,
.breadcrumb-leave-active {
  opacity: 0;
  transform: translateX(20px);
}

.breadcrumb-move {
  transition: all .5s;
}

.breadcrumb-leave-active {
  position: absolute;
}
</style>
