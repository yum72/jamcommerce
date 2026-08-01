import { configureStore, combineReducers } from '@reduxjs/toolkit'
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER
} from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import createWebStorage from 'redux-persist/lib/storage/createWebStorage'

import cartReducer from './cartSlice'
import wishlistReducer from './wishlistSlice'

/**
 * redux-persist reaches for localStorage at import time, which does not exist
 * while Next is prerendering. next-redux-wrapper used to paper over this by
 * building a separate server store; with every page statically generated and
 * the cart living only in the browser, a no-op storage during SSR is all that
 * is actually needed.
 */
const createNoopStorage = () => ({
  getItem: () => Promise.resolve(null),
  setItem: (_key, value) => Promise.resolve(value),
  removeItem: () => Promise.resolve()
})

const persistConfig = {
  key: 'primary',
  version: 1,
  storage: typeof window !== 'undefined' ? storage : createNoopStorage(),
  whitelist: ['cart', 'wishlist']
}

const rootReducer = combineReducers({
  cart: cartReducer,
  wishlist: wishlistReducer
})

export const store = configureStore({
  reducer: persistReducer(persistConfig, rootReducer),
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER]
      }
    })
})

export const persistor = persistStore(store)
