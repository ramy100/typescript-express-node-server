<template>
  <v-row justify="center">
    <v-dialog v-model="dialog" scrollable max-width="500px">
      <template v-slot:activator="{ on, attrs }">
        <v-list-item link v-bind="attrs" v-on="on">
          <v-list-item-icon>
            <v-badge
              :content="friendRequests.length"
              :value="friendRequests.length"
              color="red"
              overlap
            >
              <v-icon large> mdi-account-multiple </v-icon>
            </v-badge>
          </v-list-item-icon>
          <v-list-item-title>Find Friends</v-list-item-title>
        </v-list-item>
      </template>
      <v-card>
        <v-card-title>People you may know</v-card-title>
        <v-divider></v-divider>
        <v-card-text style="height: 300px">
          <user-card
            v-for="user in friendRequests"
            :key="user.id"
            :user="user"
            action-name="Accept friend request"
            :on-click="acceptFriendRequest"
          ></user-card>
          <v-divider></v-divider>
          <user-card
            v-for="user in users"
            :key="user.id"
            :user="user"
            action-name="Add friend"
            :on-click="addFriend"
          ></user-card>
          <div
            v-if="hasMore"
            v-intersect="onIntersect"
            class="text-center loading"
          >
            <v-progress-circular
              indeterminate
              color="primary"
            ></v-progress-circular>
          </div>
          <div v-if="!hasMore" class="noResults">
            <div>
              <v-img src="/no-results.png" width="300"></v-img>
            </div>
            <div>
              <h3 class="text-center">No results</h3>
            </div>
          </div>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-btn color="blue darken-1" text @click="dialog = false">
            Close
          </v-btn>
          <!-- <v-btn color="blue darken-1" text @click="save"> Save </v-btn> -->
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>
import { GET_USERS_QUERY } from '../GraphQl/Queries/Queries'
import { usersMutations } from '../storeTypes/users/mutations.types'
import { usersActions } from '../storeTypes/users/actions.types'
import UserCard from './UserCard.vue'
export default {
  name: 'UsersList',
  components: { UserCard },
  data() {
    return {
      dialog: false,
    }
  },
  computed: {
    users() {
      // show only users who ddnt send friend requests
      return this.$store.getters['users/filteredUsers'](this.friendRequests)
    },
    friendRequests() {
      return this.$store.getters['auth/friendRequests']
    },
    pageNum() {
      return this.$store.state.users.pageNum
    },
    hasMore() {
      return this.$store.state.users.hasMore
    },
  },
  methods: {
    async addFriend(user) {
      const res = await this.$store.dispatch(
        `users/${usersActions.SEND_FRIEND_REQUEST}`,
        user.id
      )
      console.log(res)
    },
    async acceptFriendRequest(user) {
      const res = await this.$store.dispatch(
        `users/${usersActions.ACCEPT_FRIEND_REQUEST}`,
        user
      )
      console.log(res)
    },
    onIntersect(_entries, _observer, isIntersecting) {
      if (isIntersecting && this.hasMore) {
        this.$store.commit(`users/${usersMutations.INCREASE_PAGENUM}`)
        this.$apollo.queries.users.start()
      }
    },
  },
  apollo: {
    users: {
      query: GET_USERS_QUERY,
      variables() {
        return {
          pageNum: this.pageNum,
        }
      },
      skip: true,
      manual: true,
      result({ data }) {
        if (data?.users?.length) {
          this.$store.commit(
            `users/${usersMutations.PUSH_TO_USERS}`,
            data.users
          )
        } else {
          this.$store.commit(`users/${usersMutations.SET_HAS_MORE}`, false)
        }
      },
    },
  },
}
</script>

<style lang="scss" scoped>
.loading {
  margin-top: 150px;
}
.noResults {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 20px;
}
</style>
