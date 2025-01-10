<template>
  <div>
    <UHorizontalNavigation :links class="mb-8" />
    <slot />
  </div>
</template>

<script lang="ts" setup>
import type { HorizontalNavigationLink } from '#ui/types'
import type { Reactive } from 'vue'

const { itemCount } = useCart()

const links: Reactive<HorizontalNavigationLink[][]> = reactive([
  [
    { label: 'Home', icon: 'i-heroicons-home', to: '/' },
    { label: 'Products', icon: 'i-heroicons-building-storefront', to: '/products' },
    { label: 'Customers', icon: 'i-heroicons-user-group-solid', to: '/customers' },
    { label: 'Orders', icon: 'i-heroicons-clipboard-document-list', to: '/orders' }
  ],
  [{ label: 'Cart', icon: 'i-heroicons-shopping-cart', to: '/cart', badge: itemCount }]
])
</script>
