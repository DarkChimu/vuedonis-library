<template>
  <v-row>
    <v-container>
      <v-col cols="3">
        <v-text-field
          v-model="search"
          label="Buscar"
          solo
          @input="searchBook"
        />
      </v-col>
      <v-col style="min-height: 75vh">
        <v-row>
          <v-col class="ml-1" cols="3" v-for="item of books" :key="item.id">
            <v-card>
              <v-img
                class="white--text align-end"
                height="200px"
                :src="
                  item.book.photo_url
                    ? item.book.photo_url
                    : 'https://www.nescavacanze.it/images/uploads/img.jpg'
                "
              >
                <v-card-title>{{
                  item.book.title.principal_title
                }}</v-card-title>
              </v-img>

              <v-card-subtitle class="pb-0">
                {{ item.book.author.personal_name }}
              </v-card-subtitle>

              <v-card-text class="text--primary">
                <div>{{ item.book.distribution_info.publication_date }}</div>
              </v-card-text>

              <v-card-actions>
                <v-btn color="light-blue" text @click="showPrestamo(item)">
                  Cancelar
                </v-btn>

                <v-btn color="light-blue" text @click="showInfo(item)">
                  Detalles
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>
      </v-col>
    </v-container>
    <div
      style="position: relative; width: 100%; bottom: 1px"
      class="text--center"
    >
      <v-pagination
        v-model="queryParams.page"
        :length="queryTotal"
        circle
      ></v-pagination>
    </div>
    <v-dialog v-model="dialog" max-width="500px">
      <v-card>
        <v-card-title>
          <span
            >{{ selectedBook.title.principal_title }} de
            {{ selectedBook.author.personal_name }}</span
          >
          <v-spacer></v-spacer>
          <v-menu bottom left>
            <template v-slot:activator="{ on, attrs }">
              <v-btn icon v-bind="attrs" v-on="on">
                <v-icon>mdi-dots-vertical</v-icon>
              </v-btn>
            </template>
          </v-menu>
        </v-card-title>
        <v-card-text>
          {{ selectedBook.theme_termn.data }}
        </v-card-text>
        <v-card-actions>
          <v-btn color="light-blue" text @click="dialog = false">
            Cerrar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="dialogLoan" max-width="500px">
      <v-card>
        <v-card-title>
          <span> Confirmación</span>
          <v-spacer></v-spacer>
        </v-card-title>
        <v-card-text>
          Seguro que quieres cancelar el prestamo de
          {{ selectedBook.title.principal_title }} de
          {{ selectedBook.author.personal_name }} ?
        </v-card-text>
        <v-card-actions>
          <v-btn color="light-blue" text @click="cancelLoan(selectedLoan.id)">
            Si
          </v-btn>
          <v-btn color="light-blue" text @click="dialogLoan = false">
            Cancelar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-overlay :value="overlay">
      <v-progress-circular indeterminate size="64"></v-progress-circular>
    </v-overlay>
    <sweet-modal ref="ok" :icon="modalInfoState">{{
      modalInfoMessage
    }}</sweet-modal>
  </v-row>
</template>

<script>
import { mapGetters } from "vuex";
import { SweetModal, SweetModalTab } from "sweet-modal-vue";

export default {
  layout: "system",
  components: {
    SweetModal,
    SweetModalTab,
  },
  data: () => ({
    overlay: false,
    queryParams: {
      page: 1,
      perPage: 10,
    },
    queryTotal: 0,
    dialog: false,
    dialogLoan: false,
    books: [],
    search: "",
    modalInfoState: "success",
    modalInfoMessage: "",
    selectedLoan: {},
    selectedBook: {
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
  }),
  mounted() {
    this.initialize();
  },
  watch: {
    search() {
      this.queryParams.page = 1;
      this.initialize();
    },
  },
  computed: {
    ...mapGetters(["loggedInUser"]),
  },
  methods: {
    async initialize(search) {
      this.overlay = true;
      let URL = `/users/${this.$auth.user.id}/myBooks`;

      if (search) {
        URL = URL + `?search=${search}`;
      }

      const res = await this.$axios.$get(URL, {
        params: this.queryParams,
      });
      this.queryTotal = res.lastPage;
      res.data.forEach((item) => {
        item.limit
          ? (item.limit = item.limit.split("T")[0])
          : (item.limit = "");
        item.delivered
          ? (item.delivered = item.delivered.split("T")[0])
          : (item.delivered = "");
      });
      this.books = await res.data;
      this.overlay = false;
      this.limitAlert(this.books);
    },
    showInfo(item) {
      this.selectedLoan = item;
      this.selectedBook = item.book;
      this.dialog = true;
    },
    showPrestamo(item) {
      this.selectedLoan = item;
      this.selectedBook = item.book;
      this.dialogLoan = true;
    },
    searchBook() {
      // cancel pending call
      clearTimeout(this.timerId);
      // delay new call 500ms
      this.timerId = setTimeout(() => {
        // Funcion que busca las utms
        this.initialize(this.search);
      }, 1000);
    },
    async cancelLoan(book) {
      const res = await this.$axios.delete(`/loans/${book}`);

      if (res.data.success) {
        this.dialogLoan = false;
        this.modalInfoMessage = "¡Operación Realizada!";
        this.modalInfoState = "success";
        this.$refs.ok.open();
      } else {
        this.dialogLoan = false;
        this.modalInfoMessage = "¡Ha ocurrido un Error!";
        this.modalInfoState = "error";
        this.$refs.ok.open();
      }
    },
    limitAlert(books) {
      console.log(books[0])
      let today = new Date();
      let currentDate =
        today.getFullYear() +
        "-" +
        (today.getMonth() + 1) +
        "-" +
        today.getDate();
      let toBeDelivered = []
      
      books.forEach((item) => {
        let limit = item.limit.split("-");
        let currentDateArray = currentDate.split("-");

        if (
          Number(limit[0]) === Number(currentDateArray[0]) &&
          Number(limit[2]) === Number(currentDateArray[1]) &&
          Number(limit[1]) >= Number(currentDateArray[2]) &&
          Number(limit[1]) - Number(currentDateArray[2]) <= 3
        ) {
           toBeDelivered.push(`${item.book.title.principal_title} en ${Math.abs(
            limit[1] - currentDateArray[2])} días`)
        }
      });

      console.log(currentDate)
      console.log()
      if (toBeDelivered.length > 0) {
        this.modalInfoMessage = `¡Tus Prestamos de: ${toBeDelivered.join(
          " ,"
        )} están a punto de vencer!`;
        this.modalInfoState = "info";
        this.$refs.ok.open();
      }
    },
  },
};
</script>
