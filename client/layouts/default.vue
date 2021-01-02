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
      <v-container fluid>
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
import {
  CHAT_MESSAGE_SUPSRIBTION,
  FRIEND_REQUEST_ACCEPTED_SUPSRIBTION,
  FRIEND_REQUEST_SUPSRIBTION,
} from '../GraphQl/Subscriptions'
import { authActions } from '../storeTypes/auth/actions.types'
import { authMutations } from '../storeTypes/auth/mutations.types'
import { usersActions } from '../storeTypes/users/actions.types'
import { listenersMutations } from '../storeTypes/listeners/mutations.types'
import { messagesActions } from '../storeTypes/messages/actions.types'
import { listenersActions } from '../storeTypes/listeners/actions.types'

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
    // user: {
    //   query: LOGIN_FROM_TOKEN_QUERY,
    //   manual: true,
    //   result(res) {
    //     console.log(res)
    //     const user = res.data?.user
    //     this.$store.commit(`auth/${authMutations.LOGIN}`, { user })
    //     this.$store.commit(`auth/${authMutations.SET_LOADING}`, false)
    //   },
    //   error(err) {
    //     console.log(err)
    //     this.$store.commit(`auth/${authMutations.SET_LOADING}`, false)
    //   },
    // },
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
      OnFriendRequestAccepted: {
        query: FRIEND_REQUEST_ACCEPTED_SUPSRIBTION,
        result(data) {
          console.log(data)
          const newFriendRequestAccepted = data.data.friendRequestAccepted
          this.$store.commit(
            `auth/${authMutations.ADD_FRIEND}`,
            newFriendRequestAccepted.from
          )
        },
      },
      chatMessages: {
        query: CHAT_MESSAGE_SUPSRIBTION,
        result(data) {
          this.$store.dispatch(
            `messages/${messagesActions.NEW_MESSAGE_RECIEVED}`,
            data.data.chatMessages
          )
          this.$store.dispatch(
            `listeners/${listenersActions.CALL_MESSAGE_LISTENERS}`,
            data.data.chatMessages.from.id
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
    if (success) this.$router.push('/messanger')
  },
  methods: {
    refreshSub() {
      this.$apollo.subscriptions.OnFriendRequestRecieved.refresh()
      this.$apollo.subscriptions.OnFriendRequestAccepted.refresh()
      this.$apollo.subscriptions.chatMessages.refresh()
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
