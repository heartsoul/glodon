import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { StyleSheet, SafeAreaView, Animated, View, ScrollView, Image, TouchableOpacity, Dimensions, NativeModules,Platform} from 'react-native'

import { Overlay, Label, Button, ActionSheet } from 'app-3rd/teaset';
import { ActionModal } from "app-components"
import * as API from 'app-api'

import { AuthorityManager } from 'app-entry';//图纸模型选择及展示入口
import { ImageChooserView } from 'app-components';
import PaneViewItem from './PaneViewItem'
const { width, height } = Dimensions.get("window");
const REF_PHOTO_SELECT = '___REF_PHOTO_SELECT___'
const qualityCreateImage = require("app-images/icon_main_quality_create.png");
const equipmentCreateImage = require("app-images/icon_main_equipment_create.png");
const newImageLight = require('app-images/icon_category_create.png');
const newImage = require('app-images/home/icon_main_create.png');
export default class GLDNewMenuView extends Component { 
    
    static openMenu(navigation) {
        let anim = new Animated.Value(0.0);
        let overlayView = (
            <Overlay.View side='bottom' modal={true}
                style={{ flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end', alignContent: 'center', }}
                // modal={true}
                overlayOpacity={0.7}
                ref={v => this.overlayView = v}
            >
                <SafeAreaView>
                    <View style={[{flexDirection: 'column', justifyContent: 'center', alignItems: 'center', alignContent: 'center' }]}>
                        <Animated.View style={[{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', alignContent: 'center', marginBottom: 33, marginTop: 20 }, {
                            transform: [//transform动画
                                {
                                    translateY: anim.interpolate({
                                        inputRange: [0, 1],
                                        outputRange: [200, 0] //线性插值，0对应60，0.6对应30，1对应0
                                    }),
                                },
                            ],
                        }]}>
                            {
                                AuthorityManager.isQualityCreate() ? (
                                    <TouchableOpacity onPress={() => { this.overlayView && this.overlayView.close(); GLDNewMenuView.openChoose(navigation); }} style={{ borderColor: '#8a6d3b' }}>
                                        <Image style={{ width: 70, height: 70 }} source={qualityCreateImage} />
                                        <Label style={{ color: '#ffffff', fontSize: 14, marginTop: 10 }} text='新建质检单' />
                                    </TouchableOpacity>
                                ) : null
                            }
                            <View style={[{ width: 55, height: 70 }, (AuthorityManager.isQualityCreate() && AuthorityManager.isEquipmentCreate()) ? {} : { display: 'none' }]} />
                            {
                                AuthorityManager.isEquipmentCreate() ? (
                                    <TouchableOpacity onPress={() => { this.overlayView && this.overlayView.close(); storage.pushNext(navigation, "EquipmentDetailPage"); }} style={{ borderColor: '#8a6d3b' }}>
                                        <Image style={{ width: 70, height: 70 }} source={equipmentCreateImage} />
                                        <Label style={{ color: '#ffffff', fontSize: 14, marginTop: 10 }} text='新建材设单' />
                                    </TouchableOpacity>
                                ) : null
                            }
                        </Animated.View >
                        <Animated.View style={[{ width: 61, height: 61, marginBottom: 6, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', alignContent: 'center' }, {
                            transform: [//transform动画
                                {
                                    rotate: anim.interpolate({
                                        inputRange: [0, 1],
                                        outputRange: ['0deg', '45deg'] //线性插值，0对应60，0.6对应30，1对应0
                                    }),
                                },
                            ],
                        }]} >
                            <TouchableOpacity onPress={() => {
                                Animated.timing(anim, { toValue: 0.0 }).start();
                                setTimeout(() => {
                                    this.overlayView && this.overlayView.close();
                                }, 450);
                            }}>
                                <Image style={{ width: 61, height: 61}} source={newImage} />
                            </TouchableOpacity>
                        </Animated.View>
                    </View>
                </SafeAreaView>
            </Overlay.View>
        );
        Overlay.show(overlayView);
        Animated.timing(
            anim,
            { toValue: 1.0 }
        ).start();
    }
    static openChoose(navigation, finish) {
        if (!navigation) {
            navigation = storage.homeNavigation;
        }
        if (!navigation) {
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
                        if (p) {
                            p = p.params
                        }
                        if (!p) {
                            p = {}
                        }
                        storage.pushNext(navigation, "NewPage", { ...p, 'files': files });
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
                        if (p) {
                            p = p.params
                        }
                        if (!p) {
                            p = {}
                        }
                        storage.pushNext(navigation, "NewPage", { ...p, 'files': files });
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
                    if (p) {
                        p = p.state
                    }
                    if (p) {
                        p = p.params
                    }
                    if (!p) {
                        p = {}
                    }
                    storage.pushNext(navigation, "NewPage", { ...p, noimage: true });
                }
            },
        ];
        let cancelItem = { title: '取消' };
        ActionSheet.show(items, cancelItem);
    }
}
