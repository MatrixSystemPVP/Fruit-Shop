<template>
  <UCard>
    <template #header>
      <div class="flex items-center justify-between gap-3">
        <div class="flex">
          <UButton variant="ghost" icon="i-heroicons-arrow-path" color="white" aria-label="Refresh" @click="refresh" :loading />
          <h2 class="text-xl font-semibold leading-tight text-gray-900 dark:text-white">{{ title }}</h2>
        </div>
        <div class="flex gap-3">
          <!-- <UInput v-model="search" icon="i-heroicons-magnifying-glass-20-solid" placeholder="Search..." /> -->
          <UButton v-if="onNew != undefined" color="primary" icon="i-heroicons-plus" label="Neu" @click="onNew" />
        </div>
      </div>
    </template>
    <UTable :columns :rows :loading>
      <!-- https://gist.github.com/loilo/73c55ed04917ecf5d682ec70a2a1b8e2?permalink_comment_id=5211139#bonus-b-vue-3 -->
      <template v-for="(_, name) in $slots" v-slot:[name]="slotData"><slot :name="name" v-bind="slotData" /></template>
    </UTable>
    <template #footer>
      <div class="flex flex-wrap items-center justify-between">
        <div>
          <span class="text-sm leading-5">
            Showing
            <span class="font-medium">{{ pageFrom }}</span>
            to
            <span class="font-medium">{{ pageTo }}</span>
            of
            <span class="font-medium">{{ pageTotal }}</span>
            results
          </span>
        </div>
        <UPagination v-model="page" :page-count="pageCount" :total="pageTotal" />
      </div>
    </template>
  </UCard>
</template>

<script lang="ts" setup>
import type { TableColumn, TableRow } from '#ui/types'

defineProps<{
  title: string
  columns: TableColumn[]
  rows: TableRow[]
  loading: boolean
  pageFrom: number
  pageTo: number
  refresh: () => void
  onNew?: () => void
}>()

const page = defineModel<number>('page', { default: 1 })
const pageCount = defineModel<number>('pageCount', { default: 10 })
const pageTotal = defineModel<number>('pageTotal', { default: 0 })
</script>
