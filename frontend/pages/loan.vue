<template>
  <v-row>
    <v-col cols=1></v-col>
    <v-col cols="8">
      <v-data-table
    :headers="headers"
    :items="books"
    sort-by="created_at"
    class="elevation-5 mx-auto mt-10"
  >
    <template v-slot:top>
      <v-toolbar
        flat
      >
        <v-toolbar-title>Prestamos </v-toolbar-title>
        <v-divider
          class="mx-4"
          inset
          vertical
        ></v-divider>
        <v-spacer></v-spacer>
        <v-dialog v-model="dialogDelete" max-width="500px">
          <v-card>
            <v-card-title class="text-h5">Seguro que quieres borrar este registro?</v-card-title>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" text @click="closeDelete">Cancelar</v-btn>
              <v-btn color="blue darken-1" text @click="deleteItemConfirm">OK</v-btn>
              <v-spacer></v-spacer>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-toolbar>
    </template>
    <template v-slot:item.actions="{ item }">
      <v-icon
        small
        class="mr-2"
        @click="editItem(item)"
      >
        mdi-pencil
      </v-icon>
      <v-icon
        small
        @click="deleteItem(item)"
      >
        mdi-delete
      </v-icon>
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
    layout: 'system',
    data: () => ({
      dialog: false,
      dialogDelete: false,
      headers: [
        {
          text: 'ID',
          align: 'start',
          sortable: false,
          value: 'id',
        },
        { text: 'Nombre', value: 'user.first_name' },
        { text: 'Apellido', value: 'user.last_name' },
        { text: 'Libro', value: 'book.title.principal_title'},
        { text: 'CI', value: 'user.ci' },
        { text: 'Fecha', value: 'created_at'},
        { text: 'Fecha Máxima', value: 'limit' || 'Ninguna'},
        { text: 'Actions', value: 'actions', sortable: false }
      ],
      books: [],
      editedIndex: -1,
      editedItem: {
        
      },
      defaultItem: {
        first_name: '',
        last_name: '',
        ci: ''
      },
      noDataMessage: 'No hay Prestamos :('
    }),

    computed: {
      formTitle () {
        return this.editedIndex === -1 ? 'Agregar Prestamo' : 'Editar Prestamo'
      },
    },

    watch: {
      dialog (val) {
        val || this.close()
      },
      dialogDelete (val) {
        val || this.closeDelete()
      },
    },

    created () {
      this.initialize()
    },

    methods: {
      async initialize () {

        const res = await this.$axios.$get('/loans')
        this.books = res.data
        console.log(res)
      },

      editItem (item) {
        this.editedIndex = item.id
        this.editedItem = Object.assign({}, item)
        this.dialog = true
      },

      deleteItem (item) {
        this.editedIndex = item.id
        this.dialogDelete = true
      },

      async deleteItemConfirm () {
        const response = await this.$axios.delete(`/loans/${this.editedIndex}`)
        this.initialize()
        this.closeDelete()
      },

      close () {
        this.dialog = false
        this.$nextTick(() => {
          this.editedItem = Object.assign({}, this.defaultItem)
          this.editedIndex = -1
        })
      },

      closeDelete () {
        this.dialogDelete = false
        this.$nextTick(() => {
          this.editedItem = Object.assign({}, this.defaultItem)
          this.editedIndex = -1
        })
      },

      async save () {
        if (this.editedIndex > -1) {
          const response = await this.$axios.put(`/loans/${this.editedIndex}`, this.editedItem)
        } else {
          const response = await this.$axios.post('/loans/', this.editedItem)
        }
        await this.initialize()
        this.close()
      },
    },
  }
</script>