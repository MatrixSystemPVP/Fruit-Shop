export default defineNuxtPlugin((nuxtApp) => {
  const baseURL = 'https://api.predic8.de/shop/v2/'
  const apiFetch = $fetch.create({ baseURL })

  return {
    provide: {
      apiBaseURL: baseURL,
      apiFetch
    }
  }
})
