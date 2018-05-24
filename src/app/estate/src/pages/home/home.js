import React from 'react';
import { Button, View, Text, Image,TouchableOpacity } from 'react-native';
import { withNavigation,StackNavigator, TabNavigator, TabBarBottom } from 'app-3rd/react-navigation'; // 1.0.0-beta.27
import { TabView, Theme, BasePage, NavigationPage, TeaNavigator, Overlay, Label} from 'app-3rd/teaset'
//Theme.set(Theme.themes.black);
import { BimFileEntry, AuthorityManager } from 'app-entry';
import * as CONSTANTS from 'app-api';
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

import * as PAGES from '../pages'

class SearchaBarItem extends React.Component {
  render() {
    return  <TouchableOpacity style={{marginRight:10}}  onPress={()=>this.props.navigation.navigate("SearchPage")} >  
          <Image style={{width: 24,height: 24,resizeMode:'contain'}} source={require('app-images/icon_search_white.png')} />
    </TouchableOpacity> 
  }
}

// withNavigation returns a component that wraps SearchaBarItem and passes in the
// navigation prop
var SearchButton =  withNavigation(SearchaBarItem);

export default class extends React.Component {
  static navigationOptions = ({navigation, screenProps}) =>{
    storage.homeNavigation = navigation;
    const options = navigation.getParam('options')
    if(options) {
      return options();
    }  
   return ({
    title:'首页',
  })
};
  constructor(props) {
    super(props)
    storage.homeNavigation = this.props.navigation;
    props.navigation.setParams({'options':()=>{return this.options(CONSTANTS.PAGE_INNDX_HOME)}})
  }
  componentDidMount = () => {
    storage.page = this.refs.page;
  }
  onNewClick = () =>{
    BimFileEntry.homeSelect(this.props.navigation);
  }
  renderCreate = () => {
    if(AuthorityManager.isQualityCreate() || AuthorityManager.isEquipmentCreate()) {
    return <TabView.Sheet
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
        onPress={() => {this.onNewClick()}}
      />
    }
    return null;
  }

  options = (page) => {
    let title = this.props.navigation.getParam(title);
    if(page == CONSTANTS.PAGE_INNDX_HOME) {
      return ({
        // title:title ? title : CONSTANTS.PAGE_NAME_HOME,
        headerTitle: (<Text style={{ color: '#ffffff', fontWeight:'bold', fontSize: 17, marginTop: 5, alignSelf: "center", flex: 1, textAlign: "center" }}>{title ? title : storage.loadCurrentProjectName()}</Text>),
        headerRight:(<SearchaBarItem navigation={this.props.navigation}/>),
        headerLeft: <View></View>,
        // header: {mode:'screen'},
      })
    } 
    
    if(page == CONSTANTS.PAGE_INNDX_SUBSCRIBE) {
      return ({
        title:title ? title : CONSTANTS.PAGE_NAME_SUBSCRIBE,
        // header: {mode:'screen'},
      })
    }

    if(page == CONSTANTS.PAGE_INNDX_MESSAGE) {
      return ({
        title:title ? title : CONSTANTS.PAGE_NAME_MESSAGE,
        // header: {mode:'screen'},
      })
    }

    if(page == CONSTANTS.PAGE_INNDX_MINE) {
      return ({
        title:'',
        // header: null,
      })
    }
    return ({
      title:'BIM协同',
      // header: {mode:'screen'},
    })
  }

  onChange = (index) =>{
    this.props.navigation.setParams({'options':()=>{return this.options(index)}})
  }
  render() {
    return (<TabView ref={(ref)=>{this.tabView = ref;}} onChange={this.onChange} style={{ flex: 1 ,height:'100%'}} type='projector'>
      <TabView.Sheet
        title={CONSTANTS.PAGE_NAME_HOME}
        icon={require('app-images/home/icon_main_main_page.png')}
        activeIcon={require('app-images/home/icon_main_page_selected.png')}
      >
        <PAGES.MainPage />
      </TabView.Sheet>
      <TabView.Sheet
        title={CONSTANTS.PAGE_NAME_SUBSCRIBE}
        icon={require('app-images/home/icon_main_subscribe.png')}
        activeIcon={require('app-images/home/icon_main_subscribe_selected.png')}
        badge={1}
      >
        <PAGES.SubscribePage />
      </TabView.Sheet>
      {
        // 是否可以新建
        this.renderCreate()
      }
      <TabView.Sheet
        title={CONSTANTS.PAGE_NAME_MESSAGE}
        icon={require('app-images/home/icon_main_message.png')}
        activeIcon={require('app-images/home/icon_main_message_selected.png')}
        badge={9}
      >
        <PAGES.MessagePage />
      </TabView.Sheet>
      <TabView.Sheet
        title={CONSTANTS.PAGE_NAME_MINE}
        icon={require('app-images/home/icon_main_mine.png')}
        activeIcon={require('app-images/home/icon_main_mine_selected.png')}
      // badge={'new'}
      >
        <PAGES.MyPage /> 
      </TabView.Sheet>
    </TabView>);
  }
};

