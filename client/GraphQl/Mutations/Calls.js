import { REGISTER_MUTATION } from './Mutations'
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
