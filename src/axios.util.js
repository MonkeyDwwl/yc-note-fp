import axios from 'axios'
import {BASE_HOST} from './constant'

let  AUTH_TOKEN = window.localStorage.getItem('token')
axios.defaults.baseURL = BASE_HOST

export const post = async (url, body) => {
  AUTH_TOKEN = window.localStorage.getItem('token')
  axios.defaults.headers.common['Authorization'] = AUTH_TOKEN
  return await axios.post(url, body)
      .then(function (response) {
        return response.data
      })
      .catch (function (error) {
        if (error.response) {
          return (error.response.data)
        }
      })
}

export const get = async (url) => {
  AUTH_TOKEN = window.localStorage.getItem('token')
  axios.defaults.headers.common['Authorization'] = AUTH_TOKEN
  return await axios.get(url)
    .then(function (response) {
      return response.data
    })
    .catch (function (error) {
      if (error.response) {
        return (error.response.data)
      }
    })
}
