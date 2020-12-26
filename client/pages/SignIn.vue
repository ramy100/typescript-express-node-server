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
import { getToken } from '../common/jwt.service'
import SingForm from '../components/SingForm.vue'
import { authActions } from '../storeTypes/auth/actions.types'
import { errorsMutations } from '../storeTypes/errors/mutations.types'
import { listenersActions } from '../storeTypes/listeners/actions.types'

const initialFormData = {
  email: '',
  password: '',
}
export default {
  name: 'SignIn',
  middleware: 'guest',
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
    }
  },
  computed: {
    errors() {
      return this.$store.state.errors.formErrors
    },
    loading() {
      return this.$store.state.auth.loading
    },
  },
  destroyed() {
    this.$store.commit(`errors/${errorsMutations.CLEAR_ERRORS}`)
  },
  methods: {
    async login() {
      const success = await this.$store.dispatch(
        `auth/${authActions.LOGIN_WITH_EMAIL}`,
        this.formData
      )
      if (success) {
        this.$apolloHelpers.onLogin(getToken())
        this.$store.dispatch(`listeners/${listenersActions.CALL_SUB_LISTENERS}`)
        this.$router.push('/')
      }
    },
  },
}
</script>

<style></style>
