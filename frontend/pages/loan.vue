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
            <v-toolbar-title>Prestamos </v-toolbar-title>
            <v-divider class="mx-4" inset vertical></v-divider>
            <v-spacer></v-spacer>
            <v-dialog v-model="dialog" max-width="600px">
              <!-- <template v-slot:activator="{ on, attrs }">
            <v-btn
              color="primary"
              dark
              class="mb-2"
              v-bind="attrs"
              v-on="on"
            >
              Agregar Prestamo
            </v-btn>
          </template> -->
              <v-card>
                <v-card-title>
                  <span class="text-h5">{{ formTitle }}</span>
                </v-card-title>

                <v-card-text>
                  <v-container>
                    <v-row class="align-center">
                      <v-col cols="12" sm="6" md="4">
                        <v-text-field
                          v-model="editedItem.limit"
                          label="Fecha Límite"
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" sm="6" md="4">
                        <v-text-field
                          v-model="editedItem.delivered"
                          label="Fecha Entrega"
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" sm="6" md="4">
                        <v-btn
                          elevation="0"
                          color="primary"
                          @click="report(editedItem)"
                        >
                          <v-icon>mdi-book-open-page-variant</v-icon>
                          <span class="ml-1">Amonestación</span>
                        </v-btn>
                      </v-col>
                      <v-col cols="12" sm="6" md="4"> </v-col>
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
            <v-dialog v-model="dialogReport" max-width="500px">
              <v-card>
                <v-card-title>
                  <span class="text-h5">Incluir Amonestación</span>
                </v-card-title>
                <v-card-text>
                  <v-container>
                    <v-textarea
                      outlined
                      name="input-7-4"
                      label="Observación"
                      v-model="reportInfo.description"
                      placeholder="Escribe aquí la observación..."
                    ></v-textarea>
                  </v-container>
                </v-card-text>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="blue darken-1" text @click="closeReport"
                    >Cancelar</v-btn
                  >
                  <v-btn color="blue darken-1" text @click="sendReport"
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
      </v-data-table>
    </v-col>
  </v-row>
</template>

<script>
export default {
  layout: "system",
  data: () => ({
    loading: false,
    dialog: false,
    dialogDelete: false,
    dialogReport: false,
    headers: [
      {
        text: "ID",
        align: "start",
        sortable: false,
        value: "id",
      },
      { text: "Nombre", value: "user.first_name" },
      { text: "Apellido", value: "user.last_name" },
      { text: "Libro", value: "book.title.principal_title" },
      { text: "CI", value: "user.ci" },
      { text: "Fecha Límite", value: "limit" },
      { text: "Entregado", value: "delivered" },
      { text: "Actions", value: "actions", sortable: false },
    ],
    books: [],
    editedIndex: -1,
    editedItem: {},
    defaultItem: {
      first_name: "",
      last_name: "",
      ci: "",
    },
    reportInfo: {
      user_id: null,
      description: "",
    },
    noDataMessage: "No hay Prestamos :(",
  }),

  computed: {
    formTitle() {
      return this.editedIndex === -1 ? "Agregar Prestamo" : "Editar Prestamo";
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
      const res = await this.$axios.$get("/loans");
      res.data.forEach(item => {
        item.limit ? item.limit = item.limit.split("T")[0] : "";
        item.delivered ? item.delivered = item.delivered.split("T")[0] : "";
      })
      this.books = res.data;
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
      const response = await this.$axios.delete(`/loans/${this.editedIndex}`);
      this.initialize();
      this.closeDelete();
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

    closeReport() {
      this.reportInfo = {
        user_id: null,
        description: "",
      };
      this.dialogReport = false;
    },

    async save() {
      if (this.editedIndex > -1) {
        const response = await this.$axios.put(
          `/loans/${this.editedIndex}`,
          this.editedItem
        );
      } else {
        const response = await this.$axios.post("/loans/", this.editedItem);
      }
      await this.initialize();
      this.close();
    },

    report(item) {
      const { id } = item.user;
      console.log(id);
      this.dialog = false;
      this.reportInfo.user_id = id;
      this.dialogReport = true;
    },

    sendReport() {
      this.$axios.post("/users/reports", this.reportInfo).then(() => {
        this.closeReport();
      });
    },
  },
};
</script>
