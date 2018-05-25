/**
 * 网络状态的获取
 */
import {
    NetInfo,
} from 'react-native';
import { ToOfflineOverLay,ToOnlineOverLay } from 'app-components';
import OfflineStateUtil from '../../common/utils/OfflineStateUtil';

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

    static registNetWorkListener = (navigation)=>{
        NetInfo.addEventListener('connectionChange', function change(status){
            console.log('----------------------');
            // console.log(navigation);
            //{"type":"wifi","effectiveType":"unknown"}   wifi
            //{"type":"cellular","effectiveType":"4g"}   4g
            //{"type":"none","effectiveType":"unknown"}  无网
            console.log('status change:' + (JSON.stringify(status)));
            // NetInfo.removeEventListener('connectionChange', change);
            //获取网络状态
            NetInfo.isConnected.fetch().done((isConnected) => {

                if(OfflineStateUtil.isOnLine()){
                    console.log('在线模式');
                    //在线模式下
                    if(isConnected){
                        //变有网
                        ToOfflineOverLay.hide();//当从wifi-4g时   回调两次 wifi-无网  无网-4g
                    }else{
                        //变无网
                        ToOfflineOverLay.show();
                        NetInfo.removeEventListener('connectionChange', change);
                    }
                }else{
                    console.log('离线模式');
                    //离线模式下
                    if(isConnected){
                        //变有网
                        ToOnlineOverLay.show();
                        NetInfo.removeEventListener('connectionChange', change);
                    }else{
                        //变无网  不处理
                    }
                }
                
              });

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

