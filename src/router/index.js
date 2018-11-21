import Login from '../components/Login'
import Register from '../components/Register'
import Home from '../components/Home'
import Favorites from '../components/Favorites'
import MyFavorites from '../components/MyFavorites'
import Search from '../components/Search'

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
