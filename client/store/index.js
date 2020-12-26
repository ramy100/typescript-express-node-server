import { authMutations } from '../storeTypes/auth/mutations.types'
import { usersMutations } from '../storeTypes/users/mutations.types'
import { errorsMutations } from '~/storeTypes/errors/mutations.types'
import { messagesMutations } from '~/storeTypes/messages/mutations.types'
export const state = () => ({})

export const actions = {
  resetStore(context) {
    context.commit(`auth/${authMutations.LOGGED_OUT}`)
    context.commit(`users/${usersMutations.RESET_USERS}`)
    context.commit(`errors/${errorsMutations.CLEAR_ERRORS}`)
    context.commit(`messages/${messagesMutations.RESET_NEW_MESSAGE}`)
  },
}
