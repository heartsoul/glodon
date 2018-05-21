/**
 * 网络状态的获取
 */
import {
    NetInfo,
} from 'react-native';

export default class NetWorkUtil {

    // _getNetworkState(){
    //     NetInfo.getConnectionInfo().then((connectionInfo) => {
    //         // console.log('Initial, type: ' + connectionInfo.type + ', effectiveType: ' + connectionInfo.effectiveType);
    //         console.log(connectionInfo);
    //       });
    //       function handleFirstConnectivityChange(connectionInfo) {
    //         // console.log('First change, type: ' + connectionInfo.type + ', effectiveType: ' + connectionInfo.effectiveType);
    //         console.log(connectionInfo);
    //         // NetInfo.removeEventListener(
    //         //   'connectionChange',
    //         //   handleFirstConnectivityChange
    //         // );
    //       }
    //       NetInfo.addEventListener(
    //         'connectionChange',
    //         handleFirstConnectivityChange
    //       );
    // }

    //是否连接到了网络
     static isNetWorkConnected(retFunc){
        NetInfo.isConnected.fetch().done((isConnected) => {
            retFunc(isConnected);
          });
    }

    //当前是否wifi
    static isWifi = (retFunc) => {
        NetInfo.getConnectionInfo().then((connectionInfo) => {
            retFunc(connectionInfo.type == 'wifi' || connectionInfo.type == 'WIFI')
          });
    }

   
}

//使用

// import React,{Component} from 'react';
// import {
//     NetInfo,
//     Platform,
//     Text,
// } from 'react-native';
// import NetWorkUtil from './NetWorkUtil';


// export default class NetWorkTest extends Component{

   

//     _isNetWorkConnected(){
//         NetWorkUtil.isNetWorkConnected((state)=>{
//             console.log(`_isNetWorkConnected state=${state}`)
//       })    
//     }

//     _isWifi(){
//         NetWorkUtil.isWifi((state) => {
//             console.log(`_isWifi state=${state}`);
//         })
//     }

   

//     render(){
//         this._isWifi();
//         return (
//             <Text> ssssssssssssssssssssss </Text>
//         );
//     }
// }

