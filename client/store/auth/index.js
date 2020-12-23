import jwtService from '@/common/jwt.service'
import {
  loginWithEmailAndPasswordGql,
  loginWithTokenGql,
  logOut,
} from '../../GraphQl/Queries'
import { errorsMutations } from '../errors/mutations.types'
import { authMutations } from './mutations.types'
import { authActions } from './actions.types'
import { register } from '~/GraphQl/Mutations'

const getDefaultState = () => {
  return {
    user: null,
    loading: false,
  }
}

export const state = getDefaultState()

export const actions = {
  async [authActions.LOGIN_WITH_TOKEN](context) {
    try {
      context.commit(`${authMutations.SET_LOADING}`, true)
      const res = await loginWithTokenGql(this.app.apolloProvider.defaultClient)
      const user = res.data?.user
      context.commit(`${authMutations.LOGIN}`, { user })
      return true
    } catch (error) {
      context.commit(`${authMutations.SET_LOADING}`, false)
    }
  },
  async [authActions.REGISTER](context, formData) {
    try {
      context.commit(`${authMutations.SET_LOADING}`, true)
      const res = await register(
        this.app.apolloProvider.defaultClient,
        formData
      )
      const data = res.data?.register?.data
      context.commit(`${authMutations.LOGIN}`, {
        user: data.user,
        token: data.token,
      })
      context.commit(
        `errors/${errorsMutations.CLEAR_ERRORS}`,
        {},
        { root: true }
      )
      context.commit(`${authMutations.SET_LOADING}`, false)
      return true
    } catch (error) {
      const gqlError = error.graphQLErrors[0]?.message
      let errors
      if (gqlError) errors = JSON.parse(gqlError)
      context.commit(`errors/${errorsMutations.SET_ERROR}`, errors, {
        root: true,
      })
      context.commit(`${authMutations.SET_LOADING}`, false)
      return false
    }
  },
  async [authActions.LOGIN_WITH_EMAIL](context, formData) {
    context.commit(`${authMutations.SET_LOADING}`, true)
    try {
      const res = await loginWithEmailAndPasswordGql(
        this.app.apolloProvider.defaultClient,
        formData
      )
      const data = res.data?.login?.data
      context.commit(`${authMutations.LOGIN}`, {
        user: data.user,
        token: data.token,
      })
      context.commit(
        `errors/${errorsMutations.CLEAR_ERRORS}`,
        {},
        { root: true }
      )
      context.commit(`${authMutations.SET_LOADING}`, false)
      return true
    } catch (error) {
      const gqlError = error.graphQLErrors[0]?.message
      let errors
      if (gqlError) errors = JSON.parse(gqlError)
      context.commit(`errors/${errorsMutations.SET_ERROR}`, errors, {
        root: true,
      })
      context.commit(`${authMutations.SET_LOADING}`, false)
      return false
    }
  },
  async [authActions.LOGOUT](context) {
    try {
      context.commit(`${authMutations.SET_LOADING}`, true)
      const res = await logOut(this.app.apolloProvider.defaultClient)
      if (res.data?.logout) {
        context.dispatch('resetStore', {}, { root: true })
        return true
      }
    } catch (error) {
      context.commit(`${authMutations.SET_LOADING}`, false)
    }
  },
  [authActions.ADD_FRIEND](context, user) {
    context.commit(`${authMutations.REMOVE_FRIEND_REQUEST}`, user.id)
    context.commit(`${authMutations.ADD_FRIEND}`, user)
  },
}

export const mutations = {
  [authMutations.LOGIN](state, payload) {
    if (payload.token) jwtService.saveToken(payload.token)
    state.user = payload.user
    state.loading = false
  },
  [authMutations.SET_LOADING](state, payload) {
    state.loading = payload
  },
  [authMutations.LOGGED_OUT](state) {
    jwtService.destroyToken()
    Object.assign(state, getDefaultState())
  },
  [authMutations.PUSH_FRIEND_REQUEST](state, friendRequest) {
    state.user.friendRequests.push(friendRequest)
  },
  [authMutations.REMOVE_FRIEND_REQUEST](state, friendId) {
    state.user.friendRequests = state.user.friendRequests.filter(
      (friendRequest) => friendRequest.id !== friendId
    )
  },
  [authMutations.ADD_FRIEND](state, friend) {
    state.user.friends.push(friend)
  },
}
