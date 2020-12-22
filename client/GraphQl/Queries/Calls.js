import {
  LOGIN_QUERY,
  LOGIN_FROM_TOKEN_QUERY,
  LOGOUT_USER_QUERY,
  GET_USERS_QUERY,
} from './Queries'

export async function loginWithEmailAndPasswordGql(apollo, formData) {
  return await apollo.query({
    query: LOGIN_QUERY,
    variables: {
      email: formData.email,
      password: formData.password,
    },
  })
}

export async function loginWithTokenGql(apollo) {
  return await apollo.query({
    query: LOGIN_FROM_TOKEN_QUERY,
  })
}

export async function logOut(apollo) {
  return await apollo.query({
    query: LOGOUT_USER_QUERY,
  })
}

export async function findFriends(apollo, pageNum) {
  return await apollo.query({
    query: GET_USERS_QUERY,
    variables: {
      pageNum,
    },
  })
}
