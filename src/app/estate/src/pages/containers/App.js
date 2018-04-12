import React from 'react'
import { Provider } from 'react-redux'

import { StackNavigator } from 'react-navigation'; 

import * as GLD from '../pages'

import configureStore, { history } from '../store/ConfigureStore'

const store = configureStore()
console.log("HomePage:"+GLD.HomePage)
// LoginPage,MainPage,BaseStorage,ChoosePage,TenantPage,ProjectPage,GuidePage,QualityMainPage
const RootStack = StackNavigator(
  {
    GuidePage: {
      screen: GLD.GuidePage,
    },
    LoginPage: {
      screen: GLD.LoginPage
    },
    ChoosePage: {
      screen: GLD.TenantPage,
    },
    MainPage: {
      screen : GLD.HomePage
    },
    ProjectPage: {
      screen : GLD.ProjectPage
    },
    TenantPage: {
      screen : GLD.TenantPage
    },
    QualityMainPage: {
      screen : GLD.QualityMainPage
    },
    QualityMainPage: {
      screen : GLD.QualityMainPage
    },
    WebPage: {
      screen : GLD.WebPage
    },
    BimFileChooserPage: {
      screen : GLD.BimFileChooserPage
    },
    NewPage: {
      screen : GLD.NewPage 
    },
    SettingPage: {
      screen : GLD.SettingPage 
    },
    CheckPointPage: {
        screen : GLD.CheckPointPage 
    },
  },
  {
    initialRouteName: global.storage.isGuide(()=>{}) ? 'GuidePage' : 'LoginPage',
    // initialRouteName: 'LoginPage',
    // headerMode:"none",
  },
);

export default class App extends React.Component {

  render() {
    return (<Provider store={store}><RootStack /></Provider>)
  }
}
