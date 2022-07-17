import { reactive, unref, toRefs} from "vue";
import {Toast} from 'vant';
import { isMobile } from '@/utils/validate';
import API_USER from '@/apis/user'
import { sms } from '@/constants/modules/user';

type Timer = null | TimeoutHandle

export function useSmsCode(){
    const state = reactive({
        mobile: '15268174256',
        smsCode: '',
        smsTimer: null as Timer,
        smsText: '获取验证码',
        smsCount: sms.count,
        captchaShow: false,
    });
    // 点击获取验证码按钮
    function onSmsBtnClicked(){
        if(!state.mobile){
            Toast('请输入手机号');
            return ;
        }
        if(!isMobile(state.mobile)){
            Toast('手机号格式错误');
            return;
        }
        onSmsSend();
        // state.captchaShow = true;
    }

    // 发送验证码
    function onSmsSend(){
        API_USER.umsGetAuthCode({
            telephone: unref(state.mobile)
        }).then(()=>{
            Toast({
                message: '短信已发送，请查收',
                duration: 2000,
            })
        })
        countdown();
        state.smsTimer = setInterval(countdown, 1000);
    }


    function countdown() {
        if (state.smsCount > 0) {
          state.smsCount--;
          state.smsText = `已发送(${state.smsCount}s)`;
        } else {
          state.smsCount = sms.count;
          state.smsText = `重新发送`;
          clearInterval(Number(state.smsTimer));
          state.smsTimer = null;
        }
      }

    return {
        ...toRefs(state),
        onSmsBtnClicked,
        onSmsSend,
        countdown,
    };
}