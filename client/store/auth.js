import jwtService from '@/common/jwt.service'
import {
  loginWithEmailAndPasswordGql,
  loginWithTokenGql,
  logOut,
} from '../GraphQl/Queries'
import { register } from '~/GraphQl/Mutations'

const getDefaultState = () => {
  return {
    user: null,
    loading: false,
  }
}

export const state = getDefaultState()

export const actions = {
  async loginWithToken(context) {
    try {
      context.commit('setLoading', true)
      const res = await loginWithTokenGql(this.app.apolloProvider.defaultClient)
      const user = res.data?.user
      context.commit('login', { user })
      return true
    } catch (error) {
      context.commit('setLoading', false)
    }
  },
  async register(context, formData) {
    try {
      context.commit('setLoading', true)
      const res = await register(
        this.app.apolloProvider.defaultClient,
        formData
      )
      const data = res.data?.register?.data
      context.commit('login', { user: data.user, token: data.token })
      context.commit('errors/clearErrors', {}, { root: true })
      context.commit('setLoading', false)
      return true
    } catch (error) {
      const gqlError = error.graphQLErrors[0]?.message
      let errors
      if (gqlError) errors = JSON.parse(gqlError)
      context.commit('errors/setErrors', errors, { root: true })
      context.commit('setLoading', false)
      return false
    }
  },
  async loginWithUsernameAndPassword(context, formData) {
    context.commit('setLoading', true)
    try {
      const res = await loginWithEmailAndPasswordGql(
        this.app.apolloProvider.defaultClient,
        formData
      )
      const data = res.data?.login?.data
      context.commit('login', { user: data.user, token: data.token })
      context.commit('errors/clearErrors', {}, { root: true })
      context.commit('setLoading', false)
      return true
    } catch (error) {
      const gqlError = error.graphQLErrors[0]?.message
      let errors
      if (gqlError) errors = JSON.parse(gqlError)
      context.commit('errors/setErrors', errors, { root: true })
      context.commit('setLoading', false)
      return false
    }
  },
  async logOut(context) {
    try {
      context.commit('setLoading', true)
      const res = await logOut(this.app.apolloProvider.defaultClient)
      if (res.data?.logout) {
        context.dispatch('resetStore', {}, { root: true })
        return true
      }
    } catch (error) {
      context.commit('setLoading', false)
    }
  },
  newFriendAdded(context, user) {
    context.commit('removeFromfriendRequests', user.id)
    context.commit('addToFriends', user)
  },
}

export const mutations = {
  login(state, payload) {
    if (payload.token) jwtService.saveToken(payload.token)
    state.user = payload.user
    state.loading = false
  },
  setLoading(state, payload) {
    state.loading = payload
  },
  loggedOut(state) {
    jwtService.destroyToken()
    Object.assign(state, getDefaultState())
  },
  pushFriendRequest(state, friendRequest) {
    state.user.friendRequests.push(friendRequest)
  },
  removeFromfriendRequests(state, friendId) {
    state.user.friendRequests = state.user.friendRequests.filter(
      (friendRequest) => friendRequest.id !== friendId
    )
  },
  addToFriends(state, friend) {
    state.user.friends.push(friend)
  },
}
