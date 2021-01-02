<template>
  <div class="chatElement" :class="{ focused: isFocused(chat.friendId) }">
    <v-badge
      bordered
      bottom
      color="deep-purple accent-4"
      :content="newMessages(chat.friendId)"
      :value="newMessages(chat.friendId)"
      offset-x="15"
      offset-y="15"
      class="avatar"
    >
      <v-avatar>
        <v-img
          src="https://cdn.vuetifyjs.com/images/lists/2.jpg"
          @click="openChat(chat.friendId)"
        ></v-img>
      </v-avatar>
    </v-badge>

    <div class="chatText" @click="setFocus(chat.friendId)">
      <v-card
        v-if="showChat"
        elevation="16"
        outlined
        shaped
        width="350"
        height="500"
      >
        <v-card-title>{{ friendName }}</v-card-title>
        <v-card-text>
          <v-card
            ref="chat"
            class="overflow-y-auto"
            min-height="300"
            max-height="300"
          >
            <v-list-item
              v-for="(message, index) in chat.messages"
              :key="index"
              v-intersect.quiet="
                index === 0 ? onIntersect(chat.friendId) : false
              "
            >
              <v-list-item-avatar v-if="message.from !== userId">
                <img src="https://cdn.vuetifyjs.com/images/lists/2.jpg" />
              </v-list-item-avatar>
              <v-sheet
                class="text-wrap content mb-5 pa-5 primary font-weight-medium white--text"
                width="200"
                rounded="xl"
              >
                {{ message.content }}
              </v-sheet>
              <v-list-item-avatar v-if="message.from === userId">
                <img src="https://cdn.vuetifyjs.com/images/lists/2.jpg" />
              </v-list-item-avatar>
            </v-list-item>
          </v-card>
        </v-card-text>
        <v-form>
          <v-container>
            <v-row>
              <v-col cols="12">
                <v-text-field
                  v-model="message"
                  append-outer-icon="mdi-send"
                  filled
                  clear-icon="mdi-close-circle"
                  clearable
                  label="Message"
                  type="text"
                  @click:append-outer.prevent="sendMessage(chat.friendId)"
                ></v-text-field>
              </v-col>
            </v-row>
          </v-container>
        </v-form>
      </v-card>
    </div>
  </div>
</template>

<script>
import gsap from 'gsap'
import { Draggable } from 'gsap/Draggable'
import { messagesMutations } from '../storeTypes/messages/mutations.types'
import { messagesActions } from '../storeTypes/messages/actions.types'
import { listenersMutations } from '../storeTypes/listeners/mutations.types'
export default {
  props: {
    chat: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      showChat: true,
      message: '',
      firstUpdate: true,
    }
  },
  computed: {
    friendName() {
      return this.$store.state.auth.user.friends[this.chat.friendId].username
    },
    userId() {
      return this.$store.state.auth.user.id
    },
    newMessages() {
      return (userId) =>
        this.$store.state.messages.newMessages[userId]?.count || 0
    },
    isFocused() {
      return (friendId) => this.$store.state.messages.focused === friendId
    },
    hasMoreMessages() {
      return (friendId) => this.$store.state.messages.chat[friendId]?.hasMore
    },
  },
  updated() {
    if (this.firstUpdate && this.$refs.chat) {
      this.$refs.chat.$el.scrollTop = this.$refs.chat.$el.scrollHeight
      this.firstUpdate = false
    }
  },
  destroyed() {
    this.$store.commit(
      `listeners/${listenersMutations.REMOVE_MESSAGE_LISTENERS}`,
      { friendId: this.chat.friendId }
    )
  },
  mounted() {
    this.$refs.chat.$el.scrollTop = this.$refs.chat.$el.scrollHeight

    this.$store.commit(
      `listeners/${listenersMutations.ADD_MESSAGE_LISTENERS}`,
      { friendId: this.chat.friendId, listener: this.onNewMessage }
    )
    gsap.registerPlugin(Draggable)
    Draggable.create('.chatElement', {
      type: 'x,y',
      edgeResistance: 0.65,
      bounds: '#openChats',
      inertia: true,
    })
  },
  methods: {
    openChat(friendId) {
      this.showChat = !this.isFocused(friendId)
      this.firstUpdate = true
      this.$store.commit(`messages/${messagesMutations.TOGGLE_FOCUS}`, friendId)
      this.$store.commit(
        `messages/${messagesMutations.CLEAR_NOTIFICATIONS}`,
        friendId
      )
    },
    setFocus(friendId) {
      if (!this.isFocused(friendId))
        this.$store.commit(
          `messages/${messagesMutations.TOGGLE_FOCUS}`,
          friendId
        )
      this.$store.commit(
        `messages/${messagesMutations.CLEAR_NOTIFICATIONS}`,
        friendId
      )
    },
    async sendMessage(friendId) {
      const res = await this.$store.dispatch(
        `messages/${messagesActions.SEND_MESSAGE}`,
        {
          from: this.userId,
          to: friendId,
          content: this.message,
        }
      )
      if (res) this.message = ''
    },
    onIntersect(friendId) {
      return (_, __, isIntersecting) => {
        if (isIntersecting && this.hasMoreMessages(friendId)) {
          this.$store.dispatch(
            `messages/${messagesActions.READ_MORE}`,
            friendId
          )
          this.$refs.chat.$el.scrollTop = 100
        }
      }
    },
    onNewMessage() {
      if (this.$refs.chat)
        this.$refs.chat.$el.scrollTop = this.$refs.chat.$el.scrollHeight
    },
  },
}
</script>

<style scoped>
.chatText {
  position: absolute;
  z-index: 0;
  transform: translateY(-20px) translateX(-320px);
}
.avatar {
  z-index: 1;
}
.chatElement {
  opacity: 0.6;
}
.focused {
  opacity: 1;
}
.loading {
  margin-bottom: 150px;
}
</style>
