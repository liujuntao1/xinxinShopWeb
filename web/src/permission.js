import router from './router'
import store from './store'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import {getToken} from '@/utils/auth' // get token from cookie
import getPageTitle from '@/utils/get-page-title'
import {Message} from 'element-ui'

NProgress.configure({showSpinner: false}) // NProgress Configuration
// 免登录白名单
const whiteList = ['/login']

router.beforeEach(async (to, from, next) => {
  // start progress bar
  NProgress.start();

  // set page title
  document.title = getPageTitle(to.meta.title)

  // determine whether the user has logged in
  const hasToken = getToken()
  if (hasToken) {
    if (to.path === '/login') {
      // 如果已经登录, 重定向至首页
      next({path: '/'})
      NProgress.done() // hack: https://github.com/PanJiaChen/vue-element-admin/pull/2939
    } else {
      if (store.getters.roles.length === 0) {
        store.dispatch('user/getInfo').then((res) => {
          const {menu} = res// 静态路由使用-拉取用户信息
          store.dispatch('permission/generateTrendsRouter', {menu}).then(() => {
            router.addRoutes(store.getters.addRouters); // 将后台返回菜单动态添加至路由数组
            next({...to, replace: true})
          })
        }).catch((err) => {
          store.dispatch('user/resetToken').then(() => {
            Message.error(err || '认证失败，请重新登录！')
            next({path: '/'})
          })
        })
      } else {
        next()
      }
    }
  } else {
    if (whiteList.indexOf(to.path) !== -1) {
      next()
    } else {
      next(`/login?redirect=${to.path}`)
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  // finish progress bar
  NProgress.done()
})
