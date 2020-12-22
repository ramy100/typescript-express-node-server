export const state = () => ({
  formErrors: {},
})

export const mutations = {
  setErrors(state, payload) {
    state.formErrors = payload
  },
  clearErrors(state) {
    state.formErrors = {}
  },
}
