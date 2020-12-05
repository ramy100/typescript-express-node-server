<template>
  <sing-form title="Log In" :company-button-options="CompanyButtonOptions">
    <div slot="form-fields">
      <v-text-field label="Email" outlined></v-text-field>
      <v-text-field label="password" type="password" outlined></v-text-field>
    </div>
    <div slot="form-actions">
      <v-btn text color="primary">Login</v-btn>
      <v-btn text color="green" to="/signup">Create new account</v-btn>
    </div>
  </sing-form>
</template>

<script>
import SingForm from '../components/SingForm.vue'
// import gql from "graphql-tag";

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
    }
  },
  methods: {},
}
</script>

<style></style>
