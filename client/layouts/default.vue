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
import { FRIEND_REQUEST_SUPSRIBTION } from '../GraphQl/Subscriptions'
import { authActions } from '~/store/auth/actions.types'
import { usersActions } from '../store/users/actions.types'
import { listenersMutations } from '../store/listeners/mutations.types'

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
  apollo: {
    $subscribe: {
      OnFriendRequestRecieved: {
        query: FRIEND_REQUEST_SUPSRIBTION,
        result(data) {
          const newFriendRequest = data.data.friendRequestRecieved
          this.$store.dispatch(
            `users/${usersActions.FRIEND_REQUEST_RECIEVED}`,
            newFriendRequest.from
          )
        },
      },
    },
  },
  async created() {
    let success
    this.$store.commit(
      `listeners/${listenersMutations.ADD_SUB_LISTENERS}`,
      this.refreshSub
    )
    if (getToken() && !this.$store.state.auth.user) {
      success = await this.$store.dispatch(
        `auth/${authActions.LOGIN_WITH_TOKEN}`
      )
    }
    if (success) this.$router.push('/chat')
  },
  methods: {
    refreshSub() {
      this.$apollo.subscriptions.OnFriendRequestRecieved.refresh()
    },
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
