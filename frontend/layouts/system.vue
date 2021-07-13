<template>
  <v-app>
    <v-main>
      <div class="newbg">
        <nuxt />
      </div>
      <v-navigation-drawer permanent fixed right>
        <v-list>
          <v-list-item class="ml-1">
            <v-list-item-avatar size="80" class="ml-16">
              <v-img :src="loggedInUser.photo_url? loggedInUser.photo_url : 'https://i.imgur.com/J7DuhpD.jpg'"></v-img>
            </v-list-item-avatar>
          </v-list-item>

          <v-list-item link>
            <v-list-item-content>
              <v-list-item-title class="text-h6 text-center">
                {{ loggedInUser.username }}
              </v-list-item-title>
              <v-list-item-subtitle class="text-center">{{
                loggedInUser.role === "user" ? "Usuario" : "Administrador"
              }}</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
        </v-list>

        <v-divider></v-divider>

        <v-list dense nav>
          <v-list-item
            v-for="item in listOptions"
            :key="item.title"
            @click="link(item)"
          >
            <v-list-item-icon>
              <v-icon>{{ item.icon }}</v-icon>
            </v-list-item-icon>

            <v-list-item-content>
              <v-list-item-title>{{ item.title }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list>
        <template v-slot:append>
          <div class="pa-2">
            <v-btn block color="primary" @click="logout"> Cerrar Sesión </v-btn>
          </div>
        </template>
      </v-navigation-drawer>
    </v-main>
  </v-app>
</template>



<script>
import axios from "@nuxtjs/axios";
import { mapGetters } from "vuex";

export default {
  data() {
    return {
      items: [
        {
          title: "Dashboard",
          icon: "mdi-view-dashboard-outline",
          screen: "home",
          permission: "user",
        },
        {
          title: "Mis Prestamos",
          icon: "mdi-book-multiple-outline",
          screen: "myBooks",
          permission: "user",
        },
        {
          title: "Control de Libros",
          icon: "mdi-book-check",
          screen: "books",
          permission: "admin",
        },
        {
          title: "Control de Prestamos",
          icon: "mdi-book-account-outline",
          screen: "loan",
          permission: "admin",
        },
        {
          title: "Control de usuarios",
          icon: "mdi-monitor-dashboard",
          screen: "users",
          permission: "admin",
        },
      ],
      listOptions: [],
      right: null,
    };
  },
  computed: {
    ...mapGetters(["loggedInUser"]),
  },
  mounted() {
    this.getRole();
  },
  methods: {
    async getRole() {
      console.log(this.loggedInUser.role);
      this.listOptions = this.items.filter((el) => {
        return this.loggedInUser.role === "user"
          ? el.permission === "user"
          : el;
      });
    },
    link(item) {
      this.$router.push({ name: item.screen });
    },
    async logout() {
      await this.$auth.logout();
    },
  },
};
</script>

<style scoped>
.newbg {
  background-color: #64b5f6;
  min-height: 102vh;
}
</style>