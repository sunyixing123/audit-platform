const getters = {
  sidebar: state => state.app.sidebar,
  visitedViews: state => state.app.visitedViews,

  username: state => state.user.username,
  nickname: state => state.user.nickname,
  userId: state => state.user.userId,
  roleIds: state => state.user.roleIds,
  menus: state => state.user.menus,
  permissions: state => state.user.permissions,

  permission_routers: state => state.permission.routers,
  addRouters: state => state.permission.addRouters
}
export default getters
