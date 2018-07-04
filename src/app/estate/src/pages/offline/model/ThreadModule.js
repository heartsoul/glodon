'use strict'

import {NativeModules} from 'react-native';
export default NativeModules.ThreadModule;

// @ReactMethod
// public void startThread(final Callback callback){
//     LogUtil.e("ThreadModule");
//     new Thread(new Runnable() {
//         @Override
//         public void run() {
//             callback.invoke();
//         }
//     }).start();
// }