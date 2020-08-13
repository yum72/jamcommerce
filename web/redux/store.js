import { createStore, applyMiddleware, combineReducers } from 'redux'
import { createWrapper } from 'next-redux-wrapper'
import thunkMiddleware from 'redux-thunk'
import { cart } from './cart'

//COMBINING ALL REDUCERS
const combinedReducer = combineReducers({
  cart
  // OTHER REDUCERS WILL BE ADDED HERE
})

// BINDING MIDDLEWARE
const bindMiddleware = middleware => {
  if (process.env.NODE_ENV !== 'production') {
    const { composeWithDevTools } = require('redux-devtools-extension')
    return composeWithDevTools(applyMiddleware(...middleware))
  }
  return applyMiddleware(...middleware)
}

const makeStore = ({ isServer }) => {
  if (isServer) {
    //If it's on server side, create a store
    return createStore(combinedReducer, bindMiddleware([thunkMiddleware]))
  } else {
    //If it's on client side, create a store which will persist
    const { persistStore, persistReducer } = require('redux-persist')
    const storage = require('redux-persist/lib/storage').default

    const persistConfig = {
      key: 'primary',
      storage,
      whitelist: ['cart', 'count', 'sum'] // place to select which state you want to persist
    }

    const persistedReducer = persistReducer(persistConfig, combinedReducer) // Create a new reducer with our existing reducer

    const store = createStore(
      persistedReducer,
      bindMiddleware([thunkMiddleware])
    ) // Creating the store again

    store.__persistor = persistStore(store) // This creates a persistor object & push that persisted object to .__persistor, so that we can avail the persistability feature

    return store
  }
}

// Export the wrapper & wrap the pages/_app.js with this wrapper only
export const wrapper = createWrapper(makeStore)

// const persistConfig = {
//   key: 'primary',
//   storage,
//   whitelist: ['cart', 'count', 'sum'] // place to select which state you want to persist
// }

// const persistedReducer = persistReducer(persistConfig, reducer)

// function makeStore(initialState = cartInitialState) {
//   return createStore(
//     persistedReducer,
//     initialState,
//     bindMiddleware([thunkMiddleware])
//   )
// }

// export const initializeStore = preloadedState => {
//   let _store = store ?? makeStore(preloadedState)

//   // After navigating to a page with an initial Redux state, merge that state
//   // with the current state in the store, and create a new store
//   if (preloadedState && store) {
//     _store = makeStore({
//       ...store.getState(),
//       ...preloadedState
//     })
//     // Reset the current store
//     store = undefined
//   }

//   // For SSG and SSR always create a new store
//   if (typeof window === 'undefined') return _store
//   // Create the store once in the client
//   if (!store) store = _store

//   return _store
// }

// export function useStore(initialState) {
//   const store = useMemo(() => initializeStore(initialState), [initialState])
//   return store
// }
