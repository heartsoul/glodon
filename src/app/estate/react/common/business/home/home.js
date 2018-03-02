import React from 'react';
import { Button, View, Text } from 'react-native';
import { StackNavigator, TabNavigator} from 'react-navigation'; // 1.0.0-beta.27
import MainTab from './main/main';
import MeTab from './me/me';
import MessageTab from './message/message';
import NewTab from './new/new';
import SubscribeTab from './subscriptions/subscribe';
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

const mainNav = StackNavigator(
  {
    AAAA: {
      screen: MainTab,
      title:"home"
    },
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
const MeNav = StackNavigator(
  {
    EEEE: {
      screen: MeTab,
      title:"me"
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
        tabBarLabel: '首页'
      },
    },
    SubscribeTab: {
      screen: SubscribeNav,
      navigationOptions: {  
        tabBarLabel: '订阅'
      },
    },
    
    NewTab: {
      screen: NewTab,
      navigationOptions: {  
        tabBarLabel: '新建'
      },
    },
    MessageTab: {
      screen: MessageNav,
      navigationOptions: {  
        tabBarLabel: '消息'
      },
    },
    MeTab: {
      screen: MeNav,
      navigationOptions: {  
        tabBarLabel: '我'
      },
    },
  
  },
  {
    navigationOptions: ({ navigation }) => ({
      
    }),
    tabBarOptions: {
      activeTintColor: '#00baf3',
      inactiveTintColor: '#477493',
    },
    // tabBarComponent: 'TabBarBottom',
    tabBarPosition: 'bottom',
    animationEnabled: true,
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
  render() {
    return <RootStack1 />;
  }
};