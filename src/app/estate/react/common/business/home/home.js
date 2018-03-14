import React from 'react';
import { Button, View, Text, Image } from 'react-native';
import { StackNavigator, TabNavigator, TabBarBottom } from 'react-navigation'; // 1.0.0-beta.27
import { TabView,Theme} from 'teaset'
//Theme.set(Theme.themes.black);
const primaryColor = '#00baf3';
Theme.set({
    primaryColor: primaryColor,
    btnPrimaryColor:primaryColor,
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
  });
import MainTab from './main/main';
import MeTab from './me/me';
import MessageTab from './message/message';
import SubscribeTab from './subscriptions/subscribe';
import TenantList from '../navigation/tenant/tenantSimpleList'
import ProjectList from '../navigation/project/projectList'
import QualityMain from '../quality/qualityMain'

const SubscribeNav = StackNavigator(
  {
    BBBB: {
      screen: SubscribeTab,
      title: "home"
    },
  },
  {
    initialRouteName: 'BBBB',
    headerMode: "screen",
  }
);
const MessageNav = StackNavigator(
  {
    DDDD: {
      screen: MessageTab,
      title: "home"
    },
  },
  {
    initialRouteName: 'DDDD',
    headerMode: "screen",
  }
);

const MeNav = StackNavigator(
  {
    EEEE: {
      screen: MeTab,
      title: "me"
    },
  },
  {
    initialRouteName: 'EEEE',
    headerMode: "screen",
  }
);

const MainNav = StackNavigator(
  {
    AAAA: {
      screen: MainTab,
      title: "首页"
    },
    TenantList: {
      screen: TenantList,
      title: "租户列表"
    },
    ProjectList: {
      screen: ProjectList,
      title: "项目列表"
    },
    QualityMain: {
      screen: QualityMain,
      title: "质检清单"
    }
  },
  {
    initialRouteName: 'AAAA',
    headerMode: "screen",
  }
);

export default class homePage extends React.Component {
  static navigationOptions = {
    title: '首页',
    tabBarVisible: false,
    headerTintColor: "#FFF",
    headerStyle: { backgroundColor: "#00baf3" },
  }
  componentDidMount = () => {
    global.storage.homeNavigation = this.props.navigation;
  }
  render() {
    return (<TabView style={{ flex: 1 }} type='projector'>
      <TabView.Sheet
        title='首页'
        icon={require('../../res/images/home/icon_main_main_page.png')}
        activeIcon={require('../../res/images/home/icon_main_page_selected.png')}
      >
        <MainNav />
      </TabView.Sheet>
      <TabView.Sheet
        title='订阅'
        icon={require('../../res/images/home/icon_main_subscribe.png')}
        activeIcon={require('../../res/images/home/icon_main_subscribe_selected.png')}
        badge={1}
      >
        <SubscribeNav />
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
              source={require('../../res/images/home/icon_main_create.png')}
            />
          </View>
        }
        iconContainerStyle={{ justifyContent: 'flex-end' }}
        onPress={() => alert('Custom button press')}
      />

      <TabView.Sheet
        title='消息'
        icon={require('../../res/images/home/icon_main_message.png')}
        activeIcon={require('../../res/images/home/icon_main_message_selected.png')}
        badge={9}
      >
        <MessageNav />
      </TabView.Sheet>
      <TabView.Sheet
        title='我'
        icon={require('../../res/images/home/icon_main_mine.png')}
        activeIcon={require('../../res/images/home/icon_main_mine_selected.png')}
      // badge={'new'}
      >
        <MeNav />
      </TabView.Sheet>
    </TabView>);
  }
};

