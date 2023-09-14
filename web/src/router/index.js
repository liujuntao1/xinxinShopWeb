import Vue from 'vue'
import Router from 'vue-router'
/* Layout */
import Layout from '@/layout'

/* Router Modules */

Vue.use(Router)

export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/error-page/404'),
    hidden: true
  },
  {
    path: '/401',
    component: () => import('@/views/error-page/401'),
    hidden: true
  },
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        component: () => import('@/views/dashboard/index'),
        name: 'Dashboard',
        meta: {title: '首页', icon: 'dashboard', affix: true}
      }
    ]
  },
  {
    path: '/profile',
    component: Layout,
    redirect: '/profile/index',
    hidden: true,
    children: [
      {
        path: 'index',
        component: () => import('@/views/profile/index'),
        name: 'Profile',
        meta: {title: '个人中心', icon: 'user', noCache: true}
      }
    ]
  },
  // 404 page must be placed at the end !!!
  {path: '*', redirect: '/404', hidden: true}
]

export const asyncRoutes = [
  {
    path: '/permission/',
    component: Layout,
    redirect: '/permission/page',
    alwaysShow: true,
    name: 'Permission',
    meta: {
      title: '权限管理',
      icon: 'el-icon-setting'
    },
    children: [
      {
        path: 'role',
        component: () => import('@/views/permission/role'),
        name: 'RolePermission',
        meta: {
          title: '角色管理',
          icon: 'el-icon-s-custom'
        }
      },
      {
        path: 'menu',
        component: () => import('@/views/permission/menu'),
        name: 'MenuPermission',
        meta: {
          title: '菜单管理',
          icon: 'el-icon-s-management'
        }
      },
      {
        path: '/permission/user/',
        component: () => import('@/views/permission/user'),
        name: 'UserPermission',
        meta: {
          title: '用户管理',
          icon: 'el-icon-user'
        }
      },
      {
        path: 'log',
        component: () => import('@/views/permission/log'),
        name: 'LogPermission',
        meta: {
          title: '日志管理',
          icon: 'el-icon-s-claim'
        }
      },
    ]
  },
  {
    path: '/product',
    component: Layout,
    redirect: '/product/page',
    alwaysShow: true,
    name: 'Product',
    meta: {
      title: '商品管理',
      icon: 'el-icon-potato-strips'
    },
    children: [
      {
        path: 'product',
        component: () => import('@/views/product/product'),
        name: 'ProductPermission',
        meta: {
          title: '商品列表'
        }
      },
    ]
  },
  {
    path: '/order',
    component: Layout,
    redirect: '/order/page',
    alwaysShow: true,
    name: 'Order',
    meta: {
      title: '订单管理',
      icon: 'el-icon-s-order'
    },
    children: [
      {
        path: 'order',
        component: () => import('@/views/order/order'),
        name: 'OrderPermission',
        meta: {
          title: '订单列表',
          icon: 'lock'
        }
      },
    ]
  },
  {
    path: '/statistics',
    component: Layout,
    redirect: '/statistics/page',
    alwaysShow: true,
    name: 'Statistics',
    meta: {
      title: '统计分析（待开发）',
      icon: 'el-icon-s-operation'
    },
    children: [
      {
        path: 'keyboard',
        component: () => import('@/views/statistics/keyboard'),
        name: 'keyboardPermission',
        meta: {
          title: '销量统计'
        }
      },
      {
        path: 'line',
        component: () => import('@/views/statistics/line'),
        name: 'linePermission',
        meta: {
          title: '订单统计'
        }
      },
      {
        path: 'mixChart',
        component: () => import('@/views/statistics/mix-chart'),
        name: 'mixChartPermission',
        meta: {
          title: '库存统计'
        }
      },
    ]
  },
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({y: 0}),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
