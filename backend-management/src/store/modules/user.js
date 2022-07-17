import {getInfo, login, logout} from '@/api/login'
import {getToken, setToken, removeToken} from '@/utils/cookies'


const user = {
    state: {
        name: '',
        roles: [],
        avatar: '',
        token: getToken(),
    },
    mutations:{
        SET_ROLES(state, roles){
            state.roles = roles
        },
        SET_NAME: (state, name) => {
            state.name = name
          },
        SET_AVATAR: (state, avatar) => {
            state.avatar = avatar
        },
        SET_TOKEN(state, {token, tokenHead}){
            state.token = tokenHead + token;
        },
    },
    actions:{
        // 登录设置token
        async Login({commit}, {username, password}){
            try{
                const {data} = await login({username, password});
                setToken(data.tokenHead +data.token);
                commit('SET_TOKEN', data);
                return data
            }catch(error){
                console.log(error);
            }
        },
        // 获取用户信息
        async GetInfo({commit}){
            try{
                const {data} = await getInfo();
                if(data.roles && data.roles.length > 0){
                    commit('SET_ROLES', data.roles);
                }else{
                    throw Error('role is null');
                }
                commit('SET_NAME', data.username);
                commit('SET_AVATAR', data.icon);
                return data
            }catch(error){
                console.log(error);
            }
        },

         // 登出
        FedLogOut({ commit }) {
            commit('SET_TOKEN', '')
            removeToken()
        },
        // 注销
        async LogOut({ commit, state }) {
            try{
                await logout(state.token)
                commit('SET_TOKEN', '')
                commit('SET_ROLES', [])
                removeToken()
            }catch(error){
                console.log(error);
            }
          },

    }
}

export default user