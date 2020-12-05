<template>
  <sing-form title="Sign Up" :company-button-options="CompanyButtonOptions">
    <div slot="form-fields">
      <v-text-field label="User name" outlined></v-text-field>
      <v-text-field label="Email" outlined></v-text-field>
      <v-text-field label="password" type="password" outlined></v-text-field>
      <v-text-field
        label="Confirm Password"
        type="password"
        outlined
      ></v-text-field>
      <v-file-input label="Avatar"></v-file-input>
    </div>
    <div slot="form-actions">
      <v-btn text color="primary">Sign Up</v-btn>
      <v-btn text color="green" to="/signin">Already have account ?</v-btn>
    </div>
  </sing-form>
</template>

<script>
import SingForm from '../components/SingForm.vue'
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
    }
  },
}
</script>

<style></style>
