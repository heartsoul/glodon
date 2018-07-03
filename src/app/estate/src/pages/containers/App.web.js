import React from 'react'
import { View, Image} from 'react-native'
import { ConnectedRouter } from 'connected-react-router'
import { Provider } from 'react-redux'
import configureStore, { history } from './../store/ConfigureStore'
import * as GLD from './../pages';
import API from 'app-api'
import { createStackNavigator , NavigationActions, StackActions} from 'app-3rd/react-navigation';
const store = configureStore()

const screens = {
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
    screen: GLD.HomePage
  },
  ProjectPage: {
    screen: GLD.ProjectPage
  },
  TenantPage: {
    screen: GLD.TenantPage
  },
  QualityMainPage: {
    screen: GLD.QualityMainPage
  },
  WebPage: {
    screen: GLD.WebPage
  },
  BimFileChooserPage: {
    screen: GLD.BimFileChooserPage
  },
  NewPage: {
    screen: GLD.NewPage
  },
  SettingPage: {
    screen: GLD.SettingPage
  },
  CheckPointPage: {
    screen: GLD.CheckPointPage
  },
  RelevantBlueprintPage: {
    screen: GLD.RelevantBlueprintPage
  },
  RelevantModlePage: {
    screen: GLD.RelevantModlePage
  },
  CheckPointListPage: {
    screen: GLD.CheckPointListPage
  },
  QualityDetailPage: {
    screen: GLD.QualityDetailPage
  },
  BigImageViewPage: {
    screen: GLD.BigImageViewPage
  },
  QualityStatardsPage: {
    screen: GLD.QualityStatardsPage
  },

  NewReviewPage: {
    screen: GLD.NewReviewPage
  },
  EquipmentMainPage: {
    screen: GLD.EquipmentMainPage
  },
  EquipmentDetailPage: {
    screen: GLD.EquipmentDetailPage
  },
  SearchPage: {
    screen: GLD.SearchPage
  },
  QualitySearchPage: {
    screen: GLD.QualitySearchPage
  },
  EquipmentSearchPage: {
    screen: GLD.EquipmentSearchPage
  },
  BimSearchPage: {
    screen: GLD.BimSearchPage
  },
  AboutPage: {
    screen: GLD.AboutPage
  },
  ForgotPage: {
    screen: GLD.ForgotPage
  },
  FeedbackPage: {
    screen: GLD.FeedbackPage
  },
  ChangeProjectPage: {
    screen: GLD.ChangeProjectPage
  },
  EditPhotoPage:{
    screen: GLD.EditPhotoPage
  },
  DocProjectPage:{
    screen: GLD.DocProjectPage
  },
  DocProjectFileListView:{
    screen: GLD.DocProjectFileListView
  },
  DocProjectTransListView:{
    screen: GLD.DocProjectTransListView
  },
  DocProjectFavListView:{
    screen: GLD.DocProjectFavListView
  },
  DocProjectTrashListView:{
    screen: GLD.DocProjectTrashListView
  },
  DocMarkupPage:{
    screen: GLD.DocMarkupPage
  },
  DocMarkupDetailPage: {
    screen: GLD.DocMarkupDetailPage
  },
};

const options = () => {
  return {
    headerStyle: {
      backgroundColor: '#00baf3',
      borderBottomColor: '#00baf3',
      shadowColor: '#00baf3',
      shadowOpacity: 0.1,
      shadowRadius: 0,
      shadowOffset: {
        height: 0,
      },
      elevation: 0,
    },
    headerBackImage: <View style={{ width: 40, height: 44, justifyContent: 'center' }}><Image style={{ marginLeft: 10, width: 20, height: 20, resizeMode: 'contain' }} source={require('app-images/icon_back_white.png')} /></View>,
    headerBackTitle: null,
    headerTintColor: '#fff',
    tabBarVisible: false,
    headerTitleStyle: {
      fontSize: 17,
      fontWeight: 'bold',
    },
    headerRight: (<View />),

  }
}
// LoginPage,MainPage,BaseStorage,ChoosePage,TenantPage,ProjectPage,GuidePage,QualityMainPage
const RootGuideStack = createStackNavigator(
  screens,
  {
    initialRouteName: 'GuidePage',
    navigationOptions: options,
  }
);
const RootLoginStack = createStackNavigator(
  screens,
  {
    initialRouteName: 'LoginPage',
    navigationOptions: options,
  }
);
const RootMainStack = createStackNavigator(
  screens,
  {
    initialRouteName: 'MainPage',
    navigationOptions: options,
  }
);
const RootChooseStack = createStackNavigator(
  screens,
  {
    initialRouteName: 'ChoosePage',
    navigationOptions: options,
  }
);

function resetGetStateForAction(RootStack) {
  const defaultGetStateForAction = RootStack.router.getStateForAction;
  // console.log("defaultGetStateForAction:"+defaultGetStateForAction+"\n");

  RootStack.router.getStateForAction = (action, state) => {
      // console.log("action info -- type:"+action.type+",key:"+action.key+",params:"+action.params+",path:"+action.path+",routeName:"+action.routeName+",n:"+action.n+"\n");
      const { n } = action;
      if (action.type === StackActions.POP && typeof n === 'string') {
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
      // if (Platform.OS === 'web' && action.type === NavigationActions.BACK && state.routes.length === 1) {
      //     let systemDate = new Date().getTime();
      //     if (systemDate - clickTime > 2000) {
      //         clickTime = systemDate
      //         Toast.info("再按一次退出", 1);
      //         return null;
      //     }

      // }
      return defaultGetStateForAction(action, state);
  };
}


resetGetStateForAction(RootMainStack);
resetGetStateForAction(RootLoginStack);
resetGetStateForAction(RootGuideStack);
resetGetStateForAction(RootChooseStack);

export default class extends React.Component {
  constructor() {
    super();
    this.state = {
      hasLoad: false,
    }
  }
  componentDidMount = () => {
    this.fireHeartBeat();
    clickTime = new Date().getTime();
    
    
  }
  fireHeartBeat = () => {
    if (storage.hasChoose()) {
      let tenant = storage.loadLastTenant();
      API.setCurrentTenant(tenant).then((responseData) => {
        // if (this) {
        //   this.prevUpdateTime = systemDate; // 更新成功更新时间
        // }
      }).catch((e) => {
        console.log(e);
      });
    }
  }
  _onNavigationStateChange = (prevState, newState, action) => {
    storage.currentRouteName = this._getCurrentRouteName(newState);
  }
  _getCurrentRouteName = (navigationState) => {
    if (!navigationState) {
      return null;
    }
    const route = navigationState.routes[navigationState.index];
    // dive into nested navigators
    if (route.routes) {
      return getCurrentRouteName(route);
    }
    return route.routeName;
  }
  renderPage = () => {
    if (storage.isLogin()) {
      if (storage.hasChoose()) {
        return (<Provider store={store}><ConnectedRouter history={history}><RootMainStack  history={history} onNavigationStateChange={this._onNavigationStateChange} /></ConnectedRouter></Provider>)
      }
      return (<Provider store={store}><ConnectedRouter history={history}><RootChooseStack  history={history} onNavigationStateChange={this._onNavigationStateChange} /></ConnectedRouter></Provider>)
    }
    // if (storage.isGuide()) {
    return (<Provider store={store}><ConnectedRouter history={history}><RootLoginStack  history={history} onNavigationStateChange={this._onNavigationStateChange} /></ConnectedRouter></Provider>)
    // }
    // return (<Provider store={store}><ConnectedRouter history={history}><RootGuideStack /></ConnectedRouter></Provider>)
  }
  render = () => {
    return this.renderPage();
  }
}
