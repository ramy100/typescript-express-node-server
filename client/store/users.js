export const state = {
  nonFriends: [],
}

export const mutations = {
  addUsers(state, users) {
    state.nonFriends.concat(users)
  },
}
