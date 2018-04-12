import React from 'react'
import { NoMatch, Switch, Route } from 'react-router'
import { ConnectedRouter } from 'connected-react-router'
import { Provider } from 'react-redux'

import configureStore, { history } from '../store/ConfigureStore'
import LoginPage from '../pages/LoginPage'
import MainPage from '../pages/MainPage'

import { StackRouter } from '../../../node_modules/react-navigation/src/react-navigation'

const store = configureStore()

export default class App extends React.Component {
  render() {
    return (
      <Provider store={store}>
        <ConnectedRouter history={history}>
          <Switch>
            <Route path="/" exact component={LoginPage} />
            <Route path="/Login" exact component={LoginPage} />
            <Route path="/Main" exact component={MainPage} />
            <Route component={NoMatch} />
            <StackNavigator />
          </Switch>
        </ConnectedRouter>
      </Provider>
    )
  }
}
