'use strict';
import PropTypes from 'prop-types';
import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  View,
  StatusBar,
  Switch,
  requireNativeComponent,
} from 'react-native';
import ImageChooserView from './ImageChooserView';
import MapView from './MapView';
import SwitchView from './SwitchView';
import DemoView from './DemoView';

export default class extends React.Component {
  static navigationOptions = ({navigation, screenProps}) => ({
    title: '新建',
    headerTintColor:"#FFF",
    headerStyle:{backgroundColor:"#00baf3"},
    headerRight:(  
      <Text  onPress={()=>navigation.state.params.rightNavigatePress()} style={{marginRight:20, color:'#FFFFFF' , width:60, textAlign:"right"}} >  
          提交   
      </Text>  
    ),
    // headerLeft:(  
    //   <Text  onPress={()=>navigation.goBack()} style={{marginLeft:20, color:'#FFFFFF' , width:60, textAlign:"left"}} >  
    //       返回   
    //   </Text>  
    // )
  });
  componentDidMount=()=> {
    console.log(this.props.navigation.state.params);
    //请求数据
     this.props.navigation.setParams({rightNavigatePress:this._rightAction }) 
  }
  
  _rightAction = ()=> {
    console.log("执行_rightAction");
  }
  constructor() {
      super();
    };
  
  render() {
    var region = {
      latitude: 37.48,
      longitude: -122.16,
      latitudeDelta: 0.1,
      longitudeDelta: 0.1,
    };
    return (
      <View>
        <StatusBar barStyle="light-content" translucent={false} backgroundColor="#00baf3" />
      <Text> 新建  </Text>
      <ImageChooserView style={{ top:10,left:20,width:200,height:200 }} backgroundColor="#00baf3" onChange={()=>alert('收到!')} />
      <MapView style={{ top:30,left:20,width:200,height:200 }} region={region}
        zoomEnabled={true} />
        
        <SwitchView style={{ top:100,left:20,width:200,height:200 }} /> 
        
        <DemoView style={{ top:10,left:20,width:200,height:30 }} backgroundColor="#00baf3" onChange={()=>alert('收到')} />
      </View>
      
    );
  }
};

var styles = StyleSheet.create({
    
});