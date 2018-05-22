import React, { Component } from 'react';
import {
    Platform,
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
  } from 'react-native';
  import DownloadModel from './DownloadModel';
  
  export default class App extends Component {
    
    //获取离线下载的token
    getToken = ()=>{
        let fileId = '1353300132668256';
        let obj = new DownloadModel();
        obj.getToken(fileId);
    }

    render() {
      return (
        <TouchableOpacity onPress={this.getToken}>
            <View >
                <Text style={{marginTop:40}}>
                    Welcome to React Native!lalalal
                </Text>
            </View>
        </TouchableOpacity>
      );
    }
  }