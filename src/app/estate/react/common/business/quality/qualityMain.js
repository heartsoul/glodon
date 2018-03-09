import React from 'react';
import { Button, View, Text, Image } from 'react-native';
import { StackNavigator, DrawerNavigator} from 'react-navigation'; // 1.0.0-beta.27
import QualityList from './qualityList'
class DetailsScreen extends React.Component {
    render() {
      return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <Text>Details Screen</Text>
          <Button
            title="Go to Details... again"
            onPress={() => this.props.navigation.navigate('Notifications')}
          />
          <Button
            title="展开/合并"
            onPress={() => this.props.navigation.navigate("DrawerToggle")}
          />
        </View>
      );
    }
  }

  const RootStack = DrawerNavigator({
    Home: {
        screen: QualityList,
    },
    Notifications: {
         screen: DetailsScreen,
    },
},{
    drawerWidth: 200, // 抽屉宽
    drawerPosition: 'right', // 抽屉在左边还是右边
    // contentComponent: CustomDrawerContentComponent,  // 自定义抽屉组件
    contentOptions: {
      initialRouteName: 'Home', // 默认页面组件
      activeItemKey : 'Home',
      labelStyle : {//标签样式
          color : 'red',
           height : 30,
      },
      activeTintColor: 'white',  // 选中文字颜色
      activeBackgroundColor: '#ff8500', // 选中背景颜色
      inactiveTintColor: '#666',  // 未选中文字颜色
      inactiveBackgroundColor: '#fff', // 未选中背景颜色
      // style: {  // 样式
      //    marginVertical: 0, 
      // },
   },

});


  const MyNavScreen = ({navigation, banner}) => (  
    <ScrollView>   
        <Button  
            onPress={() => navigation.navigate('Profile', { name: 'Jane' })}  
            title="Go to a profile screen"  
        />  
        <Button  
            onPress={() => navigation.navigate('Photos', { name: 'Jane' })}  
            title="Go to a photos screen"  
        />  
        <Button  
            onPress={() => navigation.goBack(null)}  
            title="Go back"  
        />  
    </ScrollView>  
);    

const RootStack1 = StackNavigator(
    {
      Home: {
        screen: RootStack,
      },
      
    },
    {
      navigationOptions: {
        // gesturesEnabled: false,
      },
      initialRouteName: 'Home',
      headerMode:"none",
      header:{
        cardStack: {
            gesturesEnabled: false,
    },
      }
      
      
    }
  );
  
  export default class extends React.Component {
    static navigationOptions =  {
      // const navigate = navigation || {};
  //   gotoS = ()=> {
  //     console.log(global.storage.qualityNavigation);
  //     console.log(navigation);
  //     global.storage.qualityNavigation.navigate('DrawerToggle');
  //   }
  //   return {
      title: '质检清单',
        tabBarVisible:false,
        headerTintColor:"#FFF",
        headerStyle:{backgroundColor:"#00baf3"},
        // gesturesEnabled:false,
      headerRight: (
        <Button onPress={()=>global.storage.qualityNavigation.navigate('DrawerToggle')} title="菜单" color="#fff" />
      ),
  //   };
    };
    render() {
      return <RootStack />;
    }
  };