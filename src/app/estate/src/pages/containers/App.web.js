import React from 'react'
import { NoMatch, Switch, Route } from 'react-router'
import { ConnectedRouter } from 'connected-react-router'
import { Provider } from 'react-redux'

import configureStore, { history } from '../store/ConfigureStore'
import * as GLD from '../pages'

const store = configureStore()

export default class App extends React.Component {
  render() {
    return (
      <Provider store={store}>
        <ConnectedRouter history={history}>
          <Switch>
            <Route path="/" exact component={GLD.LoginPage} />
            <Route path="/GuidePage" exact component={GLD.GuidePage} />
            <Route path="/LoginPage" exact component={GLD.LoginPage} />
            {/* <Route path="/ChoosePage" exact component={GLD.TenantPage} /> */}
            <Route path="/MainPage" exact component={GLD.HomePage} />
            {/* <Route path="/ProjectPage" exact component={GLD.ProjectPage} />
            <Route path="/TenantPage" exact component={TenantPage} />
            <Route path="/QualityMainPage" exact component={GLD.QualityMainPage} />
            <Route path="/WebPage" exact component={WebPage} />
            <Route path="/BimFileChooserPage" exact component={GLD.BimFileChooserPage} />*/}
            <Route path="/NewPage" exact component={GLD.NewPage} /> 
            <Route path="/SettingPage" exact component={GLD.SettingPage} />
            {/* <Route path="/CheckPointPage" exact component={GLD.CheckPointPage} /> */}
            <Route component={NoMatch} />
          </Switch>
        </ConnectedRouter>
      </Provider>
    )
  }
}
