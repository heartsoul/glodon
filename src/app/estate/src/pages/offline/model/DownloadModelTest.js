import React, { Component } from 'react';
import {
    Platform,
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
  } from 'react-native';
  import DownloadModel from './DownloadModel';
  import DirManager from '../manager/DirManager';
  import ModelManager from '../manager/ModelManager';
  
  export default class App extends Component {
    
    //获取离线下载的token
    getToken = ()=>{
        // let fileId = '1353300132668256';
        // let obj = new DownloadModel();
        // obj.getToken(fileId);

        // let dm = new DirManager();
        // dm.makeDirs();

        // let mm = new ModelManager();
        // mm.exist('2233').then((res)=>{
        //     console.log(res);
        // }).catch((error) => {
        //     console.log(error);
        // })

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