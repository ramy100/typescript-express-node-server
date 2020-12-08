<template>
  <sing-form
    :loading="loading"
    title="Sign Up"
    :company-button-options="CompanyButtonOptions"
  >
    <div slot="form-fields">
      <v-alert v-if="errors.msg" border="top" color="red lighten-2" dark>
        {{ errors.msg }}
      </v-alert>
      <v-text-field
        v-model="formData.username"
        :error="!!errors.username"
        :rules="[errors.username || true]"
        label="User name"
        outlined
      ></v-text-field>
      <v-text-field
        v-model="formData.email"
        :error="!!errors.email"
        :rules="[errors.email || true]"
        label="Email"
        outlined
      ></v-text-field>
      <v-text-field
        v-model="formData.password"
        :error="!!errors.password"
        :rules="[errors.password || true]"
        label="password"
        type="password"
        outlined
      ></v-text-field>
      <v-text-field
        v-model="formData.repeat_password"
        :error="!!errors.repeat_password"
        :rules="[errors.repeat_password || true]"
        label="Confirm Password"
        type="password"
        outlined
      ></v-text-field>
      <v-file-input
        :error="!!errors.avatar"
        :rules="[errors.avatar || true]"
        label="Avatar"
      ></v-file-input>
    </div>
    <div slot="form-actions">
      <v-btn text color="primary" @click="register">Sign Up</v-btn>
      <v-btn text color="green" to="/signin">Already have account ?</v-btn>
    </div>
  </sing-form>
</template>

<script>
import SingForm from '../components/SingForm.vue'
import { register } from '../GraphQl/Mutations'
const initialFormData = {
  email: '',
  password: '',
  username: '',
  avatar: '',
  repeat_password: '',
}
export default {
  name: 'SignUp',
  components: { SingForm },
  data() {
    return {
      CompanyButtonOptions: [
        { icon: 'mdi-facebook', color: '#3b5998 ' },
        { icon: 'mdi-twitter', color: '#00acee ' },
        { icon: 'mdi-apple', color: 'black ' },
        { icon: 'mdi-github', color: 'black ' },
        { icon: 'mdi-linkedin', color: '#3f729b ' },
      ],
      formData: { ...initialFormData },
      errors: {},
      loading: false,
    }
  },
  methods: {
    async register() {
      this.loading = true
      try {
        const res = await register(this, this.formData)
        this.loading = false
        this.formData = { ...initialFormData }
        this.errors = {}
        console.log(res.data.register)
        return
      } catch (error) {
        const gqlError = error.graphQLErrors[0]?.message
        if (gqlError) this.errors = JSON.parse(gqlError)
        this.loading = false
      }
    },
  },
}
</script>

<style></style>
