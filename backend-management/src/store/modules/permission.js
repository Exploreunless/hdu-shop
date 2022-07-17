import {constantRouterMap, asyncRouterMap} from "@/router"

const hasPermission = function(menus, route){
    if(route.name){
        let menu = menus.find(item => item.name===route.name);
        if(menu){
            route.title = menu.title || route.title;
            route.icon = menu.icon || route.icon;
            route.hidden = menu.hidden || route.hidden;
            route.sort = menu.sort || route.sort;
            return true;
        }else{
            return route.hidden === true ? true : false;
        }
    }else{
        return true
    }
}

const permission = {
    
    state: {
        routes: constantRouterMap,
        dynamicRoutes: []
    }, 
    getters:{
        roleMenus(state){
            console.log(state.routes)
            return state.routes.filter((item)=>{
                if(item.hidden !== true && item.path !=='/'){
                    if(item.children && item.children.length>0){
                        item.children = item.children.filter((subItem)=>{
                            return subItem.hidden !== true;
                        })
                    }
                    return true;
                }else 
                    return false;
            })
        }
    },
    mutations:{
        ADD_ROUTES(state, routes){
            state.dynamicRoutes = routes;
            state.routes = constantRouterMap.concat(routes)
        }
    },
    actions:{
        async GenerateRoutes({commit}, data){
            try{
                const {menus} = data;
                const accessRoutes = asyncRouterMap.filter((item)=>{
                    if(hasPermission(menus, item)){
                        let children = item.children;
                        if(children && children.length > 0){
                            item.children = children.filter((subItem)=>{
                                return hasPermission(menus, subItem)
                            })
                        }
                        return true
                    }
                    else return false
                })
                commit('ADD_ROUTES', accessRoutes) 
            }catch(error){
                console.log(error);
            }
        }
    }
}

export default permission