'use strict'

import { NativeModules, Platform } from 'react-native';
import * as API from "app-api";

var CheckVersionManager = NativeModules.CheckVersionManager;

/**
 * 检测版本更新
 * @param {*} type //点击设置中的更新（setting）、自动检测更新(auto)
 */
export function checkVersion(type) {
    if (Platform.OS === 'android') {
        API.checkVersion()
            .then(responseData => {
                if (responseData && responseData.data) {
                    let autoDownload = true;
                    if(storage.loadAutoDownload() != null && storage.loadAutoDownload()!= undefined){
                        autoDownload = storage.loadAutoDownload();
                    }
                    let params = {
                        type: type,
                        sysValue: responseData.data.sysValue,
                        autoDownload: autoDownload,
                    }
                    CheckVersionManager.setVersionInfo(params)
                }
            }).catch(error => {
            })
    }
}
