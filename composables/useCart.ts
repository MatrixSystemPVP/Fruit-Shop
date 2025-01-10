export const useCart = () => {
  const cart = useState<Cart>('cart', () => JSON.parse(localStorage.getItem('cart') ?? '[]') as Cart)

  watch(cart, (value) => localStorage.setItem('cart', JSON.stringify(value)), { deep: true })

  const itemCount = computed(() =>
    cart.value.map((value) => value.amount).reduce((previousValue, currentValue) => (currentValue += previousValue), 0)
  )

  const addItem = (id: number) => {
    const item = cart.value.find((value) => value.id === id)
    if (item === undefined) {
      cart.value.push({ id, amount: 1 })
    } else {
      item.amount++
    }
  }
  const removeItem = (id: number) => {
    const itemIndex = cart.value.findIndex((value) => value.id === id)
    if (itemIndex !== -1) {
      cart.value.splice(itemIndex, 1)
    }
  }
  const setItem = (id: number, amount: number) => {
    const item = cart.value.find((value) => value.id === id)
    if (item === undefined) {
      cart.value.push({ id, amount })
    } else {
      item.amount = amount
    }
  }

  return { cart, itemCount, addItem, removeItem, setItem }
}

export type Cart = {
  id: number
  amount: number
}[]
