import { authMutations } from './auth/mutations.types'
import { usersMutations } from './users/mutations.types'
import { errorsMutations } from '~/store/errors/mutations.types'
export const state = () => ({})

export const actions = {
  resetStore(context) {
    context.commit(`auth/${authMutations.LOGGED_OUT}`)
    context.commit(`users/${usersMutations.RESET_USERS}`)
    context.commit(`errors/${errorsMutations.CLEAR_ERRORS}`)
  },
}
