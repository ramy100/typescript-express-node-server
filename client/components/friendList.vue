<template>
  <v-navigation-drawer v-if="friends.length" absolute left permanent>
    <v-list>
      <v-list-item
        v-for="friend in friends"
        :key="friend.id"
        link
        @click="openChat(friend.id)"
      >
        <v-badge
          bordered
          color="red accent-4"
          content="Open"
          :value="!!isOpenn(friend.id)"
          overlap
        >
          <v-badge
            bordered
            bottom
            color="deep-purple accent-4"
            :content="newMessages(friend.id)"
            :value="newMessages(friend.id)"
            offset-x="24"
            offset-y="24"
          >
            <v-list-item-avatar>
              <v-avatar>
                <v-img
                  src="https://cdn.vuetifyjs.com/images/lists/2.jpg"
                ></v-img>
              </v-avatar>
            </v-list-item-avatar>
          </v-badge>
        </v-badge>

        <v-list-item-content>
          <v-list-item-title v-text="friend.email"></v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>

<script>
import { messagesActions } from '../storeTypes/messages/actions.types'
import { messagesMutations } from '../storeTypes/messages/mutations.types'
export default {
  data() {
    return {}
  },
  computed: {
    friends() {
      return this.$store.getters['auth/friends']
    },
    chat() {
      return (friendId) => this.$store.state.messages.chat[friendId]
    },
    isOpenn() {
      return (friendId) => this.$store.state.messages.chat[friendId]?.isOpen
    },
    focused() {
      return this.$store.state.messages.chat.focused
    },
    newMessages() {
      return (userId) =>
        this.$store.state.messages.newMessages[userId]?.count || 0
    },
  },
  methods: {
    async openChat(friendId) {
      if (!this.chat(friendId)) {
        this.$store.commit(
          `messages/${messagesMutations.CLEAR_NOTIFICATIONS}`,
          friendId
        )
        await this.$store.dispatch(
          `messages/${messagesActions.READ_CHAT}`,
          friendId
        )
        this.$store.commit(
          `messages/${messagesMutations.TOGGLE_FOCUS}`,
          friendId
        )
      } else {
        if (this.chat(friendId).isOpen) {
          this.$store.commit(`messages/${messagesMutations.CLEAR_FOCUS}`)
        } else {
          this.$store.commit(
            `messages/${messagesMutations.TOGGLE_FOCUS}`,
            friendId
          )
          this.$store.commit(
            `messages/${messagesMutations.CLEAR_NOTIFICATIONS}`,
            friendId
          )
        }
        this.$store.commit(
          `messages/${messagesMutations.TOGGLE_OPEN}`,
          friendId
        )
      }
    },
  },
}
</script>

<style lang="scss">
.friendsList {
  overflow: hidden;
}
</style>
