<template>
  <v-row>
    <v-col cols="1"></v-col>
    <v-col cols="10">
      <v-data-table
        :headers="headers"
        :items="books"
        sort-by="created_at"
        class="elevation-5 mx-auto mt-10"
        :loading="loading"
        loading-text="Cargando..."
      >
        <template v-slot:top>
          <v-toolbar flat>
            <v-toolbar-title>Usuarios </v-toolbar-title>
            <v-divider class="mx-4" inset vertical></v-divider>
            <v-spacer></v-spacer>
            <v-dialog v-model="dialog" max-width="500px">
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  color="primary"
                  dark
                  class="mb-2"
                  v-bind="attrs"
                  v-on="on"
                >
                  Agregar Usuario
                </v-btn>
              </template>
              <v-card>
                <v-card-title>
                  <span class="text-h5">{{ formTitle }}</span>
                </v-card-title>

                <v-card-text>
                  <v-container>
                    <v-row align="center">
                      <v-col cols="12" sm="6" md="6">
                        <v-text-field
                          v-model="editedItem.username"
                          label="Nombre de Usuario"
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" sm="6" md="6">
                        <v-text-field
                          v-model="editedItem.first_name"
                          label="Nombre"
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" sm="6" md="6">
                        <v-text-field
                          v-model="editedItem.last_name"
                          label="Apellido"
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" sm="6" md="6">
                        <v-text-field
                          v-model="editedItem.ci"
                          label="CI"
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" sm="6" md="6">
                        <v-text-field
                          v-model="editedItem.address"
                          label="Dirección"
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" sm="6" md="6">
                        <v-text-field
                          v-model="editedItem.email"
                          label="Email"
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" sm="6" md="6">
                        <v-text-field
                          v-model="editedItem.password"
                          label="Contraseña"
                        ></v-text-field>
                      </v-col>
                      <v-col
                        v-if="editedItem.role === 'user'"
                        cols="12"
                        sm="6"
                        md="6"
                        class="text-center"
                      >
                        <v-btn
                          class="mb-2"
                          color="primary"
                          outlined
                          @click="grantAdmin"
                          >Administrador</v-btn
                        >
                      </v-col>
                    </v-row>
                  </v-container>
                </v-card-text>

                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="blue darken-1" text @click="close">
                    Cancelar
                  </v-btn>
                  <v-btn color="blue darken-1" text @click="save">
                    Guardar
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
            <v-dialog v-model="dialogDelete" max-width="500px">
              <v-card>
                <v-card-title class="text-h5"
                  >Seguro que quieres borrar este registro?</v-card-title
                >
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="blue darken-1" text @click="closeDelete"
                    >Cancelar</v-btn
                  >
                  <v-btn color="blue darken-1" text @click="deleteItemConfirm"
                    >OK</v-btn
                  >
                  <v-spacer></v-spacer>
                </v-card-actions>
              </v-card>
            </v-dialog>
          </v-toolbar>
        </template>
        <template v-slot:item.actions="{ item }">
          <v-icon small class="mr-2" @click="editItem(item)">
            mdi-pencil
          </v-icon>
          <v-icon small @click="deleteItem(item)"> mdi-delete </v-icon>
        </template>
        <template v-slot:no-data>
          {{ noDataMessage }}
        </template>
        <template v-slot:item.reports="{ item }">
          {{
            !item.reports || item.reports.length === 0
              ? "Ninguna"
              : item.reports.length
          }}
          <v-icon small class="ml-2" @click="showReports(item.reports)">
            mdi-eye
          </v-icon>
        </template>
        <template v-slot:item.role="{ item }">
          {{
            item.role === "admin"
              ? "Administrador"
              : item.role === "user"
              ? "Usuario"
              : "Empresario"
          }}
        </template>
      </v-data-table>
    </v-col>
    <v-dialog v-model="dialogReports" max-width="500px">
      <v-card>
        <v-card-title class="text-h5">Amonestaciones</v-card-title>
        <v-data-table :headers="reportHeaders" :items="reports">
          <template v-slot:no-data>
            {{ noReportDataMessage }}
          </template></v-data-table
        >
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="closeReports">Cerrar</v-btn>
          <v-spacer></v-spacer>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <sweet-modal ref="ok" :icon="modalInfoState">{{
      modalInfoMessage
    }}</sweet-modal>
  </v-row>
</template>

<script>
import { SweetModal, SweetModalTab } from "sweet-modal-vue";

export default {
  layout: "system",
  components: {
    SweetModal,
    SweetModalTab,
  },
  data: () => ({
    modalInfoState: "success",
    modalInfoMessage: "",
    dialog: false,
    dialogDelete: false,
    dialogReports: false,
    reports: [],
    reportHeaders: [
      {
        text: "Fecha",
        value: "created_at",
        align: "left",
        sortable: true,
      },
      {
        text: "Descripción",
        value: "description",
        align: "left",
        sortable: true,
      },
    ],
    headers: [
      {
        text: "ID",
        align: "start",
        sortable: false,
        value: "id",
      },
      { text: "CI", value: "ci" },
      { text: "Email", value: "email" },
      { text: "Nombre", value: "first_name" },
      { text: "Dirección", value: "address" },
      { text: "Rol", value: "role" },
      { text: "Amonestaciones", value: "reports", align: "center" },
      { text: "Acciones", value: "actions", sortable: false, align: "center" },
    ],
    books: [],
    editedIndex: -1,
    editedItem: {
      username: "",
      first_name: "",
      last_name: "",
      role: "",
      ci: "",
      address: "",
      email: "",
      password: "",
    },
    defaultItem: {
      username: "",
      first_name: "",
      last_name: "",
      role: "",
      ci: "",
      address: "",
      email: "",
      password: "",
    },
    noDataMessage: "No hay Usuarios :(",
    noReportDataMessage: "Este usuario no tiene amonestaciones :D",
  }),

  computed: {
    formTitle() {
      return this.editedIndex === -1 ? "Agregar Usuario" : "Editar Usuario";
    },
  },

  watch: {
    dialog(val) {
      val || this.close();
    },
    dialogDelete(val) {
      val || this.closeDelete();
    },
  },

  created() {
    this.initialize();
  },

  methods: {
    async initialize() {
      this.loading = true;
      const res = await this.$axios.$get("/users");
      this.books = res.data;

      this.books = this.books.map((el) => {
        return {
          ...el,
          password: null,
        };
      });
      this.loading = false;
    },

    editItem(item) {
      this.editedIndex = item.id;
      this.editedItem = Object.assign({}, item);
      this.dialog = true;
    },

    deleteItem(item) {
      this.editedIndex = item.id;
      this.dialogDelete = true;
    },

    async deleteItemConfirm() {
      try {
        const response = await this.$axios.delete(`/users/${this.editedIndex}`);
        this.modalInfoMessage = "Operación Realizada";
        this.modalInfoState = "success";
        this.closeDelete();
        this.$refs.ok.open();
        this.initialize();
      } catch (error) {
        this.modalInfoMessage = "Error al eliminar";
        this.modalInfoState = "error";
        this.$refs.ok.open();
      }
    },

    close() {
      this.dialog = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
    },

    closeDelete() {
      this.dialogDelete = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
    },

    async save() {
      if (this.editedIndex > -1) {
        const response = await this.$axios.put(
          `/users/${this.editedIndex}`,
          this.editedItem
        );
      } else {
        const response = await this.$axios.post("/users/", this.editedItem);
      }

      this.close();
      this.modalInfoMessage = "¡Operación realizada!";
      this.modalInfoState = "success";
      this.$refs.ok.open();
      await this.initialize();
    },

    async grantAdmin(item) {
      try {
        const response = await this.$axios.put(
          `/users/${this.editedIndex}/grantAdmin`
        );

        this.modalInfoMessage = "Se ha otorgado el rol de administrador";
        this.modalInfoState = "success";
        this.$refs.ok.open();
        await this.initialize();
      } catch (error) {
        this.modalInfoMessage = "No se pudo otorgar el rol de administrador";
        this.modalInfoState = "error";
        this.$refs.ok.open();
        console.log(error.message);
      }
    },

    async showReports(items) {
      this.reports = items;
      this.dialogReports = true;
    },

    closeReports() {
      this.reports = [];
      this.dialogReports = false;
    },
  },
};
</script>
