import {createStore} from 'vuex'
// import createPersistedState from 'vuex-persistedstate';

import user from './modules/user'
import permission from './modules/permission'
import getters from './getter'


const store = createStore({
    state: {
    },
    getters: {
        ...getters
    },
    mutations: {

    },
    actions: {
        // setToken(context, value){
        //     context.commit('SET_TOKEN', value)
        // },
        // removeToken(context){
        //     context.commit('SET_TOKEN', '')
        // }
    },
    modules:{
        user,
        permission
    },
    plugins: [
        // createPersistedState({
        //     key: 'erabbit-client-pc-store',
        //     paths: ['token', 'tokenHead'],
        //     storage: {
        //         getItem: key => Cookies.get(key),
        //         setItem: (key, value) => Cookies.set(key, value, { expires: 7 }),
        //         removeItem: key => Cookies.remove(key)
        //     }
        // }),
    ]

})

export default store