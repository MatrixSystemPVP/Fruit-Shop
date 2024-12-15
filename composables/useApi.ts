export const useApi = () => {
  const { $apiBaseURL, $apiFetch } = useNuxtApp()

  const get = <T, Q extends Record<string, any> = {}>(path: string, query?: Q) => $apiFetch<T>(path, { query })
  const put = <T extends Record<string, any>>(path: string, body: T) => $apiFetch(path, { method: 'PUT', body })
  const post = <T extends Record<string, any>>(path: string, body: T) => $apiFetch(path, { method: 'POST', body })
  const patch = <T extends Record<string, any>>(path: string, body: T) => $apiFetch(path, { method: 'PATCH', body })
  const remove = (path: string) => $apiFetch(path, { method: 'DELETE' })

  const getCustomers = (query?: CustomersQuery) => get<Customers>('customers', query)
  const getCustomer = (id: number) => get<Customer>(`customers/${id}`)
  const getCustomerOrders = (id: number) => get<CustomerOrders>(`customers/${id}/orders`)
  const createCustomerOrder = (id: number, body: CreateCustomerOrder) => post(`customers/${id}/orders`, body)

  const getProducts = (query?: ProductsQuery) => get<Products>('products', query)
  const createProduct = (body: CreateProduct) => post('products', body)
  const getProduct = (id: number) => get<Product>(`products/${id}`)
  const updateProduct = (id: number, body: UpdateProduct) => put(`products/${id}`, body)
  const deleteProduct = (id: number) => remove(`products/${id}`)
  const updateProductProperties = (id: number, body: UpdateProductProperties) => patch(`products/${id}`, body)
  const getProductImageLink = (id: number) => `${$apiBaseURL}products/${id}/image`
  const uploadProductImage = (id: number, body: UploadProductImage) => put(`products/${id}/image`, body)

  const getOrders = (query?: OrdersQuery) => get<Orders>('orders', query)
  const getOrder = (id: number) => get<Order>(`orders/${id}`)
  const getOrderItems = (id: number) => get<OrderItems>(`orders/${id}/items`)
  const purchaseOrder = (id: number) => put(`orders/${id}/actions/purchase`, {})
  const cancelOrder = (id: number) => put(`orders/${id}/actions/cancel`, {})

  return {
    getCustomers,
    getCustomer,
    getCustomerOrders,
    createCustomerOrder,
    getProducts,
    createProduct,
    getProduct,
    updateProduct,
    deleteProduct,
    updateProductProperties,
    getProductImageLink,
    uploadProductImage,
    getOrders,
    getOrder,
    getOrderItems,
    purchaseOrder,
    cancelOrder
  }
}

// General

export interface Meta {
  count: number
  start: number
  limit: number
  previous_link?: string
  next_link?: string
}

// Customer(s)

export interface CustomersQuery {
  start?: number
  limit?: number
}

export interface Customers {
  meta: Meta
  customers: {
    id: number
    name: string
    self_link: string
  }[]
}

export interface Customer {
  firstname: string
  lastname: string
  orders_url?: string
  customer_url?: string
}

export interface CustomerOrders {
  meta: Meta
  orders: {
    id: number
    state: OrderState
    customer: number
  }[]
}

export interface CreateCustomerOrder {
  items: {
    product: number
    quantity: number
  }[]
}

// Product(s)

export interface ProductsQuery {
  start?: number
  limit?: number
  name?: string
  price?: string
  sort?: 'id' | 'name' | 'price'
  order?: 'desc' | 'asc'
  modified_since?: string
}

export interface Products {
  meta: Meta
  products: {
    id: number
    name: string
    self_link: string
  }[]
}

export interface CreateProduct {
  name: string
  price: number
}

export interface Product {
  id: number
  name: string
  price: number
  image_link: string
  modified_at: string
}

export interface UpdateProduct {
  name: string
  price: number
}

export interface UpdateProductProperties {
  name?: string
  price?: number
}

export interface UploadProductImage {
  file: string // TODO: Check if the Type is correct
}

// Order(s)

export type OrderState = 'CREATED' | 'ORDERED' | 'DELIVERED' | 'CANCELED'

export interface OrdersQuery {
  start?: number
  limit?: number
  state?: OrderState
}

export interface Orders {
  meta: Meta
  orders: {
    id: number
    state: OrderState
    items: {
      product_id: number
      quantity: number
    }[]
    customer: { id: number } & Customer
    self_link?: string
  }[]
}

export interface Order {
  id: number
  state: OrderState
  customer: number
  customer_link: string
  items_link: string
  total: number
  createdAt?: string
  updatedAt?: string
}

export interface OrderItems {
  order_link: string
  items: {
    product: number
    quantity: number
  }[]
}
