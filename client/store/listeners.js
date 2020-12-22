const getDefaultState = () => {
  return {
    Sublist: [],
  }
}

export const state = getDefaultState()

export const actions = {
  callSubListeners(context) {
    context.state.Sublist.forEach((listener) => {
      listener()
    })
  },
}

export const mutations = {
  addSubListener(state, payload) {
    state.Sublist.push(payload)
  },
}
