import { sendFriendRequest, acceptFriendRequest } from '~/GraphQl/Mutations'

const getDefaultState = () => {
  return {
    nonFriends: [],
  }
}

export const state = getDefaultState()

export const actions = {
  async sendFriendRequest(context, userId) {
    try {
      const res = await sendFriendRequest(
        this.app.apolloProvider.defaultClient,
        userId
      )
      if (res.data.sendFriendRequest.success)
        context.commit('removeFromNonFriendsList', userId)
      return res.data.sendFriendRequest
    } catch (error) {
      return false
    }
  },
  async acceptFriendRequest(context, user) {
    try {
      const res = await acceptFriendRequest(
        this.app.apolloProvider.defaultClient,
        user.id
      )
      if (res.data.acceptFriendRequest.success) {
        context.dispatch('auth/newFriendAdded', user, { root: true })
      }
      return res.data.acceptFriendRequest
    } catch (error) {
      return error
    }
  },
  friendRequestRecieved(context, friendRequest) {
    context.commit('removeFromNonFriendsList', friendRequest.id)
    context.commit('auth/pushFriendRequest', friendRequest, {
      root: true,
    })
  },
}

export const mutations = {
  pushToUsers(state, payload) {
    state.nonFriends = [...state.nonFriends, ...payload]
  },
  removeFromNonFriendsList(state, userId) {
    const newList = state.nonFriends.filter((user) => user.id !== userId)
    state.nonFriends = newList
  },
  clearUsersList(state) {
    Object.assign(state, getDefaultState())
  },
}
