import Vue from 'vue'
import { authMutations } from '../../storeTypes/auth/mutations.types'
import { usersMutations } from '../../storeTypes/users/mutations.types'
import { usersActions } from '../../storeTypes/users/actions.types'
import { sendFriendRequest, acceptFriendRequest } from '~/GraphQl/Mutations'
import { authActions } from '~/storeTypes/auth/actions.types'
const getDefaultState = () => {
  return {
    nonFriends: {},
    hasMore: true,
    pageNum: 0,
  }
}

export const state = getDefaultState()

export const actions = {
  // [usersActions.SEND_FRIEND_REQUEST]
  async [usersActions.SEND_FRIEND_REQUEST](context, userId) {
    try {
      const res = await sendFriendRequest(
        this.app.apolloProvider.defaultClient,
        userId
      )
      if (res.data.sendFriendRequest.success)
        context.commit(`${usersMutations.REMOVE_FROM_USERS}`, userId)
      return res.data.sendFriendRequest
    } catch (error) {
      return false
    }
  },
  async [usersActions.ACCEPT_FRIEND_REQUEST](context, user) {
    try {
      const res = await acceptFriendRequest(
        this.app.apolloProvider.defaultClient,
        user.id
      )
      if (res.data.acceptFriendRequest.success) {
        context.dispatch(`auth/${authActions.ADD_FRIEND}`, user, {
          root: true,
        })
      }
      return res.data.acceptFriendRequest
    } catch (error) {
      return error
    }
  },
  [usersActions.FRIEND_REQUEST_RECIEVED](context, friendRequest) {
    context.commit(`auth/${authMutations.PUSH_FRIEND_REQUEST}`, friendRequest, {
      root: true,
    })
  },
}

export const getters = {
  filteredUsers: (state) => (friendRequests) => {
    const filteredObj = { ...state.nonFriends }
    friendRequests.forEach((request) => {
      delete filteredObj[request.id]
    })
    return Object.values(filteredObj)
  },
}

export const mutations = {
  [usersMutations.PUSH_TO_USERS](state, newFetchedUsers) {
    newFetchedUsers.forEach((user) => {
      Vue.set(state.nonFriends, user.id, user)
    })
  },
  [usersMutations.REMOVE_FROM_USERS](state, userId) {
    Vue.delete(state.nonFriends, userId)
  },
  [usersMutations.SET_HAS_MORE](state, payload) {
    state.hasMore = payload
  },
  [usersMutations.INCREASE_PAGENUM](state) {
    state.pageNum++
  },
  [usersMutations.RESET_USERS](state) {
    Object.assign(state, getDefaultState())
  },
}
