import { configureStore, combineReducers } from '@reduxjs/toolkit'

import cartReducer from './cartSlice'
import wishlistReducer from './wishlistSlice'
import { HYDRATE } from './persist'

const combinedReducer = combineReducers({
  cart: cartReducer,
  wishlist: wishlistReducer
})

/**
 * Wraps the combined reducer so the saved cart and saved-items list can be
 * dropped in as whole slices at once.
 *
 * Handled above the slices rather than inside each of them, so persisting a new
 * slice later is a one-line change in persist.js and nothing else.
 */
const rootReducer = (state, action) => {
  if (action.type === HYDRATE) {
    return combinedReducer({ ...state, ...action.payload }, action)
  }
  return combinedReducer(state, action)
}

export const store = configureStore({ reducer: rootReducer })
