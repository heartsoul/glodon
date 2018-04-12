import React from 'react';
import { Button, View, Text, Image,TouchableOpacity } from 'react-native';
import { withNavigation,StackNavigator, TabNavigator, TabBarBottom } from 'app-3rd/react-navigation'; // 1.0.0-beta.27
import { TabView, Theme, BasePage, NavigationPage, TeaNavigator } from 'app-3rd/teaset'
//Theme.set(Theme.themes.black);
const primaryColor = '#00baf3';
Theme.set({
  primaryColor: primaryColor,
  btnPrimaryColor: primaryColor,
  btnPrimaryBorderColor: primaryColor,
  sbBtnActiveTitleColor: primaryColor,
  // sbBtnActiveTextFontSize: 13,
  sbIndicatorLineColor: primaryColor,
  tvBarBtnIconTintColor: '#8f8f8f',
  tvBarBtnIconActiveTintColor: primaryColor,
  tvBarBtnTitleColor: '#8f8f8f',
  // tvBarBtnTextFontSize: 10,
  tvBarBtnActiveTitleColor: primaryColor,
  // backButtonTitle: '返回',
  navColor: primaryColor,
  // navTintColor: '#fff',
  // navTitleColor: '#fff',
  // navTitleFontSize: 18,
  // navButtonFontSize: 15,
  navSeparatorColor: primaryColor,
});

import {
  MainPage as Tab1,
  MyPage as Tab5,
  MessagePage as Tab2,
  SubscribePage as Tab4,
  NewPage as Tab3,
} from '../pages'

class MinePage extends NavigationPage {
  static defaultProps = {
    ...NavigationPage.defaultProps,
    title: '',
    showBackButton: false,
  };
  renderPage() {
    return <Tab5 />
  }
}

class SubscribePage extends NavigationPage {
  static defaultProps = {
    ...NavigationPage.defaultProps,
    title: "订阅",
    showBackButton: false,
  };
  renderPage() {
    return <Tab4 />
  }
}
class MessagePage extends NavigationPage {
  static defaultProps = {
    ...NavigationPage.defaultProps,
    title: "消息",
    showBackButton: false,
  };
  renderPage() {
    return <Tab2 />
  }
}

class SearchaBarItem extends React.Component {
  render() {
    return  <TouchableOpacity  onPress={()=>this.props.navigation.navigate("SearchPage")} >  
          <Image resizeMode='center' source={require('app-images/icon_search_white.png')} />
    </TouchableOpacity> 
  }
}

// withNavigation returns a component that wraps SearchaBarItem and passes in the
// navigation prop
var SearchButton =  withNavigation(SearchaBarItem);

class HomePage extends NavigationPage {
  static defaultProps = {
    ...NavigationPage.defaultProps,
    title: global.storage ? global.storage.currentProject?''+global.storage.currentProject:'首页' : '首页',
    showBackButton: false,
  };
  constructor() {
    super();
  };
  
  renderNavigationRightView = () => {
    // console.log(renderNavigationRightView);
    return <SearchButton/>
  }
  renderPage() {
    return <Tab1 style={{backgroundColor:'#FFFFFF'}} />
  }
}
class Page extends React.Component {
  constructor() {
    super();
  }
  render() {
    return (<TabView style={{ flex: 1 ,height:'100%'}} type='projector'>
      <TabView.Sheet
        title='首页'
        icon={require('app-images/home/icon_main_main_page.png')}
        activeIcon={require('app-images/home/icon_main_page_selected.png')}
      >
        <HomePage />
      </TabView.Sheet>
      <TabView.Sheet
        title='订阅'
        icon={require('app-images/home/icon_main_subscribe.png')}
        activeIcon={require('app-images/home/icon_main_subscribe_selected.png')}
        badge={1}
      >
        <SubscribePage />
      </TabView.Sheet>
      <TabView.Sheet
        type='button'
        title='新建'
        icon={
          <View style={{
            width: 54,
            height: 54,
            borderRadius: 27,
            shadowColor: '#ccc',
            shadowOffset: { height: -1 },
            shadowOpacity: 0.5,
            shadowRadius: 0.5,
            alignItems: 'center',
            justifyContent: 'center',
            // bottom:-10,
          }}>
            <Image
              style={{ width: 50, height: 50, borderRadius: 25 }}
              source={require('app-images/home/icon_main_create.png')}
            />
          </View>
        }
        iconContainerStyle={{ justifyContent: 'flex-end' }}
        onPress={() => global.storage.pushNext(null, 'NewPage')}
      />

      <TabView.Sheet
        title='消息'
        icon={require('app-images/home/icon_main_message.png')}
        activeIcon={require('app-images/home/icon_main_message_selected.png')}
        badge={9}
      >
        <MessagePage />
      </TabView.Sheet>
      <TabView.Sheet
        title='我'
        icon={require('app-images/home/icon_main_mine.png')}
        activeIcon={require('app-images/home/icon_main_mine_selected.png')}
      // badge={'new'}
      >
        <MinePage /> 
      </TabView.Sheet>
    </TabView>);
  }
}
export default class MainPage extends React.Component {
  static navigationOptions = {
    title: '首页',
    tabBarVisible: false,
    headerTintColor: "#FFF",
    headerStyle: { backgroundColor: "#00baf3" },
    header: null
  }
  componentDidMount = () => {
    global.storage.homeNavigation = this.props.navigation;
    global.storage.page = this.refs.page;
    this.page
  }
  render() {
  return (<Page style={{height:'100%'}} ref={'page'} />);
  }
};

