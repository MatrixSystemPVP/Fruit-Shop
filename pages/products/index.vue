<template>
  <div>
    <Table
      title="All Products"
      :columns
      :rows
      :loading
      v-model:page="page"
      v-model:page-count="pageCount"
      v-model:page-total="pageTotal"
      :page-from
      :page-to
      :refresh
      :on-new="onNewProduct"
    >
      <template #actions-data="{ row }: { row: Products['products'][number] }">
        <UButton color="gray" variant="ghost" icon="i-heroicons-pencil-square" @click="() => onEditProduct(row)" />
        <UButton color="gray" variant="ghost" icon="i-heroicons-trash" @click="() => onDeleteProduct(row.id)" />
      </template>
    </Table>
  </div>
</template>

<script lang="ts" setup>
import type { TableColumn, TableRow } from '#ui/types'
import ProductModal from '~/components/ProductModal.vue'

const { getProducts, deleteProduct } = useApi()
const toast = useToast()

const columns: TableColumn[] = [
  { key: 'id', label: '#' },
  { key: 'name', label: 'Name' },
  { key: 'price', label: 'Price' },
  { key: 'actions', label: 'Actions' }
]
const rows: Ref<TableRow[]> = ref([])

const page = ref(1)
const pageCount = ref(10)
const pageTotal = ref(0)
const pageFrom = computed(() => (page.value - 1) * pageCount.value + 1)
const pageTo = computed(() => Math.min(page.value * pageCount.value, pageTotal.value))

const handler = () => getProducts({ limit: pageCount.value, start: pageFrom.value })
const { data, status, refresh } = await useLazyAsyncData('products', handler, { watch: [page] })

const loading = computed(() => status.value === 'pending')

watch(data, (newData) => {
  rows.value = newData?.products ?? []
  pageTotal.value = newData?.meta.count ?? 0
})

const modal = useModal()
const onEditProduct = ({ id, name, price }: Products['products'][number]) => {
  modal.open(ProductModal, {
    product: { id, name, price },
    refresh
  })
}
const onNewProduct = () => {
  modal.open(ProductModal, { refresh })
}
const onDeleteProduct = async (id: number) => {
  try {
    await deleteProduct(id)
    await refresh()
    toast.add({ title: 'Product Deleted', timeout: 2000 })
  } catch (error: any) {
    toast.add({ title: error.message, timeout: 5000, color: 'red' })
  }
}
</script>
