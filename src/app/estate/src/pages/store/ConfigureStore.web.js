import { createStore, applyMiddleware, compose } from 'redux'
import { createBrowserHistory } from 'history'
import thunkMiddleware from 'redux-thunk'
import { connectRouter, routerMiddleware } from 'connected-react-router'

import reducers from '../reducers/index'

const createStoreWithMiddleware = applyMiddleware(thunkMiddleware)(createStore)
export const history = createBrowserHistory()
export default function configureStore(initialState) {
  const store = createStoreWithMiddleware(
    connectRouter(history)(reducers), // new root reducer with router state
    initialState,
    compose(
      applyMiddleware(
        routerMiddleware(history) // for dispatching history actions
        // ... other middlewares ...
      )
    )
  )
  return store
}
