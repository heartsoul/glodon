import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { StyleSheet, View, ScrollView, Image, TouchableOpacity, Dimensions, NativeModules } from 'react-native'

import { Overlay, Label, Button, ActionSheet } from 'app-3rd/teaset';

import * as API from 'app-api'

import { AuthorityManager } from 'app-entry';//图纸模型选择及展示入口
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
                style={{ flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end', alignContent: 'center', }}
                // modal={true}
                // overlayOpacity={0}
                ref={v => this.overlayView = v}
            >
                <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', alignContent: 'center', marginBottom: 65, marginTop: 20 }}>
                    {
                        AuthorityManager.isQualityCreate() ? (
                            <TouchableOpacity onPress={() => { this.overlayView && this.overlayView.close(); GLDNewMenuView.openChoose(navigation); }} style={{ borderColor: '#8a6d3b' }}>
                                <Image style={{ width: 80, height: 80 }} source={qualityCreateImage} />
                                <Label style={{ color: '#ffffff', fontSize: 16, marginTop: 10 }} text='新建质检单' />
                            </TouchableOpacity>
                        ) : null
                    }
                    <View style={[{ width: 50, height: 50 }, (AuthorityManager.isQualityCreate() && AuthorityManager.isEquipmentCreate()) ? {} : { display: 'none' }]} />
                    {
                        AuthorityManager.isEquipmentCreate() ? (
                            <TouchableOpacity onPress={() => {this.overlayView && this.overlayView.close(); storage.pushNext(navigation, "EquipmentNewPage");}} style={{ borderColor: '#8a6d3b' }}>
                                <Image style={{ width: 80, height: 80 }} source={equipmentCreateImage} />
                                <Label style={{ color: '#ffffff', fontSize: 16, marginTop: 10 }} text='新建材设单' />
                            </TouchableOpacity>
                        ) : null
                    }
                </View>
            </Overlay.View>
        );
        Overlay.show(overlayView);
    }
    static openChoose(navigation, finish) {
        if(!navigation) {
            navigation = storage.homeNavigation;
        }
        if(!navigation) {
            alert('无法正常操作');
            return;
        }
        let items = [
            {
                title: '拍照', onPress: () => {
                    ImageChooserView.takePhoto((files, success) => {
                        if (!success || files.length < 1) {
                            return;
                        }
                        if (success && finish) {
                            finish(files);
                            return;
                        }
                        let p = navigation.state;
                    if(p) {
                        p = p.params
                    }
                    if(!p) {
                        p = {}
                    }
                        storage.pushNext(navigation, "NewPage", {...p, 'files': files });
                    })
                }
            },
            {
                title: '从手机相册选择', onPress: () => {

                    ImageChooserView.pickerImages((files, success) => {
                        if (!success || files.length < 1) {
                            return;
                        }
                        if (finish) {
                            finish(files);
                            return;
                        }
                        let p = navigation.state;
                    if(p) {
                        p = p.params
                    }
                    if(!p) {
                        p = {}
                    }
                        storage.pushNext(navigation, "NewPage", {...p,'files': files });
                    })
                }
            },
            {
                title: '无需图片,直接新建', disabled: false, onPress: () => {
                    if (finish) {
                        finish([]);
                        return;
                    }
                    let p = navigation;
                    if(p) {
                        p = p.state
                    }
                    if(p) {
                        p = p.params
                    }
                    if(!p) {
                        p = {}
                    }
                    storage.pushNext(navigation, "NewPage",{...p,noimage:true});
                }
            },
        ];
        let cancelItem = { title: '取消' };
        ActionSheet.show(items, cancelItem);
    }
}
