export const state = () => ({})

export const actions = {
  resetStore(context) {
    context.commit('auth/loggedOut')
    context.commit('users/clearUsersList')
    context.commit('errors/clearErrors')
  },
}
