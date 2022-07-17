const getters = {
    token: state => state.user.token,
    avatar: state => state.user.avatar,
    name: state => state.user.name,
    roles: state => state.user.roles,
    dynamicRoutes: state => state.permission.dynamicRoutes,
    routes: state => state.permission.routes
  }

  export default getters