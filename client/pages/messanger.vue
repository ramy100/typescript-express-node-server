<template>
  <div>
    <v-navigation-drawer absolute right permanent expand-on-hover>
      <v-list>
        <v-list-item class="px-2">
          <v-list-item-avatar>
            <v-img
              src="https://randomuser.me/api/portraits/women/84.jpg"
            ></v-img>
          </v-list-item-avatar>
        </v-list-item>

        <v-list-item v-if="user" link>
          <v-list-item-content>
            <v-list-item-title class="title">
              {{ user.username }}
            </v-list-item-title>
            <v-list-item-subtitle>{{ user.email }}</v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
      </v-list>
      <v-divider></v-divider>
      <v-list nav dense>
        <users-list v-if="user"></users-list>
      </v-list>
    </v-navigation-drawer>
    <friend-list></friend-list>
    <v-container id="openChats">
      <!-- <open-chat></open-chat> -->
      <open-chat
        v-for="chat in openChats"
        :key="chat.friendId"
        :chat="chat"
      ></open-chat>
    </v-container>
  </div>
</template>

<script>
import FriendList from '../components/friendList.vue'
import OpenChat from '../components/OpenChat.vue'
import UsersList from '../components/UsersList.vue'
export default {
  components: { UsersList, FriendList, OpenChat },
  middleware: 'auth',
  data() {
    return {
      showFindFriends: false,
    }
  },
  computed: {
    user() {
      return this.$store.state.auth.user
    },
    openChats() {
      return this.$store.getters['messages/openChats']
    },
  },
}
</script>

<style scoped>
#openChats {
  height: 75vh;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}
</style>
