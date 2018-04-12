import { createStore, applyMiddleware } from 'redux'
import thunkMiddleware from 'redux-thunk'
import { createMemoryHistory } from 'history'

import rootReducer from '../reducers/index'

const createStoreWithMiddleware = applyMiddleware(thunkMiddleware)(createStore)

export const history = createMemoryHistory()

export default function configureStore(initialState) {
  const store = createStoreWithMiddleware(rootReducer, initialState)
  return store
}
