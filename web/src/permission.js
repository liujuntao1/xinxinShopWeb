import router from './router'
import store from './store'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import {getToken} from '@/utils/auth' // get token from cookie
import getPageTitle from '@/utils/get-page-title'
import {Message} from 'element-ui'

NProgress.configure({showSpinner: false}) // NProgress Configuration

const whiteList = ['/login']

router.beforeEach(async (to, from, next) => {
  // start progress bar
  NProgress.start()

  // set page title
  document.title = getPageTitle(to.meta.title)

  // determine whether the user has logged in
  const hasToken = getToken()
  if (hasToken) {
    if (to.path === '/login') {
      // if is logged in, redirect to the home page
      next({path: '/'})
      NProgress.done() // hack: https://github.com/PanJiaChen/vue-element-admin/pull/2939
    } else {
      if (store.getters.roles.length === 0) {
        store.dispatch('user/getInfo').then((res) => {
          const {menu}=res// 拉取用户信息
          store.dispatch('permission/getMenuRouterList',{menu}).then(() => {
            router.addRoutes(store.getters.addRouters); // 动态添加可访问路由表
            next({...to, replace: true})
          })
        }).catch((err) => {
          store.dispatch('user/resetToken').then(() => {
            Message.error(err || 'Verification failed, please login again')
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
