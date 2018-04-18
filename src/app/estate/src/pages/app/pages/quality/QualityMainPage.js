import React from 'react';
import {StyleSheet, Button, View, Text, Image, TouchableOpacity, NativeModules,Dimensions } from 'react-native';
import { StackNavigator, DrawerNavigator, withNavigation } from 'app-3rd/react-navigation'; 
import { SegmentedBar, Drawer, Label, ActionSheet } from 'app-3rd/teaset';
import QualityList from './qualityList'
import * as API from 'app-api'
import {GLDDrawerPaneView} from "app-components"
var RNBridgeModule = NativeModules.GLDRNBridgeModule; //你的类名
var { width, height } = Dimensions.get("window");
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
}, {
    drawerWidth: 200, // 抽屉宽
    drawerPosition: 'right', // 抽屉在左边还是右边
    // contentComponent: CustomDrawerContentComponent,  // 自定义抽屉组件
    contentOptions: {
      initialRouteName: 'Home', // 默认页面组件
      activeItemKey: 'Home',
      labelStyle: {//标签样式
        color: 'red',
        height: 30,
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


const MyNavScreen = ({ navigation, banner }) => (
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

let view = (
  <View style={{ backgroundColor: "#333333", height: height, width: width*2/3 }}>
    <View style={{justifyContent: 'center', alignItems: 'center' }}>
      <GLDDrawerPaneView style={{width:width*2/3}} currentItem={API.APP_EQUIPMENT} />
    </View>
  </View>
);
let drawer = null;

class RightBarButtons extends React.Component {
  _onSearchPress = (navigation) => {
    console.log(navigation);
    navigation.navigate("SearchPage")
    // storage.qualityNavigation.navigate('DrawerToggle')
    
  }
  _onNewPress = (navigation) => {
    let items = [
      {title: '拍照', onPress: () => {
        RNBridgeModule.RNInvokeOCCallBack(
        {
          caller: "gldrn",
          name: "callNative",
          ver: "1.0",
          data: { subName: "photo", message: "调用相机" }
        },
        (data, request) => {
          console.log(data);
          console.log(request);
        }
      );}},
      {title: '从手机相册选择', onPress: () => {
        RNBridgeModule.RNInvokeOCCallBack(
          {
            caller: "gldrn",
            name: "callNative",
            ver: "1.0",
            data: { subName: "photo", message: "调用相机" }
          },
          (data, request) => {
            console.log(data);
            console.log(request);
          }
        );
      }},
      {title: '无需图片,直接新建', disabled: false, onPress: () => {navigation.navigate("NewPage");}},
    ];
    let cancelItem = {title: '取消'};
    ActionSheet.show(items, cancelItem);
    // navigation.navigate("NewPage");
  }
  render() {
    return <View style={{
      alignItems: 'center',
      flexDirection: 'row',
      flexWrap: 'nowrap',
      justifyContent: 'flex-end',
      width: 70,
    }}>
       <TouchableOpacity onPress={() => this._onSearchPress(this.props.navigation)} >
      <Image style={styles.barItemImage} resizeMode='center' source={require('app-images/icon_search_white.png')} />
    </TouchableOpacity>
    <View style={styles.spliteItem} />
       <TouchableOpacity onPress={() => this._onNewPress(this.props.navigation)} >
      <Image style={styles.barItemImage} resizeMode='center' source={require('app-images/icon_camera_white.png')} />
    </TouchableOpacity>
    <View style={styles.spliteItem} />
    </View>
  }
}
class LeftBarButtons extends React.Component {
  _onBackPress = (navigation) => {
    console.log(navigation);
    navigation.goBack();
  }
  _onMenuPress = (navigation) => {
    Drawer.open(view, 'left');
  }
  render() {
    return <View style={{
      alignItems: 'center',
      flexDirection: 'row',
      flexWrap: 'nowrap',
      justifyContent: 'flex-start',
      width: 70,
    }}>
    <View style={styles.spliteItem} />
       <TouchableOpacity onPress={() => this._onBackPress(this.props.navigation)} >
      <Image style={styles.barItemImage} resizeMode='center' source={require('app-images/icon_back_white.png')} />
    </TouchableOpacity>
    <View style={styles.spliteItem} />
       <TouchableOpacity onPress={() => this._onMenuPress(this.props.navigation)} >
      <Image style={styles.barItemImage} resizeMode='center' source={require('app-images/icon_quality_check_menu.png')} />
    </TouchableOpacity>
    </View>
  }
}
// let RightButton = withNavigation(RightBarButtons);
// let LeftButton = withNavigation(RightBarButtons);
export default class extends React.Component {
  static navigationOptions = ({navigation, screenProps}) => ({
    title: '质检清单',
    tabBarVisible: false,
    headerTintColor: "#FFF",
    headerStyle: { backgroundColor: "#00baf3" },
    // gesturesEnabled:false,
    headerRight: (
      <RightBarButtons navigation={navigation} />
    ),
    headerLeft: (
      <LeftBarButtons navigation={navigation} />
    ),
    // headerLeft: (
    //   //let drawer = null; Drawer.open(view, 'left');
    //   // <Button onPress={()=>storage.qualityNavigation.navigate('DrawerToggle')
    // // } title="菜单" color="#fff" />
    // <View style={{alignItems: 'center',
    // flexDirection: 'row',
    // flexWrap: 'wrap',
    // justifyContent:'flex-start',}}>
    //   <BackButton />
    //   <MenuButton />
    // </View>
    // ),
  });
  render() {
    return <RootStack />;
  }
};
const styles = StyleSheet.create({
  barItemImage:{
    width:26,
    height:26,
  },
  spliteItem: {
    width: 10,
  },
});