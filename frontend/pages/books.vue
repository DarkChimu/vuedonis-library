<template>
  <v-row>
    <v-col cols="1"></v-col>
    <v-col cols="8">
      <v-data-table
        :headers="headers"
        :items="books"
        sort-by="created_at"
        class="elevation-5 mx-auto mt-10"
      >
        <template v-slot:top>
          <v-toolbar flat>
            <v-toolbar-title>Libros </v-toolbar-title>
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
                  Agregar Libro
                </v-btn>
              </template>
              <v-card>
                <v-card-title>
                  <span class="text-h5">{{ formTitle }}</span>
                </v-card-title>

                <v-card-text>
                  <v-container>
                    <v-row>
                      <v-col cols="6" sm="6" md="6">
                        20 / ISBN
                        <v-text-field
                          v-model="editedItem.ISBN.normalized_number"
                          label="Numero Normalizado"
                        ></v-text-field>
                      </v-col>
                      <v-col cols="6" sm="6" md="6">
                        82 / Decimal Dewey
                        <v-text-field
                          v-model="editedItem.decimal_dewey_number.classification_number"
                          label="Nro Clasificación"
                        ></v-text-field>
                      </v-col>
                      <v-col cols="6" sm="6" md="6">
                        100 / Autor
                        <v-text-field
                          v-model="editedItem.author.personal_name"
                          label="Nombre personal"
                        ></v-text-field>
                      </v-col>
                      <v-col cols="6" sm="6" md="6">
                        110 / Nombre Corporativo
                        <v-text-field
                          v-model="editedItem.corporative_name.entity_name"
                          label="Nombre entidad"
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" sm="12" md="12">
                        111 / Entrada Principal
                        <v-text-field
                          v-model="editedItem.principal_entry.meet_name"
                          label="Nombre de Reunión"
                        ></v-text-field>
                        <v-text-field
                          v-model="editedItem.principal_entry.meet_date"
                          label="Fecha de Reunión"
                        ></v-text-field>
                        <v-text-field
                          v-model="editedItem.principal_entry.meet_place"
                          label="Lugar de Reunión"
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" sm="12" md="12">
                        245 / Título Propiamente Dicho
                        <v-text-field
                          v-model="editedItem.title.principal_title"
                          label="Título propiamente dicho"
                        ></v-text-field>
                        <v-text-field
                          v-model="editedItem.title.rest_title"
                          label="Resto del Título"
                        ></v-text-field>
                        <v-text-field
                          v-model="editedItem.title.reponsability_mention"
                          label="Mención de responsabilidad"
                        ></v-text-field>
                      </v-col>
                      <v-col cols="6" sm="6" md="6">
                        246 / Título Paralelo
                        <v-text-field
                          v-model="editedItem.parallel_title.principal_title"
                          label="Título propiamente dicho"
                        ></v-text-field>
                        <v-text-field
                          v-model="editedItem.parallel_title.rest_title"
                          label="Resto del Título"
                        ></v-text-field>
                      </v-col>
                      <v-col cols="6" sm="6" md="6">
                        250 / Mención de Edición
                        <v-text-field
                          v-model="editedItem.edition_mention.data"
                          label="Mención de Edición"
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" sm="12" md="12">
                        260 / Publicación y Distribución
                        <v-text-field
                          v-model="editedItem.distribution_info.publication_place"
                          label="Lugar de Publicación"
                        ></v-text-field>
                        <v-text-field
                          v-model="editedItem.distribution_info.editor_name"
                          label="Nombre del Editor"
                        ></v-text-field>
                        <v-text-field
                          v-model="editedItem.distribution_info.publication_date"
                          label="Fecha de Publicación"
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" sm="12" md="12">
                        300 / Descripción Física
                        <v-text-field
                          v-model="editedItem.physical_desc.extension"
                          label="Extensión"
                        ></v-text-field>
                        <v-text-field
                          v-model="editedItem.physical_desc.material"
                          label="Material Acompañante"
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" sm="12" md="12">
                        490 / Mención de Serie
                        <v-text-field
                          v-model="editedItem.serie_mention.mention"
                          label="Mención"
                        ></v-text-field>
                        <v-text-field
                          v-model="editedItem.serie_mention.designation"
                          label="Designación"
                        ></v-text-field>
                      </v-col>
                      <v-col cols="6" sm="6" md="6">
                        505 / Nota de Contenido
                        <v-text-field
                          v-model="editedItem.content_note.data"
                          label="Nota de contenido"
                        ></v-text-field>
                      </v-col>
                        <v-col cols="6" sm="6" md="6">
                        650 / Término Temático
                        <v-text-field
                          v-model="editedItem.theme_termn.data"
                          label="Término Temático"
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" sm="12" md="12">
                        866 / Existencias
                        <v-text-field
                          v-model="editedItem.quantity"
                          label="Cantidad"
                        ></v-text-field>
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
        <template v-slot:item.title.principal_title="{ item }">
          <v-col @click="showDetails(item)">
            {{ item.title.principal_title }}
          </v-col>
        </template>
        <template v-slot:item.author.personal_name="{ item }">
          <v-col @click="showDetails(item)">
            {{ item.author.personal_name }}
          </v-col>
        </template>
        <template v-slot:item.edition_mention.data="{ item }">
          <v-col @click="showDetails(item)">
            {{ item.edition_mention.data }}
          </v-col>
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
    <v-navigation-drawer
      v-model="dialogDetails"
      absolute
      temporary
      width="30vw"
    >

    <v-card
    class="mx-auto mt-6"
    max-width="27vw"
  >
    <v-img
      :src="selectedItem.photo_url? selectedItem.photo_url : 'https://imgur.com/Xw9DXae.jpg'"
      height="300px"
    ></v-img>

    <v-card-title>
      {{ selectedItem? selectedItem.title.principal_title : null }}
    </v-card-title>

    <v-card-subtitle>
       {{ selectedItem? selectedItem.author.personal_name : null }}
    </v-card-subtitle>

    <!-- <v-card-actions>
      <v-btn
        color="orange lighten-2"
        text
      >
        Explore
      </v-btn> -->

      <v-spacer></v-spacer>

      <v-btn
        icon
        @click="show = !show"
      >
        <v-icon>{{ show ? 'mdi-chevron-up' : 'mdi-chevron-down' }}</v-icon>
      </v-btn>
    </v-card-actions>

    <v-expand-transition>
      <div v-show="show">
        <v-divider></v-divider>

        <v-card-text>
          20 / ISBN: Numero Normalizado: {{ selectedItem.ISBN.normalized_number? selectedItem.ISBN.normalized_number : 'sin datos' }} <br>
          80 / Numero Decimal Dewey: Clasificación: {{ selectedItem.decimal_dewey_number? selectedItem.decimal_dewey_number.classification_number : 'sin datos' }} <br>
          100 / Autor: Nombre Personal: {{ selectedItem.author.personal_name? selectedItem.author.personal_name : 'sin datos' }} <br>
          110 / Nombre Corporativo: <br> Nombre de entidad: {{ selectedItem.corporative_name.entity_name? selectedItem.corporative_name.entity_name : 'sin datos' }} <br>
          111 / Entrada Principal: <br>
          Nombre de Reunión: {{ selectedItem.principal_entry.meet_name? selectedItem.principal_entry.meet_name : 'sin datos' }} <br>
          Fecha de Reunión: {{ selectedItem.principal_entry.meet_date? selectedItem.principal_entry.meet_date : 'sin datos' }} <br>
          Lugar de Reunión: {{ selectedItem.principal_entry.meet_place? selectedItem.principal_entry.meet_place : 'sin datos' }} <br>
          245 / Título Propiamente Dicho: <br>
          Título: {{ selectedItem.title.principal_title? selectedItem.title.principal_title : 'sin datos' }} <br>
          Resto del Título: {{ selectedItem.title.rest_title? selectedItem.title.rest_title : 'sin datos' }} <br>
          Mención de Responsabilidad: {{ selectedItem.title.reponsability_mention? selectedItem.title.reponsability_mention : 'sin datos' }} <br>
          246 / Título Paralelo: <br>
          Título: {{ selectedItem.parallel_title.principal_title? selectedItem.parallel_title.principal_title : 'sin datos' }} <br>
          Resto del Título: {{ selectedItem.parallel_title.rest_title? selectedItem.parallel_title.rest_title : 'sin datos' }} <br>
          250 / Mención de Edición: {{ selectedItem.edition_mention.data? selectedItem.edition_mention.data : 'sin datos' }} <br>
          260 / Publicación y Distribución: <br>
          Nombre del Editor: {{ selectedItem.distribution_info.editor_name? selectedItem.distribution_info.editor_name : 'sin datos' }} <br>
          Lugar de Publicación: {{ selectedItem.distribution_info.publication_place? selectedItem.distribution_info.publication_place : 'sin datos' }} <br>
          Fecha de Publicación: {{ selectedItem.distribution_info.publication_date? selectedItem.distribution_info.publication_date : 'sin datos' }} <br>
          300 / Descripción Física: <br>
          Extensión: {{ selectedItem.physical_desc.extension? selectedItem.physical_desc.extension : 'sin datos' }} <br>
          Material Acompañante: {{ selectedItem.physical_desc.material? selectedItem.physical_desc.material : 'sin datos' }} <br>
          490 / Mención de Serie: <br>
          Mención: {{ selectedItem.serie_mention.mention? selectedItem.serie_mention.mention : 'sin datos' }} <br>
          Designación: {{ selectedItem.serie_mention.designation? selectedItem.serie_mention.designation : 'sin datos' }} <br>
          505 / Nota de Contenido: {{ selectedItem.content_note.data? selectedItem.content_note.data : 'sin datos' }} <br>
          650 / Término Temático: {{ selectedItem.theme_termn.data? selectedItem.theme_termn.data : 'sin datos' }} <br>
          866 / Existencias: {{ selectedItem.quantity? selectedItem.quantity : 'ninguna' }}
        </v-card-text>
      </div>
    </v-expand-transition>
  </v-card>
    </v-navigation-drawer>
    <sweet-modal ref="ok" :icon="modalInfoState">{{ modalInfoMessage }}</sweet-modal>
  </v-row>
</template>


<script>
import { SweetModal, SweetModalTab } from "sweet-modal-vue"

export default {
  layout: "system",
  components: {
    SweetModal,
    SweetModalTab,
  },
  data: () => ({
    dialog: false,
    dialogDelete: false,
    dialogDetails: false,
    selectedItem: null,
    show: false,
    modalInfoState: "success",
    modalInfoMessage: "",
    headers: [
      {
        text: "ID",
        align: "start",
        sortable: false,
        value: "id",
      },
      { text: "Titulo", value: "title.principal_title" },
      { text: "Autor", value: "author.personal_name" },
      { text: "Editorial", value: "edition_mention.data" },
      { text: "Lanzamiento", value: "distribution_info.publication_date" },
      { text: "Actions", value: "actions", sortable: false },
    ],
    books: [],
    editedIndex: -1,
    editedItem: {
      ISBN: {
        normalized_number: "",
      },
      decimal_dewey_number: {
        classification_number: "",
      },
      author: {
        personal_name: "",
      },
      corporative_name: {
        entity_name: "",
      },
      principal_entry: {
        meet_name: "",
        meet_date: "",
        meet_place: "",
        meet_number: "",
      },
      title: {
        principal_title: "",
        rest_title: "",
        reponsability_mention: "",
      },
      parallel_title: {
        principal_title: "",
        rest_title: "",
      },
      edition_mention: {
        data: "",
      },
      distribution_info: {
        publication_place: "",
        editor_name: "",
        publication_date: "",
      },
      physical_desc: {
        extension: "",
        material: "",
      },
      serie_mention: {
        mention: "",
        designation: "",
      },
      content_note: {
        data: "",
      },
      theme_termn: {
        data: "",
      },
      quantity: null,
    },
    defaultItem: {
      ISBN: {
        normalized_number: "",
      },
      decimal_dewey_number: {
        classification_number: "",
      },
      author: {
        personal_name: "",
      },
      corporative_name: {
        entity_name: "",
      },
      principal_entry: {
        meet_name: "",
        meet_date: "",
        meet_place: "",
        meet_number: "",
      },
      title: {
        principal_title: "",
        rest_title: "",
        reponsability_mention: "",
      },
      parallel_title: {
        principal_title: "",
        rest_title: "",
      },
      edition_mention: {
        data: "",
      },
      distribution_info: {
        publication_place: "",
        editor_name: "",
        publication_date: "",
      },
      physical_desc: {
        extension: "",
        material: "",
      },
      serie_mention: {
        mention: "",
        designation: "",
      },
      content_note: {
        data: "",
      },
      theme_termn: {
        data: "",
      },
      quantity: null,
    },
    noDataMessage: "No hay Libros :(",
  }),

  computed: {
    formTitle() {
      return this.editedIndex === -1 ? "Agregar Libro" : "Editar Libro"
    },
  },

  watch: {
    dialog(val) {
      val || this.close()
    },
    dialogDelete(val) {
      val || this.closeDelete()
    },
  },

  created() {
    this.initialize()
    this.selectedItem = this.defaultItem
  },

  methods: {
    async initialize() {
      const res = await this.$axios.$get("/books")
      this.books = res.data
      console.log(res)
    },

    editItem(item) {
      this.editedIndex = item.id
      this.editedItem = Object.assign({}, item)
      this.dialog = true
    },

    deleteItem(item) {
      this.editedIndex = item.id
      this.dialogDelete = true
    },

    async deleteItemConfirm() {
      try {
        const res = await this.$axios.delete(`/books/${this.editedIndex}`)
        this.modalInfoState = "success"
        this.modalInfoMessage = "¡Operación Realizada!"
      } catch (error) {
        this.modalInfoMessage = "Hay prestamos asociados a este libro."
        this.modalInfoState = "error"
      }
      this.closeDelete()
      this.$refs.ok.open()
      this.initialize()
    },

    close() {
      this.dialog = false
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
      })
    },

    closeDelete() {
      this.dialogDelete = false
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
      })
    },

    async save() {
      if (this.editedIndex > -1) {
        try {
          const res = await this.$axios.put(
            `/books/${this.editedIndex}`,
            this.editedItem
          )

          this.modalInfoState = "success"
          this.modalInfoMessage = "¡Operación Realizada!"
        } catch (error) {
           this.modalInfoMessage = "¡Ha ocurrido un Error!"
           this.modalInfoState = "error"
        }
      } else {
        try {
          const res = await this.$axios.post("/books/", this.editedItem)

          this.modalInfoState = "success"
          this.modalInfoMessage = "¡Operación Realizada!"
        } catch (error) {
           this.modalInfoMessage = "¡Ha ocurrido un Error!"
           this.modalInfoState = "error"
        }
      }
      this.close()
      this.$refs.ok.open()
      await this.initialize()
    },
    showDetails(item) {
      console.log(item)
      this.selectedItem = item
      this.dialogDetails = true
    },
  },
}
</script>

<style scoped>
.newbg {
  background-color: cadetblue
}
</style>