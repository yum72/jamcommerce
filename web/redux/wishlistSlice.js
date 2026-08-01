import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  items: {}
}

/**
 * Saved items, keyed by product _id.
 *
 * The heart on each product card needs somewhere to put what it saves. There is
 * no account system here, so this lives in the same persisted store as the cart
 * and stays on the device — which is honest about what it is: a shortlist for
 * this browser, not a synced wishlist.
 *
 * Only the fields a card renders are stored, for the same reason the cart does
 * it: a whole product document is a page of Portable Text in localStorage.
 */
const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState,
  reducers: {
    toggleWishlist: (state, action) => {
      const product = action.payload
      if (state.items[product._id]) {
        delete state.items[product._id]
      } else {
        state.items[product._id] = product
      }
    },

    removeFromWishlist: (state, action) => {
      delete state.items[action.payload._id]
    },

    clearWishlist: () => initialState
  }
})

export const { toggleWishlist, removeFromWishlist, clearWishlist } =
  wishlistSlice.actions

export const selectWishlist = state => state.wishlist.items
export const selectWishlistCount = state =>
  Object.keys(state.wishlist.items).length
export const selectIsWishlisted = id => state =>
  Boolean(state.wishlist.items[id])

export default wishlistSlice.reducer
