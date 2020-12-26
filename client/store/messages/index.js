import Vue from 'vue'
import { sendMessage } from '~/GraphQl/Mutations/Calls'
import { readMessages } from '~/GraphQl/Queries'
import { messagesActions } from '~/storeTypes/messages/actions.types'
import { messagesMutations } from '~/storeTypes/messages/mutations.types'
const getDefaultState = () => ({
  newMessages: {},
  chat: {},
  focused: '',
})

export const state = getDefaultState()

export const actions = {
  [messagesActions.NEW_MESSAGE_RECIEVED](context, payload) {
    if (context.state.focused !== payload.from.id) {
      context.commit(messagesMutations.ADD_NOTIFICATION_MESSAGE, payload)
    }
    if (context.state.chat[payload.from.id]) {
      context.commit(messagesMutations.ADD_NEW_MESSAGE, payload)
    }
  },
  async [messagesActions.READ_CHAT](context, friendId) {
    if (!context.state.chat[friendId]) {
      context.commit(messagesMutations.CREATE_CHAT, friendId)
      try {
        // context.commit(messagesMutations.SET_OPEN, { friendId, isOpen: true })
        const res = await readMessages(
          this.app.apolloProvider.defaultClient,
          friendId,
          0
        )
        if (res.data.readMessages.length) {
          context.commit(messagesMutations.PUSH_FETCHED_MESSAGES, {
            friendId,
            messages: res.data.readMessages,
          })
        } else {
          context.commit(messagesMutations.NO_MORE_MESSAGES, friendId)
        }
      } catch (error) {
        console.log(error)
      }
    }
  },
  async [messagesActions.READ_MORE](context, friendId) {
    try {
      if (!context.state.chat[friendId]?.hasMore)
        throw new Error('No more results')
      context.commit(messagesMutations.INCREASE_PAGE_NUM, friendId)
      const res = await readMessages(
        this.app.apolloProvider.defaultClient,
        friendId,
        context.state.chat[friendId].pageNum
      )
      if (res.data.readMessages.length) {
        context.commit(messagesMutations.PUSH_FETCHED_MESSAGES, {
          friendId,
          messages: res.data.readMessages,
        })
      } else {
        context.commit(messagesMutations.NO_MORE_MESSAGES, friendId)
      }
      console.log(res)
    } catch (error) {
      console.log(error)
    }
  },
  async [messagesActions.SEND_MESSAGE](context, payload) {
    try {
      const res = await sendMessage(this.app.apolloProvider.defaultClient, {
        friendId: payload.to,
        content: payload.content,
      })
      if (res.data.sendMessage.success) {
        context.commit(messagesMutations.PUSH_SENT_MESSAGE, payload)
      }
      return true
    } catch (error) {
      console.log(error)
      return false
    }
  },
}

export const getters = {
  openChats(state) {
    const openChats = []
    for (const key in state.chat) {
      if (state.chat[key].isOpen)
        openChats.push({ ...state.chat[key], friendId: key })
    }
    return openChats
  },
}

export const mutations = {
  [messagesMutations.ADD_NOTIFICATION_MESSAGE](state, payload) {
    Vue.set(state.newMessages, payload.from.id, {
      count: state.newMessages[payload.from.id]?.count + 1 || 1,
      content: payload.content,
    })
  },
  [messagesMutations.CLEAR_NOTIFICATIONS](state, friendId) {
    if (state.newMessages[friendId]) state.newMessages[friendId].count = 0
  },
  [messagesMutations.ADD_NEW_MESSAGE](state, payload) {
    const newMessage = {
      from: payload.from.id,
      content: payload.content,
    }
    Vue.set(state.chat[payload.from.id], 'messages', [
      ...state.chat[payload.from.id].messages,
      newMessage,
    ])
  },
  [messagesMutations.TOGGLE_OPEN](state, friendId) {
    Vue.set(state.chat[friendId], 'isOpen', !state.chat[friendId].isOpen)
  },
  [messagesMutations.CREATE_CHAT](state, friendId) {
    Vue.set(state.chat, friendId, {
      isOpen: true,
      pageNum: 0,
      hasMore: true,
      loading: false,
      messages: [],
    })
  },
  [messagesMutations.SET_OPEN](state, { friendId, isOpen }) {
    Vue.set(state.chat[friendId], 'isOpen', isOpen)
  },
  [messagesMutations.PUSH_FETCHED_MESSAGES](state, payload) {
    const newFetchedMessages = payload.messages.slice().reverse()
    state.chat[payload.friendId].messages.unshift(...newFetchedMessages)
  },
  [messagesMutations.NO_MORE_MESSAGES](state, friendId) {
    state.chat[friendId].hasMore = false
  },
  [messagesMutations.PUSH_SENT_MESSAGE](state, payload) {
    state.chat[payload.to].messages.push(payload)
  },
  [messagesMutations.INCREASE_PAGE_NUM](state, friendId) {
    state.chat[friendId].pageNum++
  },
  [messagesMutations.TOGGLE_FOCUS](state, friendId) {
    if (state.focused === friendId) {
      state.focused = ''
    } else {
      state.focused = friendId
    }
  },
  [messagesMutations.CLEAR_FOCUS](state) {
    state.focused = ''
  },
  [messagesMutations.RESET_NEW_MESSAGE](state) {
    Object.assign(state, getDefaultState())
  },
}
