import { REGISTER_MUTATION } from './Mutations'
export const register = async (vueObject, formData) => {
  return await vueObject.$apollo.mutate({
    mutation: REGISTER_MUTATION,
    variables: {
      email: formData.email,
      repeat_password: formData.repeat_password,
      username: formData.username,
      password: formData.password,
    },
  })
}
