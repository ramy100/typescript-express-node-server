import Vue from 'vue'
import { listenersActions } from '../../storeTypes/listeners/actions.types'
import { listenersMutations } from '../../storeTypes/listeners/mutations.types'

const getDefaultState = () => {
  return {
    Sublist: [],
    messageRecieved: {},
  }
}

export const state = getDefaultState()

export const actions = {
  [listenersActions.CALL_SUB_LISTENERS](context) {
    context.state.Sublist.forEach((listener) => {
      listener()
    })
  },
  [listenersActions.CALL_MESSAGE_LISTENERS](context, friendId) {
    if (context.state.messageRecieved[friendId])
      context.state.messageRecieved[friendId]()
  },
}

export const mutations = {
  [listenersMutations.ADD_SUB_LISTENERS](state, payload) {
    state.Sublist.push(payload)
  },
  [listenersMutations.ADD_MESSAGE_LISTENERS](state, { friendId, listener }) {
    state.messageRecieved[friendId] = listener
  },
  [listenersMutations.REMOVE_MESSAGE_LISTENERS](state, { friendId }) {
    Vue.delete(state.messageRecieved, friendId)
  },
}
