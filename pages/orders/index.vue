<template>
  <div>
    <Table
      title="All Orders"
      :columns
      :rows
      :loading
      v-model:page="page"
      v-model:page-count="pageCount"
      v-model:page-total="pageTotal"
      :page-from
      :page-to
      :refresh
    >
      <template #customer-data="{ row }: { row: Orders['orders'][number] }">
        <p>{{ row.customer.firstname }} {{ row.customer.lastname }}</p>
      </template>
      <template #items-data="{ row }: { row: Orders['orders'][number] }">
        <p>{{ row.items.length }} ({{ row.items.map((value) => value.quantity).reduce((prev, curr) => prev + curr) }})</p>
      </template>
    </Table>
  </div>
</template>

<script lang="ts" setup>
import type { TableColumn, TableRow } from '#ui/types'
import type { Orders } from '~/composables/useApi'

const { getOrders } = useApi()

const columns: TableColumn[] = [
  { key: 'id', label: '#' },
  { key: 'state', label: 'State' },
  { key: 'customer', label: 'Customer' },
  { key: 'items', label: 'Items (Total)' },
  { key: 'actions', label: 'Actions' }
]
const rows: Ref<TableRow[]> = ref([])

const page = ref(1)
const pageCount = ref(10)
const pageTotal = ref(0)
const pageFrom = computed(() => (page.value - 1) * pageCount.value + 1)
const pageTo = computed(() => Math.min(page.value * pageCount.value, pageTotal.value))

const handler = () => getOrders({ limit: pageCount.value, start: pageFrom.value })
const { data, status, refresh } = await useLazyAsyncData('orders', handler, { watch: [page] })

const loading = computed(() => status.value === 'pending')

watch(data, (newData) => {
  rows.value = newData?.orders ?? []
  pageTotal.value = newData?.meta.count ?? 0
})
</script>
