import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { StyleSheet, View, ScrollView, Image, TouchableOpacity, Dimensions,NativeModules } from 'react-native'

import { Overlay, Label, Button , ActionSheet} from 'app-3rd/teaset';

import * as API from 'app-api'

import { BimFileEntry, AuthorityManager } from 'app-entry';//图纸模型选择及展示入口

import PaneViewItem from './PaneViewItem'

const RNBridgeModule = NativeModules.GLDRNBridgeModule; //你的类名
const { width, height } = Dimensions.get("window");
const qualityCreateImage = require("app-images/icon_main_quality_create.png");
const equipmentCreateImage = require("app-images/icon_main_equipment_create.png");

export default class GLDNewMenuView extends Component {
    static openMenu(navigation) {
        let overlayView = (
            <Overlay.PullView side='bottom' modal={false}
                style={{ flexDirection:'row',alignItems: 'center', justifyContent: 'center', alignContent:'center',}}
                // modal={true}
                // overlayOpacity={0}
                ref={v => this.overlayView = v}
            >
                <View style={{flexDirection:'row',  justifyContent: 'center', alignItems: 'center', alignContent:'center', marginBottom:50, marginTop:20 }}>
                    <TouchableOpacity onPress={() => {this.overlayView && this.overlayView.close();GLDNewMenuView.openChoose(navigation);}} style={{ borderColor: '#8a6d3b' }}>
                        <Image style={{ width: 80, height: 80, tintColor: '#8a6d3b' }} source={qualityCreateImage} />
                        <Label style={{ color: '#d4d4d4', fontSize: 16, marginTop: 10 }} text='新建质检单' />
                    </TouchableOpacity>
                    <View style={{width:50,height:50}}/>
                    <TouchableOpacity onPress={() => this.overlayView && this.overlayView.close()} style={{ borderColor: '#8a6d3b' }}>
                        <Image style={{ width: 80, height: 80, tintColor: '#8a6d3b' }} source={equipmentCreateImage} />
                        <Label style={{ color: '#d4d4d4', fontSize: 16, marginTop: 10 }} text='新建材设单' />
                    </TouchableOpacity>
                </View>
            </Overlay.PullView>
        );
        Overlay.show(overlayView);
    }
    static openChoose(navigation) {
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
           
    }
}
