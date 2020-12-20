<template>
  <div class="nav">
    <v-navigation-drawer
      v-model="sidebar"
      class="hidden-sm-and-up"
      app
      temporary
      hide-overlay
    >
      <v-list>
        <v-list-item
          v-for="item in leftMenuItems"
          :key="item.title"
          :to="item.path"
        >
          <v-list-item-action>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-action>
          <v-list-item-content>{{ item.title }}</v-list-item-content>
        </v-list-item>
        <v-list-item
          v-for="item in rightMenuItems"
          :key="item.title"
          :to="item.path"
        >
          <v-list-item-action>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-action>
          <v-list-item-content>{{ item.title }}</v-list-item-content>
        </v-list-item>
        <v-list-item v-if="user" @click="logOut">
          <v-list-item-action>
            <v-icon>mdi-exit-to-app</v-icon>
          </v-list-item-action>
          <v-list-item-content>Log Out</v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-app-bar app absolute>
      <span class="hidden-sm-and-up">
        <v-app-bar-nav-icon @click="sidebar = !sidebar"></v-app-bar-nav-icon>
      </span>
      <v-toolbar-title>
        <router-link to="/" tag="span" class="mr-3" style="cursor: pointer">
          <span>{{ appTitle }}</span>
        </router-link>
      </v-toolbar-title>

      <v-toolbar-items class="hidden-xs-only">
        <v-btn
          v-for="item in leftMenuItems"
          :key="item.title"
          text
          :to="item.path"
        >
          <v-icon left>{{ item.icon }}</v-icon>
          {{ item.title }}
        </v-btn>
      </v-toolbar-items>
      <v-spacer></v-spacer>
      <v-toolbar-items class="hidden-xs-only">
        <v-btn
          v-for="item in rightMenuItems"
          :key="item.title"
          text
          :to="item.path"
        >
          {{ item.title }}
          <v-icon right>{{ item.icon }}</v-icon>
        </v-btn>
        <v-btn v-if="user" text @click="logOut">
          Log Out
          <v-icon right>mdi-exit-to-app</v-icon>
        </v-btn>
      </v-toolbar-items>
    </v-app-bar>
  </div>
</template>

<script>
const rightAuthLinks = []
const leftAuthLinks = []
const guestRightLinks = [
  { title: 'Sign Up', path: '/signup', icon: 'mdi-face' },
  { title: 'Sign In', path: '/signin', icon: 'mdi-lock' },
]
const guestLeftLinks = [{ title: 'Home', path: '/home', icon: 'mdi-home' }]
export default {
  data() {
    return {
      appTitle: 'Awesome App',
      sidebar: false,
    }
  },
  computed: {
    user() {
      return this.$store.state.auth.user
    },
    leftMenuItems() {
      if (this.user) return leftAuthLinks
      else return guestLeftLinks
    },
    rightMenuItems() {
      if (this.user) return rightAuthLinks
      else return guestRightLinks
    },
  },
  methods: {
    logOut() {
      this.$store.dispatch('auth/logOut', { apollo: this.$apollo })
    },
  },
}
</script>

<style></style>
