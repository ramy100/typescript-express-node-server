import jwtService from '@/common/jwt.service'
import { loginWithTokenGql, logOut } from '../GraphQl/Queries'

export const state = () => ({
  errors: null,
  user: null,
  loading: false,
})

export const actions = {
  async loginWithToken(context, { apollo }) {
    try {
      context.commit('setLoading', true)
      const res = await loginWithTokenGql(apollo)
      const user = res.data?.user
      context.commit('login', { user })
    } catch (error) {
      context.commit('setLoading', false)
    }
  },
  async logOut(context, { apollo }) {
    try {
      context.commit('setLoading', true)
      const res = await logOut(apollo)
      if (res.data?.logout) {
        context.commit('loggedOut')
      }
    } catch (error) {
      context.commit('setLoading', false)
    }
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
    state.user = null
    state.loading = false
  },
}
