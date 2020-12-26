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
import { getToken } from '../common/jwt.service'
import SingForm from '../components/SingForm.vue'
import { errorsMutations } from '../storeTypes/errors/mutations.types'
import { listenersActions } from '../storeTypes/listeners/actions.types'
import { authActions } from '../storeTypes/auth/actions.types'
const initialFormData = {
  email: '',
  password: '',
  username: '',
  avatar: '',
  repeat_password: '',
}
export default {
  name: 'SignUp',
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
    async register() {
      const success = await this.$store.dispatch(
        `auth/${authActions.REGISTER}`,
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
