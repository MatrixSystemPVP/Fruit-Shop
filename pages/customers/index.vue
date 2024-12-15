<template>
  <div>
    <Table
      title="All Customers"
      :columns
      :rows
      :loading
      v-model:page="page"
      v-model:page-count="pageCount"
      v-model:page-total="pageTotal"
      :page-from
      :page-to
      :refresh
    />
  </div>
</template>

<script lang="ts" setup>
import type { TableColumn, TableRow } from '#ui/types'

const { getCustomers } = useApi()

const columns: TableColumn[] = [
  { key: 'id', label: '#' },
  { key: 'name', label: 'Name' },
  { key: 'actions', label: 'Actions' }
]
const rows: Ref<TableRow[]> = ref([])

const page = ref(1)
const pageCount = ref(10)
const pageTotal = ref(0)
const pageFrom = computed(() => (page.value - 1) * pageCount.value + 1)
const pageTo = computed(() => Math.min(page.value * pageCount.value, pageTotal.value))

const handler = () => getCustomers({ limit: pageCount.value, start: pageFrom.value })
const { data, status, refresh } = await useLazyAsyncData('customers', handler, { watch: [page] })

const loading = computed(() => status.value === 'pending')

watch(data, (newData) => {
  rows.value = newData?.customers ?? []
  pageTotal.value = newData?.meta.count ?? 0
})
</script>
