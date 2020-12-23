import {
  REGISTER_MUTATION,
  SEND_FRIEND_REQUEST_MUTATION,
  ACCEPT_FRIEND_REQUEST_MUTATION,
} from './Mutations'

export const register = async (apollo, formData) => {
  return await apollo.mutate({
    mutation: REGISTER_MUTATION,
    variables: {
      email: formData.email,
      repeat_password: formData.repeat_password,
      username: formData.username,
      password: formData.password,
    },
  })
}

export const sendFriendRequest = async (apollo, friendId) => {
  return await apollo.mutate({
    mutation: SEND_FRIEND_REQUEST_MUTATION,
    variables: {
      friendId,
    },
  })
}

export const acceptFriendRequest = async (apollo, friendId) => {
  return await apollo.mutate({
    mutation: ACCEPT_FRIEND_REQUEST_MUTATION,
    variables: {
      friendId,
    },
  })
}
