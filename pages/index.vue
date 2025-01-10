<template>
  <div class="grid gap-4 grid-cols-[repeat(auto-fit,_minmax(18rem,_1fr))]">
    <div v-for="product of products" class="w-72 shadow-md rounded-xl duration-500 hover:shadow-xl m-auto">
      <NuxtImg
        :src="getProductImageLink(product.id)"
        :alt="'Image of ' + product.name"
        class="h-80 w-72 object-cover rounded-t-xl text-center"
        draggable="false"
      />
      <div class="px-4 py-3 w-72">
        <p class="text-lg font-bold truncate block capitalize">{{ product.name }}</p>
        <div class="flex items-center">
          <p class="text-lg font-semibold cursor-auto my-3">${{ product.price }}</p>
          <div class="ml-auto">
            <UButton icon="i-material-symbols-add-shopping-cart" variant="ghost" @click="addItemToCart(product.id, product.name)" />
          </div>
        </div>
      </div>
    </div>
  </div>
  <div class="flex items-center justify-center m-4">
    <UButton v-if="moreData" label="Load more" :loading @click="page++" class="" />
  </div>
</template>

<script lang="ts" setup>
const { getProducts, getProductImageLink } = useApi()
const { addItem } = useCart()
const toast = useToast()

const page = ref(1)
const pageCount = ref(12)
const pageTotal = ref(0)
const pageFrom = computed(() => (page.value - 1) * pageCount.value + 1)

const products = ref<Product[]>([])

const handler = () => getProducts({ limit: pageCount.value, start: pageFrom.value })
const { data, status, refresh } = await useLazyAsyncData('products', handler, { watch: [page] })

const loading = computed(() => status.value === 'pending')
const moreData = computed(() => pageTotal.value > page.value * pageCount.value)

watch(data, (newData) => {
  newData?.products.forEach((product) => products.value.push(product))
  pageTotal.value = newData?.meta.count ?? 0
})

const addItemToCart = (id: number, name: string) => {
  addItem(id)
  toast.add({ title: name + ' added to Cart', timeout: 2000 })
}
</script>
