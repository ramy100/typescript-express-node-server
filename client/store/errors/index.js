import { errorsMutations } from '../../storeTypes/errors/mutations.types'
const getDefaultState = () => {
  return {
    formErrors: {},
  }
}

export const state = getDefaultState()

export const mutations = {
  [errorsMutations.SET_ERROR](state, payload) {
    state.formErrors = payload
  },
  [errorsMutations.CLEAR_ERRORS](state) {
    Object.assign(state, getDefaultState())
  },
}
