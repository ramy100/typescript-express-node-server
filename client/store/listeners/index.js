import { listenersActions } from './actions.types'
import { listenersMutations } from './mutations.types'

const getDefaultState = () => {
  return {
    Sublist: [],
  }
}

export const state = getDefaultState()

export const actions = {
  [listenersActions.CALL_SUB_LISTENERS](context) {
    context.state.Sublist.forEach((listener) => {
      listener()
    })
  },
}

export const mutations = {
  [listenersMutations.ADD_SUB_LISTENERS](state, payload) {
    state.Sublist.push(payload)
  },
}
