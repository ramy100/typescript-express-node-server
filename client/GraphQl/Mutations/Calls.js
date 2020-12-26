import {
  REGISTER,
  SEND_FRIEND_REQUEST,
  ACCEPT_FRIEND_REQUEST,
  SEND_MESSAGE,
} from './Mutations'

export const register = async (apollo, formData) => {
  return await apollo.mutate({
    mutation: REGISTER,
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
    mutation: SEND_FRIEND_REQUEST,
    variables: {
      friendId,
    },
  })
}

export const acceptFriendRequest = async (apollo, friendId) => {
  return await apollo.mutate({
    mutation: ACCEPT_FRIEND_REQUEST,
    variables: {
      friendId,
    },
  })
}

export const sendMessage = async (apollo, { friendId, content }) => {
  return await apollo.mutate({
    mutation: SEND_MESSAGE,
    variables: {
      friendId,
      content,
    },
  })
}
