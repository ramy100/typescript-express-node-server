<template>
  <v-app>
    <v-overlay :value="loadingUSer" title="">
      <v-progress-circular indeterminate size="64"
        ><v-icon>mdi-lock</v-icon></v-progress-circular
      >
      <p class="mt-5">Logging in</p>
    </v-overlay>
    <nav-bar />
    <v-main>
      <v-container>
        <transition name="fade">
          <nuxt />
        </transition>
      </v-container>
    </v-main>
    <app-footer />
  </v-app>
</template>

<script>
import AppFooter from '../components/AppFooter.vue'
import NavBar from '../components/NavBar.vue'
import { getToken } from '../common/jwt.service'
export default {
  components: { NavBar, AppFooter },
  data() {
    return {
      clipped: false,
      drawer: false,
      fixed: false,
      items: [
        {
          icon: 'mdi-apps',
          title: 'Welcome',
          to: '/',
        },
        {
          icon: 'mdi-chart-bubble',
          title: 'Inspire',
          to: '/inspire',
        },
      ],
      miniVariant: false,
      right: true,
      rightDrawer: false,
      title: 'Vuetify.js',
    }
  },
  computed: {
    loadingUSer() {
      return this.$store.state.auth.loading
    },
    user() {
      return this.$store.state.auth.user
    },
  },
  created() {
    if (getToken())
      this.$store.dispatch('auth/loginWithToken', { apollo: this.$apollo })
  },
}
</script>

<style lang="scss" scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 1s;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>
