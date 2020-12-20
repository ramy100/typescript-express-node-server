<template>
  <div>
    <sing-form
      :loading="loading"
      title="Log In"
      :company-button-options="CompanyButtonOptions"
    >
      <div slot="form-fields">
        <v-alert v-if="errors.msg" border="top" color="red lighten-2" dark>
          {{ errors.msg }}
        </v-alert>
        <v-text-field
          v-model="formData.email"
          :error="!!errors.email"
          :rules="[errors.email || true]"
          label="Email"
          outlined
        ></v-text-field>
        <v-text-field
          v-model="formData.password"
          label="password"
          type="password"
          outlined
          :error="!!errors.password"
          :rules="[errors.password || true]"
        ></v-text-field>
      </div>
      <div slot="form-actions">
        <v-btn text color="primary" @click="login">Login</v-btn>
        <v-btn text color="green" to="/signup">Create new account</v-btn>
      </div>
    </sing-form>
  </div>
</template>

<script>
import SingForm from '../components/SingForm.vue'
import { loginWithEmailAndPasswordGql } from '../GraphQl/Queries'
const initialFormData = {
  email: '',
  password: '',
}
export default {
  name: 'SignIn',
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
  created() {
    console.log(this.$store.state.auth.isAuthenticated)
  },
  methods: {
    async login() {
      this.loading = true
      try {
        const res = await loginWithEmailAndPasswordGql(
          this.$apollo,
          this.formData
        )
        const data = res.data?.login?.data
        this.loading = false
        this.formData = { ...initialFormData }
        this.errors = {}
        this.$store.commit('auth/login', { user: data.user, token: data.token })
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
