const getDefaultState = () => {
  return {
    formErrors: {},
  }
}

export const state = getDefaultState()

export const mutations = {
  setErrors(state, payload) {
    state.formErrors = payload
  },
  clearErrors(state) {
    Object.assign(state, getDefaultState())
  },
}
