<template>
  <div class="shadow rounded-xl md:grid md:grid-cols-3">
    <div class="p-4 md:col-span-2">
      <div class="md:h-10 flex items-center">
        <h1 class="text-2xl font-bold">Shopping Cart</h1>
        <p class="ml-auto text-gray-500">{{ cart.length }} item(s)</p>
      </div>
      <UTable :columns :rows="cart" :loading class="md:max-h-[80vh]">
        <template #name-data="{ row }: { row: Cart[number] }">
          {{ products.find((value) => value.id === row.id)?.name }}
        </template>
        <template #amount-data="{ row }: { row: Cart[number] }">
          <div class="flex justify-center">
            <UButton icon="i-heroicons-minus" variant="ghost" color="gray" size="2xs" @click="row.amount > 1 ? row.amount-- : ''" />
            <span class="border px-1 my-auto">{{ row.amount }}</span>
            <UButton icon="i-heroicons-plus" variant="ghost" color="gray" size="2xs" @click="row.amount++" />
          </div>
        </template>
        <template #price-data="{ row }: { row: Cart[number] }">
          <span>${{ (row.amount * (products.find((value) => value.id === row.id)?.price ?? NaN)).toFixed(2) }}</span>
        </template>
        <template #action-data="{ row }: { row: Cart[number] }">
          <UButton icon="i-heroicons-x-mark" variant="ghost" color="gray" @click="removeItem(row.id)" />
        </template>
      </UTable>
    </div>
    <div class="bg-gray-100 dark:bg-gray-900 p-4 rounded-b-xl md:rounded-r-xl md:rounded-bl-none">
      <div class="md:h-10">
        <h2 class="text-2xl font-bold mt-auto">Summary</h2>
      </div>
      <UDivider class="my-4" />
      <h3 class="text-xl text-gray-700 dark:text-gray-400 mb-1">Customer</h3>
      <USelectMenu v-model="selectedCustomer" :options="customers?.customers" value-attribute="id" option-attribute="name" />
      <UDivider class="my-4" />
      <div class="flex justify-between font-semibold text-gray-700 dark:text-gray-400">
        <p class="uppercase">Total Price</p>
        <p>${{ totalPrice }}</p>
      </div>
      <UButton icon="i-heroicons-rocket-launch" block class="mt-6" :disabled="cart.length === 0" :loading="submitLoading" @click="submitOrder">
        Submit Order
      </UButton>
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { TableColumn } from '#ui/types'

const { cart, removeItem } = useCart()
const { getProduct, getCustomers, createCustomerOrder } = useApi()
const toast = useToast()

const columns: TableColumn[] = [
  { key: 'name' },
  { key: 'amount' },
  { key: 'price', rowClass: 'text-center' },
  { key: 'action', rowClass: 'text-right' }
]

const { data: products, status } = await useLazyAsyncData<Product[]>(
  'cart_products',
  async () => {
    const products: Product[] = []
    for (const item of cart.value) {
      try {
        products.push(await getProduct(item.id))
      } catch (error: any) {
        removeItem(item.id)
        toast.add({ title: `Not found Product with ID ${item.id} has been removed from the Cart`, timeout: 5000, color: 'red' })
      }
    }
    return products
  },
  { default: () => [] }
)
const loading = computed(() => status.value === 'pending')
const totalPrice = computed(() => {
  return cart.value
    .map((item) => item.amount * (products.value.find((product) => product.id === item.id)?.price ?? NaN))
    .reduce((prev, curr) => prev + curr, 0)
    .toFixed(2)
})

const handler = () => getCustomers()
const { data: customers } = await useLazyAsyncData<Customers>('customers', handler)
const selectedCustomer = ref<number>()

const submitLoading = ref(false)
const submitOrder = async () => {
  if (selectedCustomer.value === undefined) {
    toast.add({ title: 'Please select a Customer', timeout: 5000, color: 'red' })
    return
  }
  submitLoading.value = true
  try {
    await createCustomerOrder(selectedCustomer.value, { items: cart.value.map((value) => ({ product: value.id, quantity: value.amount })) })
    toast.add({ title: 'Sucessfully created your Order', timeout: 3000 })
    cart.value = []
  } catch (error: any) {
    toast.add({ title: error.message, timeout: 5000, color: 'red' })
  }
  submitLoading.value = false
}
</script>
