import React from 'react'
import { Provider } from 'react-redux'

import { StackNavigator,NavigationActions } from 'app-3rd/react-navigation'; 

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
    RelevantBlueprintPage: {
      screen : GLD.RelevantBlueprintPage 
    },
    RelevantModlePage: {
      screen : GLD.RelevantModlePage 
    },
    CheckPointListPage: {
      screen: GLD.CheckPointListPage
    },
    
  },
  {
    // initialRouteName: storage.isGuide(()=>{}) ? 'GuidePage' : 'LoginPage',
    initialRouteName: 'MainPage',
    // headerMode:"none",
  },
);

const defaultGetStateForAction = RootStack.router.getStateForAction;
// console.log("defaultGetStateForAction:"+defaultGetStateForAction+"\n");

RootStack.router.getStateForAction = (action, state) => {
  // console.log("action info -- type:"+action.type+",key:"+action.key+",params:"+action.params+",path:"+action.path+",routeName:"+action.routeName+",n:"+action.n+"\n");
  const { n } = action;
  if (action.type === NavigationActions.POP && typeof n === 'string') {
    let backRouteIndex = state.index;
    let findN = n;
    // 支持按照routeName进行回退，如果存在重名了，那么就回到
    const backRoute = state.routes.find(route => route.routeName === findN);
    findN = Math.max(0, backRouteIndex - state.routes.indexOf(backRoute));
    if (findN > 0) {
      action.n = findN;
    } else {
      action.n = null;
    }
  }
  return defaultGetStateForAction(action, state);
};

export default class App extends React.Component {
  render() {
    return (<Provider store={store}><RootStack /></Provider>)
  }
}
