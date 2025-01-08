import vuetify from 'vite-plugin-vuetify'
// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  srcDir: './src',
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  ssr: false,
  runtimeConfig: {
    public: {
      baseApiUrl: '',
    },
  },
  build: {
    transpile: ['vuetify'],
  },
  hooks: {
    'vite:extendConfig': (config) => {
      config.plugins!.push(vuetify())
    },
  },
  vite: {
    ssr: {
      noExternal: ['vuetify'],
    },
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
  },
  css: ['~/assets/scss/main.scss'],
  modules: [
    '@nuxt/eslint',
    '@pinia/nuxt',
    '@nuxtjs/google-fonts',
    '@pinia-plugin-persistedstate/nuxt',
  ],
  googleFonts: {
    families: {
      'IBM+Plex+Sans+Thai': true,
    },
    display: 'swap',
    download: true,
    preload: true,
  },
  piniaPersistedstate: {
    cookieOptions: {
      sameSite: 'strict',
    },
    storage: 'localStorage',
  },
  pinia: {
    storesDirs: ['./stores/**'],
  },
  
})
