import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { StyleSheet, View, ScrollView, Image, TouchableOpacity, Dimensions,NativeModules } from 'react-native'

import { Overlay, Label, Button , ActionSheet} from 'app-3rd/teaset';

import * as API from 'app-api'

import { BimFileEntry, AuthorityManager } from 'app-entry';//图纸模型选择及展示入口
import { ImageChooserView } from 'app-components';
import PaneViewItem from './PaneViewItem'
const { width, height } = Dimensions.get("window");
const REF_PHOTO_SELECT = '___REF_PHOTO_SELECT___'
const qualityCreateImage = require("app-images/icon_main_quality_create.png");
const equipmentCreateImage = require("app-images/icon_main_equipment_create.png");

export default class GLDNewMenuView extends Component {
    static openMenu(navigation) {
        let overlayView = (
            <Overlay.View side='bottom' modal={false}
                style={{ flexDirection:'column' ,alignItems: 'center', justifyContent: 'flex-end', alignContent:'center',}}
                // modal={true}
                // overlayOpacity={0}
                ref={v => this.overlayView = v}
            >
                <View style={{flexDirection:'row' ,  justifyContent: 'center', alignItems: 'center', alignContent:'center', marginBottom:65, marginTop:20 }}>
                    <TouchableOpacity onPress={() => {this.overlayView && this.overlayView.close();GLDNewMenuView.openChoose(navigation);}} style={{ borderColor: '#8a6d3b' }}>
                        <Image style={{ width: 80, height: 80 }} source={qualityCreateImage} />
                        <Label style={{ color: '#ffffff', fontSize: 16, marginTop: 10 }} text='新建质检单' />
                    </TouchableOpacity>
                    <View style={{width:50,height:50}}/>
                    <TouchableOpacity onPress={() => this.overlayView && this.overlayView.close()} style={{ borderColor: '#8a6d3b' }}>
                        <Image style={{ width: 80, height: 80 }} source={equipmentCreateImage} />
                        <Label style={{ color: '#ffffff', fontSize: 16, marginTop: 10 }} text='新建材设单' />
                    </TouchableOpacity>
                </View>
            </Overlay.View>
        );
        Overlay.show(overlayView);
    }
    static takePhoto(navigation) {
      let overlayView = (
        <Overlay.View side='bottom' modal={false}
            style={{ flexDirection:'column' ,alignItems: 'center', justifyContent: 'flex-end', alignContent:'center',}}
            // modal={true}
            // overlayOpacity={0}
            ref={v => this.overlayView = v}
        >
            <ImageChooserView needTakePhoto={true} files={[]} style={{ top: 0, left: 0, width: width, height: 100, marginTop: 20 }} backgroundColor="#00baf3" onChange={() => alert('收到!')} />
        </Overlay.View>
    );
    Overlay.show(overlayView);
    }
    static openChoose(navigation) {
            let items = [
              {title: '拍照', onPress: () => {
                ImageChooserView.takePhoto((files,success)=>{
                  alert(files);
                })
               }},
              {title: '从手机相册选择', onPress: () => {
                
                ImageChooserView.pickerImages((files,success)=>{
                  alert(files);
                })
              }},
              {title: '无需图片,直接新建', disabled: false, onPress: () => {storage.pushNext(navigation, "NewPage");}},
            ];
            let cancelItem = {title: '取消'};
            ActionSheet.show(items, cancelItem);
           
    }
}
