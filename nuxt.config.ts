import vuetify from 'vite-plugin-vuetify'
// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  build: {
    transpile: ['vuetify'],
  },
  compatibilityDate: '2024-11-01',
  css: ['~/assets/scss/main.scss'],
  devtools: { enabled: true },
  googleFonts: {
    display: 'swap',
    download: true,
    families: {
      'IBM+Plex+Sans+Thai': true,
    },
    preload: true,
  },
  hooks: {
    'vite:extendConfig': (config) => {
      config.plugins!.push(vuetify())
    },
  },
  modules: [
    '@nuxt/eslint',
    '@pinia/nuxt',
    '@nuxtjs/google-fonts',
    '@pinia-plugin-persistedstate/nuxt',
    '@nuxt/content',
    '@nuxtjs/mdc',
  ],
  pinia: {
    storesDirs: ['./stores/**'],
  },
  piniaPersistedstate: {
    cookieOptions: {
      sameSite: 'strict',
    },
    storage: 'localStorage',
  },
  runtimeConfig: {
    public: {
      baseApiUrl: '',
      socketChat: '',
    },
  },
  srcDir: './src',
  ssr: false,
  vite: {
    define: {
      'process.env.DEBUG': false,
    },
    optimizeDeps: {
      include: ['plotly.js-dist-min'],
    },
    server: {
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
    },
    ssr: {
      noExternal: ['vuetify'],
    },
  },
})