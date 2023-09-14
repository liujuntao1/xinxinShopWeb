import {constantRoutes} from '@/router'
import {getMenuRouterList} from '@/api/menu'
import Layout from '@/layout'

/**
 * Use meta.role to determine if the current user has permission
 * @param roles
 * @param route
 */
function hasPermission(roles, route) {
  if (route.meta && route.meta.roles) {
    return roles.some(role => route.meta.roles.includes(role))
  } else {
    return true
  }
}

/**
 * Filter asynchronous routing tables by recursion
 * @param routes asyncRoutes
 * @param roles
 */
export function filterAsyncRoutes(routes) {
  const res = []
  routes.forEach(route => {
    const tmp = {...route}
    //动态找到页面路径
    const component = tmp.component
    if (route.component) {
      //判断是否是一级菜单
      if (component == 'Layout') {
        tmp.component = Layout
      } else {
        tmp.component = (resolve) => require([`@/views${component}`], resolve)
      }
    }
    if (tmp.children) {
      tmp.children = filterAsyncRoutes(tmp.children)
    }
    res.push(tmp)
  })
  return res
}

const state = {
  routers: constantRoutes,
  addRouters: []
}

const mutations = {
  SET_ROUTERS: (state, routes) => {
    state.addRouters = routes
    state.routers = constantRoutes.concat(routes)
  }
}

const actions = {
  //静态路由
  /*  GenerateRoutes({commit}, data) {
      return new Promise(resolve => {
        const {menus} = data;
        const accessedRouters = asyncRoutes.filter(v => {
          if (hasPermission(menus, v)) {
            if (v.children && v.children.length > 0) {
              v.children = v.children.filter(child => {
                if (hasPermission(menus, child)) {
                  return child
                }
                return false;
              });
              return v
            } else {
              return v
            }
          }
          return false;
        });
        sortRouters(accessedRouters);
        commit('SET_ROUTERS', accessedRouters);
        resolve();
      })
    },*/
  // 动态获取用户菜单路由
  getMenuRouterList({commit}) {
    return new Promise((resolve, reject) => {
      getMenuRouterList().then((res) => {
        //把返回的数据存到vuex里面
        const menus = res.data;
        const accessedRouters = filterAsyncRoutes(menus)
        commit('SET_ROUTERS', accessedRouters)
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },
}

//对菜单进行排序
function sortRouters(accessedRouters) {
  for (let i = 0; i < accessedRouters.length; i++) {
    let router = accessedRouters[i];
    if (router.children && router.children.length > 0) {
      router.children.sort(compare("sort"));
    }
  }
  accessedRouters.sort(compare("sort"));
}

//降序比较函数
function compare(p) {
  return function (m, n) {
    let a = m[p];
    let b = n[p];
    return b - a;
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
