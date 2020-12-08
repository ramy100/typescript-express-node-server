import { LOGIN_QUERY } from './Queries'

export async function login(vueObject, formData) {
  return await vueObject.$apollo.query({
    query: LOGIN_QUERY,
    variables: {
      email: formData.email,
      password: formData.password,
    },
  })
}
