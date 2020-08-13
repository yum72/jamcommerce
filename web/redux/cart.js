// import { useMemo } from 'react'
// import { createStore, applyMiddleware } from 'redux'
// import { composeWithDevTools } from 'redux-devtools-extension'
// import { persistReducer } from 'redux-persist'
// import storage from 'redux-persist/lib/storage'

// let store

export const cartInitialState = {
  count: 0,
  cart: {},
  sum: 0,
  error: null
}

export const actionTypes = {
  ADD_TO_CART: 'ADD_TO_CART',
  REMOVE_ONE_FROM_CART: 'REMOVE_ONE_FROM_CART',
  REMOVE_ALL_FROM_CART: 'REMOVE_ALL_FROM_CART',
  CLEAR_CART: 'CLEAR_CART',
  LOADING_DATA_FAILURE: 'LOADING_DATA_FAILURE'
}

// REDUCERS
export const cart = (state = cartInitialState, action) => {
  switch (action.type) {
    case actionTypes.ADD_TO_CART: {
      let price = action.data.defaultProductVariant.price
      let cartItem = action.data
      let updatedCart = { ...state.cart }

      if (state.cart[cartItem._id]) {
        updatedCart[cartItem._id].count++
      } else {
        updatedCart = { ...updatedCart, [cartItem._id]: cartItem }
      }
      return {
        ...state,
        cart: updatedCart,
        count: state.count + 1,
        sum: state.sum + price
      }
    }

    case actionTypes.REMOVE_ONE_FROM_CART: {
      let price = action.data.defaultProductVariant.price
      let cartItem = action.data
      let updatedCart = { ...state.cart }

      if (state.cart[cartItem._id] && state.cart[cartItem._id].count > 1) {
        updatedCart[cartItem._id].count--
      } else if (state.cart[cartItem._id].count == 1) {
        delete updatedCart[cartItem._id]
      }
      return {
        ...state,
        cart: updatedCart,
        count: state.count - 1,
        sum: state.sum - price
      }
    }

    case actionTypes.REMOVE_ALL_FROM_CART: {
      let price = action.data.defaultProductVariant.price
      let cartItem = action.data
      let updatedCart = { ...state.cart }
      let itemCount = updatedCart[cartItem._id].count
      let totalItemPrice = itemCount * price
      delete updatedCart[cartItem._id]

      return {
        ...state,
        cart: updatedCart,
        count: state.count - itemCount,
        sum: state.sum - totalItemPrice
      }
    }

    case actionTypes.CLEAR_CART: {
      return {
        ...state,
        cart: {},
        count: 0,
        sum: 0
      }
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

  removeFromCart: data => {
    return { type: actionTypes.REMOVE_ONE_FROM_CART, data }
  },

  removeAllFromCart: data => {
    return { type: actionTypes.REMOVE_ALL_FROM_CART, data }
  },

  clearCart: () => {
    return { type: actionTypes.CLEAR_CART }
  },

  loadingExampleDataFailure: () => {
    return { type: actionTypes.LOADING_DATA_FAILURE }
  }
}
