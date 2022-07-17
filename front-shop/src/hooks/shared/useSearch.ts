import { reactive, unref, toRefs} from "vue";
import {Toast} from 'vant';
import {umsGoodSearch} from '@/apis/good';


export function useSearch(){
    const state = reactive({
      brandId: -1,
      keyword: '',
      pageNum: 1,
      pageSize: 4,
      productCategoryId: -1,
      sort: 0
    });
    
    // 点击获取验证码按钮
   function fetchList(){

   }

    return {
        ...toRefs(state),
    };
}