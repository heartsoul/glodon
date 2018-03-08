import React from 'react';
import { Button, View, Text, Image } from 'react-native';
import { StackNavigator, TabNavigator,TabBarBottom} from 'react-navigation'; // 1.0.0-beta.27
import MainTab from './main/main';
import MeTab from './me/me';
import MessageTab from './message/message';
import NewTab from './new/new';
import SubscribeTab from './subscriptions/subscribe';
import TenantList from '../navigation/tenant/tenantSimpleList'
import ProjectList from '../navigation/project/projectList'
import QualityMain from '../quality/qualityMain'
import GLDLoginViewController from '../../login/login'
// class HomeScreen extends React.Component {
//   render() {
//     return (
//       <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
//         <Text>Home Screen</Text>
//         <Button
//           title="Go to Details"
//           onPress={() => this.props.navigation.navigate('Details')}
//         />
//       </View>
//     );
//   }
// }

// class DetailsScreen extends React.Component {
//   render() {
//     return (
//       <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
//         <Text>Details Screen</Text>
//         <Button
//           title="Go to Details... again"
//           onPress={() => this.props.navigation.navigate('Guide')}
//         />
//         <Button
//           title="Go back"
//           onPress={() => this.props.navigation.goBack()}
//         />
//       </View>
//     );
//   }
// }

class TabBarItem extends React.Component {  
  
  render() {  
      return(  
          <Image source={ this.props.focused ? this.props.selectedImage : this.props.normalImage }  
              style={ {width:25,height:25 } }  
          />  
      )  
  }  
    
} 

class TabBarItemCreate extends React.Component {  
  
  render() {  
      return(  
          <Image source={ this.props.focused ? this.props.selectedImage : this.props.normalImage }  
              style={ {width:50,height:50,marginBottom:15} }  
          />  
      )  
  }  
    
} 
const mainNav = StackNavigator(
  {
    AAAA: {
      screen: MainTab,
      title:"首页"
    },
    TenantList: {
      screen:TenantList,
      title:"租户列表"
    },
    ProjectList: {
      screen:ProjectList,
      title:"项目列表"
    },
    QualityMain: {
      screen:QualityMain,
      title:"质检清单"
    }
  },
  {
    initialRouteName: 'AAAA',
    headerMode:"screen",
  }
);

const SubscribeNav = StackNavigator(
  {
    BBBB: {
      screen: SubscribeTab,
      title:"home"
    },
  },
  {
    initialRouteName: 'BBBB',
    headerMode:"screen",
  }
);
const MessageNav = StackNavigator(
  {
    DDDD: {
      screen: MessageTab,
      title:"home"
    },
  },
  {
    initialRouteName: 'DDDD',
    headerMode:"screen",
  }
);
const NewNav = StackNavigator(
  {
    CCCC: {
      screen: NewTab,
      title:"new"
    },
  },
  {
    initialRouteName: 'CCCC',
    headerMode:"screen",
  }
);
const MeNav = StackNavigator(
  {
    EEEE: {
      screen: MeTab,
      title:"me"
    },
    Logout: {
      screen: GLDLoginViewController,
      title:"logout"
    },
  },
  {
    initialRouteName: 'EEEE',
    headerMode:"screen",
  }
);

const RootStack = TabNavigator(
  {
    MainTab: {
      screen: mainNav,
      navigationOptions: {  
        tabBarLabel: '首页',
        tabBarIcon:({focused,tintColor}) => (  
          <TabBarItem  
            tintColor={tintColor}  
            focused={focused}  
            normalImage={require('../../res/images/home/icon_main_main_page.png')}  
            selectedImage={require('../../res/images/home/icon_main_page_selected.png')}  
          />  
        ),  
      },
    },
    SubscribeTab: {
      screen: SubscribeNav,
      navigationOptions: {  
        tabBarLabel: '订阅',
        tabBarIcon:({focused,tintColor}) => (  
          <TabBarItem  
            tintColor={tintColor}  
            focused={focused}  
            normalImage={require('../../res/images/home/icon_main_subscribe.png')}  
            selectedImage={require('../../res/images/home/icon_main_subscribe_selected.png')}  
          />  
        ), 
      },
    },
    
    NewTab: {
      screen: NewNav,
      navigationOptions: {  
        tabBarLabel: '新建',
        tabBarIcon:({focused,tintColor}) => (  
          <TabBarItemCreate  
            tintColor={tintColor}  
            focused={focused}  
            normalImage={require('../../res/images/home/icon_main_create.png')}  
            selectedImage={require('../../res/images/home/icon_main_create.png')}  
          />  
        ),
        tabBarOnPress:(({ route, index },jumpToIndex)=>{
          console.log(route);        
          alert("在这执行新建");
       }),
      },
    },
    MessageTab: {
      screen: MessageNav,
      navigationOptions: {  
        tabBarLabel: '消息',
        tabBarIcon:({focused,tintColor}) => (  
          <TabBarItem  
            tintColor={tintColor}  
            focused={focused}  
            normalImage={require('../../res/images/home/icon_main_message.png')}  
            selectedImage={require('../../res/images/home/icon_main_message_selected.png')}  
          />  
        ),
      },
    },
    MeTab: {
      screen: MeNav,
      navigationOptions: {  
        tabBarLabel: '我',
        tabBarIcon:({focused,tintColor}) => (  
          <TabBarItem  
            tintColor={tintColor}  
            focused={focused}  
            normalImage={require('../../res/images/home/icon_main_mine.png')}  
            selectedImage={require('../../res/images/home/icon_main_mine_selected.png')}  
          />  
        ),
      },
    },
  
  },
  {
    navigationOptions: ({ navigation }) => ({
      
    }),
    tabBarOptions: {
      activeTintColor: '#00baf3',
      inactiveTintColor: '#477493',
      labelStyle: {
        // fontSize: 11,
        marginBottom:5,
      },
      // style: {
      //   backgroundColor: 'blue',
      // },
      
      
    },
    inactiveBackgroundColor:"#00baf3",
    activeBackgroundColor:"#00baf3",
    tabBarComponent: TabBarBottom,
    tabBarPosition: 'bottom',
    lazy: true,
    showIcon:true,
    indicatorStyle:{
      height:0
    },
    animationEnabled: false,
    swipeEnabled: false,
    
  }
);

const RootStack1 = StackNavigator(
  {
    Home: {
      screen: RootStack,
    },
  },
  {
    initialRouteName: 'Home',
    headerMode:"none",
  }
);

export default class extends React.Component {
  static navigationOptions = {
    title: '首页',
    tabBarVisible:false,
    headerTintColor:"#FFF",
    headerStyle:{backgroundColor:"#00baf3"},
}
  render() {
    return <RootStack1 />;
  }
};