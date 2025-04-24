export interface Price {
  id: string
  product_id: string
  active: boolean
  description: string | null
  unit_amount: number | null
  currency: string
  type: string
  interval: string | null
  interval_count: number | null
  trial_period_days: number | null
  metadata: Record<string, string> | null
}

export interface Product {
  id: string
  active: boolean
  name: string
  description: string | null
  image: string | null
  metadata: Record<string, string> | null
}

export interface Subscription {
  id: string
  user_id: string
  status: string
  metadata: Record<string, string> | null
  price_id: string
  quantity: number | null
  cancel_at_period_end: boolean
  created: string
  current_period_start: string
  current_period_end: string
  ended_at: string | null
  cancel_at: string | null
  canceled_at: string | null
  trial_start: string | null
  trial_end: string | null
}

export interface SubscriptionWithPrice extends Subscription {
  prices: Price
  products: Product
}
