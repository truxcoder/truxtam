import { asyncRoutes, constantRoutes, componentList } from '@/router'
import { getModuleList } from '@/api/module'
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
export function filterAsyncRoutes(routes, roles) {
  const res = []

  routes.forEach(route => {
    const tmp = { ...route }
    if (hasPermission(roles, tmp)) {
      if (tmp.children) {
        tmp.children = filterAsyncRoutes(tmp.children, roles)
      }
      res.push(tmp)
    }
  })

  return res
}

const state = {
  routes: [],
  addRoutes: [],
  originRoutes: [] 
}

const mutations = {
  SET_ROUTES: (state, routes) => {
    state.addRoutes = routes
    state.routes = constantRoutes.concat(routes)
  },
  SET_ORIGIN_ROUTES: (state, routes) => {
    state.originRoutes = routes
  }
}

const actions = {
  async getOriginRoutes({ commit, state}, roles) {
    let response = await getModuleList({})
    let moduleList = response.data
    let superModules = moduleList.filter(item =>item.rank === 1)
    let subModules = moduleList.filter(item => item.rank === 2)
    superModules = superModules.map(item => {
      let { id, path, redirect, name, title, icon, ...rest } = item
      let children = subModules.filter( item => item.parent === id)
      children = children.map(item => {
        let { path, name, component, title, icon, ...rest} = item
        return {
          path, name, component: componentList[component],
          meta: { title, icon, roles: ['admin']}
        }
      })
      return {
        path,
        component: Layout,
        redirect,
        name,
        meta: { title, icon, roles: ['admin'] },
        children
      }
    })
    let result = superModules.concat(asyncRoutes)
    return new Promise(resolve => {
      let accessedRoutes
      console.log('result', result)
      if (roles.includes('admin')) {
        accessedRoutes = result || []
      } else {
        accessedRoutes = filterAsyncRoutes(result , roles)
      }
      console.log('accessedRoutes:', accessedRoutes)
      commit('SET_ROUTES', accessedRoutes)
      resolve(accessedRoutes)
    })  

    // return getModuleList({}).then(response => {
    //   let moduleList = response.data
    //   let superModules = moduleList.filter(item =>item.rank === 1)
    //   let subModules = moduleList.filter(item => item.rank === 2)
    //   superModules = superModules.map(item => {
    //     let { id, path, redirect, name, title, icon, ...rest } = item
    //     let children = subModules.filter( item => item.parent === id)
    //     children = children.map(item => {
    //       let { path, name, component, title, icon, ...rest} = item
    //       return {
    //         path, name, component: componentList[component],
    //         meta: { title, icon, roles: ['admin']}
    //       }
    //     })
    //     return {
    //       path,
    //       component: Layout,
    //       redirect,
    //       name,
    //       meta: { title, icon, roles: ['admin'] },
    //       children
    //     }
    //   })
    //   let result = superModules.concat(asyncRoutes)
    //   // commit('SET_ORIGIN_ROUTES', result)
    //   // return result
    //   let accessedRoutes
    //   console.log('state.originRoutes', state.originRoutes)
    //   if (roles.includes('admin')) {
    //     accessedRoutes = result || []
    //   } else {
    //     accessedRoutes = filterAsyncRoutes(result, roles)
    //   }
    //   console.log('accessedRoutes:', accessedRoutes)
    //   commit('SET_ROUTES', accessedRoutes)
    //   Promise.resolve(accessedRoutes)
    // })
  },
  generateRoutes({ commit,state }, roles) {
  // generateRoutes({ commit }, roles) {
    // getModuleList({}).then(response => {
    //   let moduleList = response.data
    //   let superModules = moduleList.filter(item =>item.rank === 1)
    //   let subModules = moduleList.filter(item => item.rank === 2)
    //   superModules = superModules.map(item => {
    //     let { id, path, redirect, name, title, icon, ...rest } = item
    //     let children = subModules.filter( item => item.parent === id)
    //     children = children.map(item => {
    //       let { path, name, component, title, icon, ...rest} = item
    //       return {
    //         path, name, component: componentList[component],
    //         meta: { title, icon, roles: ['admin']}
    //       }
    //     })
    //     return {
    //       path,
    //       component: Layout,
    //       redirect,
    //       name,
    //       meta: { title, icon, roles: ['admin'] },
    //       children
    //     }
    //   })
    //   console.log("asysncrouters:",asyncRoutes)
    //   console.log("superModules:",superModules)
    //   return superModules.concat(asyncRoutes)
    // }).then( newAsyncRoutes => {
    //   console.log(newAsyncRoutes)
    //   let accessedRoutes
    //   if (roles.includes('admin')) {
    //     accessedRoutes = newAsyncRoutes || []
    //   } else {
    //     accessedRoutes = filterAsyncRoutes(newAsyncRoutes, roles)
    //   }
    //   commit('SET_ROUTES', accessedRoutes)
    //   console.log('accessedRoutes:', accessedRoutes)
    //   return Promise.resolve(accessedRoutes)
    // })
    return new Promise(resolve => {
      let accessedRoutes
      console.log('state.originRoutes', state.originRoutes)
      if (roles.includes('admin')) {
        accessedRoutes = state.originRoutes || []
      } else {
        accessedRoutes = filterAsyncRoutes(state.originRoutes, roles)
      }
      console.log('accessedRoutes:', accessedRoutes)
      commit('SET_ROUTES', accessedRoutes)
      resolve(accessedRoutes)
    })

    // return new Promise(resolve => {
    //   let accessedRoutes
    //   if (roles.includes('admin')) {
    //     accessedRoutes = asyncRoutes || []
    //   } else {
    //     accessedRoutes = filterAsyncRoutes(asyncRoutes, roles)
    //   }
    //   commit('SET_ROUTES', accessedRoutes)
    //   resolve(accessedRoutes)
    // })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}