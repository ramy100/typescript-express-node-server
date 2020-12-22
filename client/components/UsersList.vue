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
          <v-card v-for="user in friendRequests" :key="user.id" class="mt-10">
            <div class="d-flex flex-no-wrap justify-space-between">
              <div>
                <v-card-title
                  class="headline"
                  v-text="user.email"
                ></v-card-title>
                <v-card-subtitle v-text="user.email"></v-card-subtitle>
                <v-card-actions>
                  <v-btn
                    v-if="user.email === 'Ellie Goulding'"
                    class="ml-2 mt-3"
                    fab
                    icon
                    height="40px"
                    right
                    width="40px"
                  >
                    <v-icon>mdi-play</v-icon>
                  </v-btn>
                  <v-btn
                    v-else
                    class="ml-2 mt-5"
                    outlined
                    rounded
                    small
                    @click="acceptFriendRequest(user.id)"
                  >
                    Accept friend request
                  </v-btn>
                </v-card-actions>
              </div>
              <v-avatar class="ma-3" size="125" tile>
                <v-img
                  src="https://randomuser.me/api/portraits/women/84.jpg"
                ></v-img>
              </v-avatar>
            </div>
          </v-card>
          <v-divider></v-divider>
          <v-card v-for="user in users" :key="user.id" class="mt-10">
            <div class="d-flex flex-no-wrap justify-space-between">
              <div>
                <v-card-title
                  class="headline"
                  v-text="user.email"
                ></v-card-title>
                <v-card-subtitle v-text="user.email"></v-card-subtitle>
                <v-card-actions>
                  <v-btn
                    v-if="user.email === 'Ellie Goulding'"
                    class="ml-2 mt-3"
                    fab
                    icon
                    height="40px"
                    right
                    width="40px"
                  >
                    <v-icon>mdi-play</v-icon>
                  </v-btn>
                  <v-btn
                    v-else
                    class="ml-2 mt-5"
                    outlined
                    rounded
                    small
                    @click="addFriend(user.id)"
                  >
                    Add friend
                  </v-btn>
                </v-card-actions>
              </div>
              <v-avatar class="ma-3" size="125" tile>
                <v-img
                  src="https://randomuser.me/api/portraits/women/84.jpg"
                ></v-img>
              </v-avatar>
            </div>
          </v-card>
          <div
            v-if="hasMore"
            v-intersect="onIntersect"
            class="text-center mt-8"
          >
            <v-progress-circular cen indeterminate size="64"
              ><v-icon>mdi-account-convert</v-icon></v-progress-circular
            >
          </div>
          <h3 v-if="!hasMore" class="text-center mt-8">No more results</h3>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-btn color="blue darken-1" text @click="dialog = false">
            Close
          </v-btn>
          <v-btn color="blue darken-1" text @click="save"> Save </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>
import { GET_USERS_QUERY } from '../GraphQl/Queries/Queries'
import { FRIEND_REQUEST_SUPSRIBTION } from '../GraphQl/Subscriptions'
export default {
  data() {
    return {
      dialog: false,
      pageNum: 1,
      hasMore: true,
    }
  },
  computed: {
    users() {
      return this.$store.state.users.nonFriends
    },
    friendRequests() {
      return this.$store.state.auth.user.friendRequests
    },
  },
  methods: {
    save() {
      console.log(this.users)
    },
    async addFriend(id) {
      const res = await this.$store.dispatch('users/sendFriendRequest', id)
      console.log(res)
    },
    acceptFriendRequest(id) {
      console.log(id)
    },
    onIntersect(_entries, _observer, isIntersecting) {
      if (isIntersecting && this.hasMore) {
        this.pageNum++
        this.$apollo.queries.users.refetch()
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
      result({ data }) {
        if (data.users.length) {
          const filteredList = data.users.filter((user) => {
            return !this.$store.state.auth.user.friendRequests.some(
              (request) => request.id === user.id
            )
          })
          this.$store.commit('users/pushToUsers', filteredList)
        } else {
          this.hasMore = false
        }
      },
    },
  },
}
</script>

<style lang="scss" scoped>
.notification {
  background-color: rgb(185, 62, 62);
  width: 10px;
  height: 10px;
}
</style>
