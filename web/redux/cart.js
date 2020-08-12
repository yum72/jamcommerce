import { useMemo } from 'react'
import { createStore, applyMiddleware } from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension'
import { persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'

let store

const exampleInitialState = {
  count: 0,
  cart: [],
  sum: 0,
  error: null
}

export const actionTypes = {
  ADD_TO_CART: 'ADD_TO_CART',
  REMOVE_FROM_CART: 'REMOVE_FROM_CART',
  CLEAR_CART: 'CLEAR_CART',
  LOADING_DATA_FAILURE: 'LOADING_DATA_FAILURE'
}

// REDUCERS
export const reducer = (state = exampleInitialState, action) => {
  switch (action.type) {
    case actionTypes.ADD_TO_CART:
      let price = action.data.defaultProductVariant.price
      return {
        ...state,
        cart: [...state.cart, action.data],
        count: state.cart.length + 1,
        sum: state.sum + price
      }
    case actionTypes.CLEAR_CART:
      return {
        ...state,
        cart: [],
        count: 0,
        sum: 0
      }
    case actionTypes.LOADING_DATA_FAILURE:
      return { ...state, error: true }
    default:
      return state
  }
}

// ACTIONS
export const actions = {
  addToCart: data => {
    return { type: actionTypes.ADD_TO_CART, data }
  },

  clearCart: () => {
    return { type: actionTypes.CLEAR_CART }
  },

  loadingExampleDataFailure: () => {
    return { type: actionTypes.LOADING_DATA_FAILURE }
  }
}

const persistConfig = {
  key: 'primary',
  storage,
  whitelist: ['cart', 'count', 'sum'] // place to select which state you want to persist
}

const persistedReducer = persistReducer(persistConfig, reducer)

function makeStore (initialState = exampleInitialState) {
  return createStore(
    persistedReducer,
    initialState,
    composeWithDevTools(applyMiddleware())
  )
}

export const initializeStore = preloadedState => {
  let _store = store ?? makeStore(preloadedState)

  // After navigating to a page with an initial Redux state, merge that state
  // with the current state in the store, and create a new store
  if (preloadedState && store) {
    _store = makeStore({
      ...store.getState(),
      ...preloadedState
    })
    // Reset the current store
    store = undefined
  }

  // For SSG and SSR always create a new store
  if (typeof window === 'undefined') return _store
  // Create the store once in the client
  if (!store) store = _store

  return _store
}

export function useStore (initialState) {
  const store = useMemo(() => initializeStore(initialState), [initialState])
  return store
}
