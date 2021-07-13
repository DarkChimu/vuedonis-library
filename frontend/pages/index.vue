<template>
  <v-row>
    <v-col cols="8">
      <v-img
        lazy-src="https://picsum.https://lapiedradesisifo.com/wp-content/uploads/2019/10/libreria-para-empresas.jpg"
        min-height="99vh"
        min-width="50vh"
        margin="0"
        src="https://lapiedradesisifo.com/wp-content/uploads/2019/10/libreria-para-empresas.jpg"
      ></v-img>
    </v-col>

    <v-col cols="4">
      <v-container>
        <v-card ref="form" elevation="0" class="ma-0">
          <v-card-text>
            <v-text-field
              ref="email"
              v-model="email"
              :rules="[() => !!name || 'Este Campo es Requerido']"
              :error-messages="errorMessages"
              label="Email"
              placeholder="juan@example.com"
              required
            ></v-text-field>
            <v-text-field
              v-model="password"
              :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
              :rules="[rules.required, rules.min]"
              :type="show1 ? 'text' : 'password'"
              name="input-10-1"
              label="Contraseña"
              hint="Almenos 8 carácteres"
              counter
              @click:append="show1 = !show1"
            ></v-text-field>
          </v-card-text>
          <v-col xs="12">
            <v-btn color="primary" elevation="2" @click="attemptLogin">Acceder</v-btn>
            <v-btn color="primary" elevation="2" @click.stop="drawer = !drawer"
              >Registro</v-btn
            >
          </v-col>
        </v-card>
      </v-container>
    </v-col>
    <v-navigation-drawer v-model="drawer" absolute temporary width="27vw">
      <v-container>
        <v-card ref="form" elevation="0" class="ma-0">
          <v-card-text>
            <h1 class="title mb-6">Registro</h1>
            <v-text-field
              ref="name"
              v-model="regName"
              :rules="[() => !!regName || 'Este Campo es Requerido']"
              :error-messages="errorMessages"
              label="Nombre de Usuario"
              placeholder="John Doe"
              required
            ></v-text-field>
            <v-text-field
              ref="name"
              v-model="regFirst"
              :rules="[() => !!regFirst || 'Este Campo es Requerido']"
              :error-messages="errorMessages"
              label="Nombre"
              placeholder="John Doe"
              required
            ></v-text-field>
            <v-text-field
              ref="name"
              v-model="regLast"
              :rules="[() => !!regLast || 'Este Campo es Requerido']"
              :error-messages="errorMessages"
              label="Apellido"
              placeholder="John Doe"
              required
            ></v-text-field>
            <v-text-field
              ref="name"
              v-model="regCI"
              :rules="[() => !!regCI || 'Este Campo es Requerido']"
              :error-messages="errorMessages"
              label="Cédula"
              placeholder="John Doe"
              required
            ></v-text-field>
            <v-text-field
              ref="name"
              v-model="regAddress"
              :rules="[() => !!regAddress || 'Este Campo es Requerido']"
              :error-messages="errorMessages"
              label="Dirección"
              placeholder="John Doe"
              required
            ></v-text-field>
            <v-text-field
              ref="email"
              v-model="regEmail"
              :rules="[() => !!regEmail || 'Este Campo es Requerido']"
              :error-messages="errorMessages"
              label="Email"
              placeholder="juan@example.com"
              required
            ></v-text-field>
            <v-text-field
              v-model="regPassword"
              :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
              :rules="[rules.required, rules.min]"
              :type="show1 ? 'text' : 'password'"
              name="input-10-1"
              label="Contraseña"
              hint="Almenos 8 carácteres"
              counter
              @click:append="show1 = !show1"
            ></v-text-field>
          </v-card-text>
          <v-col xs="12">
            <v-btn color="primary" elevation="2" @click="sendRegister">Enviar</v-btn>
          </v-col>
        </v-card>
      </v-container>
    </v-navigation-drawer>
    <v-overlay :value="overlay">
      <v-progress-circular
        indeterminate
        size="64"
      ></v-progress-circular>
    </v-overlay>
  </v-row>
</template>

<script>

import axios from '@nuxtjs/axios'

export default {
  middleware: 'guest',
  data: () => ({
    overlay: false,
    show1: false,
    password: "",
    rules: {
      required: (value) => !!value || "Este campo es requerido.",
      min: (v) => v.length >= 8 || "Mínimo 8 caracteres",
      emailMatch: () => `The email and password you entered don't match`,
    },
    errorMessages: "",
    name: '',
    address: '',
    city: '',
    state: '',
    zip: '',
    country: '',
    formHasErrors: false,
    email: '',
    drawer: false,
    regName: '',
    regFirst: '',
    regLast: '',
    regCI: '',
    regAddress: '',
    regEmail: '',
    regPassword: '',
    items: [
      { title: "Home", icon: "mdi-view-dashboard" },
      { title: "About", icon: "mdi-forum" },
    ],
  }),

  computed: {
    form() {
      return {
        name: this.name,
        address: this.address,
        city: this.city,
        state: this.state,
        zip: this.zip,
        country: this.country,
        email: this.email,
        password: this.password,
        regName: this.regName,
        regEmail: this.regEmail,
        regPassword: this.regPassword,
        regCI: this.regCI,
        regAddress: this.regAddress,
        regFirst: this.regFirst,
        regLast: this.regLast
      };
    },
  },

  watch: {
    name() {
      this.errorMessages = "";
    }
  },

  methods: {
    addressCheck() {
      this.errorMessages =
        this.address && !this.name ? `Hey! I'm required` : "";

      return true;
    },
    resetForm() {
      this.errorMessages = [];
      this.formHasErrors = false;

      Object.keys(this.form).forEach((f) => {
        this.$refs[f].reset();
      });
    },
    submit() {
      this.formHasErrors = false;

      Object.keys(this.form).forEach((f) => {
        if (!this.form[f]) this.formHasErrors = true;

        this.$refs[f].validate(true);
      });
    },
    async sendRegister(){
      this.overlay = true
      try {
        const res = await this.$axios.$post(
        '/register', 
        { 
          username: this.regName, 
          email: this.regEmail, 
          password: this.regPassword,
          first_name: this.regFirst,
          last_name: this.regLast,
          ci: this.regCI,
          address: this.regAddress
        }
        )

        await this.$auth.loginWith('local', {
          data: {
          email: this.regEmail,
          password: this.regPassword
          },
        })
        
        this.$router.push({ name: 'home'})

      } catch (error) {
        console.log(error)
        this.drawer = false
        this.overlay = false
      }
    },
    async attemptLogin() {
      try {
        await this.$auth.loginWith('local', {
          data: {
          email: this.email,
          password: this.password
          }
        })

        this.$router.push('/home')
      } catch (e) {
        this.error = e.response.data.message
      }
    }
  },
};
</script>