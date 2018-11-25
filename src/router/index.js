import Login from '../pages/Login'
import Register from '../pages/Register'
import Home from '../pages/Home'
import Favorites from '../pages/Favorites'
import MyFavorites from '../pages/MyFavorites'
import Search from '../pages/Search'

import Vue from 'vue'
import Router from 'vue-router'
Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/login',
      component: Login,
      name: '',
      hidden: true
    },
    {
      path: '/register',
      component: Register,
      name: '',
      hidden: true
    },
    {
      path: '/home',
      component: Home,
      name: '',
      hidden: true
    },
    {
      path: '/favorites',
      component: Favorites,
      name: '',
      hidden: true
    },
    {
      path: '/myfavorites',
      component: MyFavorites,
      name: '',
      hidden: true
    },
    {
      path: '/search',
      component: Search,
      name: 'search',
      hidden: true
    }
  ]
})
