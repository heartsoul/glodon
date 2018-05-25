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
  import RNFS from 'react-native-fs';
  
  export function getA(){
        return RNFS.exists('sdcard/bimcache').then((result)=>{
            console.log('------------'+result);
            return result;
        }).catch((error)=>{
            console.log(error);
        })
        
    }

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
        console.log('------------');
        RNFS.exists('sdcard/bimcache').then((result)=>{
            console.log('------------'+result);
        }).catch((error)=>{
            console.log(error);
        })

        
        function getB(a){
            return fetch('https://www.baidu.com').then((res)=>{
                console.log('bbbbbbbbbbbb');
                return a+'bb';
            });
        }

        async function f(){
            let a = await getA();
            let b = await getB(a);
            let c = await b+'c';
            return c;
        }

       

        f().then((a)=>{
            console.log(a);
        },(e)=>{
            console.log(e);
        });

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