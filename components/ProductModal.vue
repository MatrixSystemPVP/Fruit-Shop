<template>
  <UModal v-model="isOpen">
    <UForm :validate :state @submit="onSubmit">
      <UCard>
        <template #header>
          <h1>{{ isNew ? 'Create' : 'Edit' }} Product</h1>
        </template>

        <UFormGroup label="Name" name="name">
          <UInput v-model="state.name" />
        </UFormGroup>

        <UFormGroup label="Price" name="price">
          <UInput v-model="state.price" type="number" step="0.01" min="0" />
        </UFormGroup>

        <template #footer>
          <UButton type="submit">Submit</UButton>
        </template>
      </UCard>
    </UForm>
  </UModal>
</template>

<script lang="ts" setup>
import type { FormError, FormSubmitEvent } from '#ui/types'

const { createProduct, updateProduct } = useApi()

const isOpen = defineModel<boolean>('isOpen', { default: false })
const loading = ref(false)

const props = defineProps<{
  product?: {
    id: number
    name: string
    price: number
  }
}>()

const state = reactive({
  name: props.product?.name,
  price: props.product?.price
})

const isNew = computed(() => props.product == undefined)

const validate = (validateState: typeof state): FormError[] => {
  const errors = []
  if (!validateState.name) errors.push({ path: 'name', message: 'Required' })
  if (!validateState.price) errors.push({ path: 'price', message: 'Required' })
  return errors
}

async function onSubmit(event: FormSubmitEvent<any>) {
  loading.value = true
  if (isNew.value) {
    const res = await createProduct({ name: state.name!, price: state.price! })
  } else {
    const res = await updateProduct(props.product!.id, { name: state.name!, price: state.price! })
  }
  loading.value = false
}
</script>
