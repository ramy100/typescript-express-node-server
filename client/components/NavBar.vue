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
          v-for="item in rightMenuItems"
          :key="item.title"
          :to="item.path"
        >
          <v-list-item-action>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-action>
          <v-list-item-content>{{ item.title }}</v-list-item-content>
        </v-list-item>
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
          v-for="item in rightMenuItems"
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
          v-for="item in leftMenuItems"
          :key="item.title"
          text
          :to="item.path"
        >
          {{ item.title }}
          <v-icon right>{{ item.icon }}</v-icon>
        </v-btn>
      </v-toolbar-items>
    </v-app-bar>
  </div>
</template>

<script lang="ts">
type route = {
  title: string
  path: string
  icon: string
}
type NavBarData = {
  appTitle: string
  sidebar: boolean
  rightMenuItems?: route[]
  leftMenuItems?: route[]
}
export default {
  data(): NavBarData {
    return {
      appTitle: 'Awesome App',
      sidebar: false,
      rightMenuItems: [{ title: 'Home', path: '/home', icon: 'mdi-home' }],
      leftMenuItems: [
        { title: 'Sign Up', path: '/signup', icon: 'mdi-face' },
        { title: 'Sign In', path: '/signin', icon: 'mdi-lock' },
      ],
    }
  },
}
</script>

<style></style>
