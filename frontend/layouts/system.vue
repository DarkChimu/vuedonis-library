<template>
  <v-app>
    <v-main>
      <div style="min-width: 75vw; max-width: 80vw" class="newbg">
        <nuxt />
      </div>
      <v-navigation-drawer permanent fixed right>
        <v-list>
          <v-list-item class="ml-1">
            <v-list-item-avatar size="80" class="ml-16">
              <v-img
                :src="
                  userImage && userImage !== ''
                    ? userImage
                    : 'https://www.webiconio.com/_upload/256/image_256.svg'
                "
              ></v-img>
            </v-list-item-avatar>
          </v-list-item>

          <v-list-item link @click="() => (editDialog = !editDialog)">
            <v-list-item-content>
              <v-row class="align-center">
                <v-col cols="8" class="ml-3">
                  <v-list-item-title class="text-h6 text-right mr-5">
                    {{ loggedInUser.username }}
                  </v-list-item-title>
                  <v-list-item-subtitle class="text-right">{{
                    loggedInUser.role === "user" ? "Usuario" : loggedInUser.role === "enterprice" ? "Empresario" : "Administrador"
                  }}</v-list-item-subtitle>
                </v-col>
                <v-col cols="3">
                  <v-icon class="text-primary"> mdi-cog </v-icon>
                </v-col>
              </v-row>
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
      <v-dialog v-model="editDialog" max-width="500px">
        <v-card>
          <v-card-title>
            <span class="text-h5">Editar Perfil</span>
          </v-card-title>

          <v-card-text>
            <v-container>
              <v-row>
                <v-col cols="12" class="text-center">
                  <v-row class="align-center text-right justify-center">
                    <v-col cols="8">
                      <v-list-item-avatar size="125">
                        <v-img
                          style="
                            border: 1px solid #ebebeb;
                            background-color: #fafafa;
                            resize: cover;
                          "
                          :src="
                            userImage && userImage !== ''
                              ? userImage
                              : 'https://www.webiconio.com/_upload/256/image_256.svg'
                          "
                        ></v-img>
                      </v-list-item-avatar>
                    </v-col>
                    <v-col cols="3" class="align-self-end mx-0 px-0">
                      <v-file-input
                        style="margin-left: -50px"
                        v-model="rawImage"
                        placeholder="Pick an avatar"
                        prepend-icon="mdi-camera"
                        label="Avatar"
                        hide-input
                        @change="debugImage"
                      ></v-file-input>
                    </v-col>
                  </v-row>
                </v-col>
                <v-col cols="6">
                  <v-text-field
                    v-model="user.username"
                    label="Nombre de Usuario"
                  />
                </v-col>
                <v-col cols="6">
                  <v-text-field
                    v-model="user.email"
                    label="Correo Electrónico"
                  />
                </v-col>
                <v-col cols="6">
                  <v-text-field
                    v-model="user.password"
                    label="Contraseña"
                    type="password"
                  />
                </v-col>
                <v-col cols="6">
                  <v-text-field v-model="user.address" label="Dirección" />
                </v-col>
              </v-row>
            </v-container>
          </v-card-text>

          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              color="blue darken-1"
              text
              @click="() => (editDialog = !editDialog)"
            >
              Cancelar
            </v-btn>
            <v-btn color="blue darken-1" text @click="save"> Guardar </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
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
          permission: "enterprice" || "admin",
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
      editDialog: false,
      userImage: "",
      rawImage: null,
      user: {
        username: "",
        email: "",
        password: "",
        address: "",
      }
    };
  },
  computed: {
    ...mapGetters(["loggedInUser"]),
  },
  mounted() {
    this.getRole();
    this.setUserDataOnEdit();
  },
  methods: {
    setUserDataOnEdit() {
      this.user.username = this.loggedInUser.username;
      this.user.email = this.loggedInUser.email;
      this.user.password = null;
      this.user.address = this.loggedInUser.address;
      this.userImage = this.loggedInUser.photo_url
        ? this.loggedInUser.photo_url
        : "";
    },
    debugImage() {
      this.getBase64(this.rawImage).then((data) => {
        this.userImage = data;
      });
    },
    getBase64(file) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
      });
    },
    async getRole() {
      console.log(this.loggedInUser.role);
      this.listOptions = this.items.filter((el) => {
        return this.loggedInUser.role === "user"
          ? el.permission === "user"
          : this.loggedInUser.role === "enterprice"
          ? el.permission === "user" || el.permission === "enterprice"
          : el
      });
    },
    link(item) {
      this.$router.push({ name: item.screen });
    },
    async logout() {
      await this.$auth.logout();
    },
    async save() {
      try {
        const response = (
          await this.$axios.put(`/users/${this.loggedInUser.id}`, {
            name: this.user.username,
            email: this.user.email,
            password: this.user.password,
            address: this.user.address,
            photo_url: this.userImage,
          })
        ).data;

        this.editDialog = false;
      } catch (error) {
        console.log(error);
      }
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
