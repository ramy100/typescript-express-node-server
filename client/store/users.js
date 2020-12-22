import { sendFriendRequest } from '~/GraphQl/Mutations'

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
