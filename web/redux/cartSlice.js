import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  count: 0,
  cart: {},
  sum: 0
}

/**
 * Cart state. Keyed by product _id so quantity changes are a lookup rather than
 * a scan, with running count and sum kept alongside so the header badge and
 * totals never have to recompute over the whole cart.
 */
const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const item = action.payload
      const price = item.defaultProductVariant.price * item.count
      const existing = state.cart[item._id]

      if (existing) {
        existing.count += item.count
      } else {
        state.cart[item._id] = item
      }

      state.count += item.count
      state.sum += price
    },

    removeOneFromCart: (state, action) => {
      const item = action.payload
      const existing = state.cart[item._id]
      if (!existing) return

      const price = item.defaultProductVariant.price

      if (existing.count > 1) {
        existing.count -= 1
      } else {
        delete state.cart[item._id]
      }

      state.count -= 1
      state.sum -= price
    },

    removeAllFromCart: (state, action) => {
      const item = action.payload
      const existing = state.cart[item._id]
      if (!existing) return

      const price = item.defaultProductVariant.price

      state.count -= existing.count
      state.sum -= existing.count * price
      delete state.cart[item._id]
    },

    clearCart: () => initialState
  }
})

export const { addToCart, removeOneFromCart, removeAllFromCart, clearCart } =
  cartSlice.actions

export const selectCart = (state) => state.cart.cart
export const selectCartCount = (state) => state.cart.count
export const selectCartSum = (state) => state.cart.sum

export default cartSlice.reducer
