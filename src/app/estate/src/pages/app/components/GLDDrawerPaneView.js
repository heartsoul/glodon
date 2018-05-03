import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { StyleSheet, Text as Label, View, ScrollView, Image, TouchableOpacity, Dimensions } from 'react-native'

import { Drawer } from 'app-3rd/teaset';

import * as API from 'app-api'

import { BimFileEntry, AuthorityManager } from 'app-entry';//图纸模型选择及展示入口

import PaneViewItem from './PaneViewItem'
import { replace } from 'connected-react-router';

const { width, height } = Dimensions.get("window");
const headerImage = require("app-images/icon_main_project_name.png");
const equipmentImage = require("app-images/icon_drawer_equipment.png");
const qualityImage = require("app-images/icon_drawer_quality.png");
const settingImage = require("app-images/icon_drawer_setting.png");

const arrowUpImage = require("app-images/icon_draw_arrow_up.png");
const arrowDownImage = require("app-images/icon_drawer_arrow_down.png");

export default class GLDDrawerPaneView extends Component {
    static drawer = null
    static open(currentItem, navigation) {
        const view = (
            <GLDDrawerPaneView currentItem={currentItem} navigation={navigation} />
        );
        GLDDrawerPaneView.drawer = Drawer.open(view, 'left','translate');
    }
    static close() {
        if (GLDDrawerPaneView.drawer) {
            GLDDrawerPaneView.drawer.close();
        }
    }
    constructor(props) {
        super(props);
        this.state = {
            qualityOpen: true,
            equipmentOpen: true,
        };
    }
    close = () => {
        GLDDrawerPaneView.close();
    }
    onQualityChange = () => {
        let open = this.state.qualityOpen ? false : true;
        this.setState({
            qualityOpen: open
        });
    }

    onQualityAction = () => {
        this.close();
        let navigator = this.props.navigation;
        storage.projectIdVersionId = '';
        storage.fileId = '';
        storage.bimToken = {};

        storage.replaceNext(navigator, "QualityMainPage", {top:true})
    }
    //图纸
    onQualityDrawerAction = () => {
        this.close();
        let navigator = this.props.navigation;
        BimFileEntry.chooseBlueprintFromHome(navigator, true, true);
    }
    //模型
    onQualityModleAction = () => {
        this.close();
        let navigator = this.props.navigation;
        BimFileEntry.chooseQualityModelFromHome(navigator, true, true);
    }
    //质检项目
    onCheckPointAction = () => {
        this.close();
        let navigator = this.props.navigation;
        storage.projectIdVersionId = '';
        storage.replaceNext(navigator, "CheckPointListPage", {top:true});
    }

    onEquipmentChange = () => {
        let open = this.state.equipmentOpen ? false : true;
        this.setState({
            equipmentOpen: open
        });
    }

    onEquipmentAction = () => {
        this.close();
        let navigator = this.props.navigation;
        storage.projectIdVersionId = '';
        storage.fileId = '';
        storage.bimToken = {};

        storage.replaceNext(navigator, "EquipmentMainPage", {top:true})
    }
    //模型预览
    onEquipmentModleAction = () => {
        this.close();
        let navigator = this.props.navigation;
        BimFileEntry.chooseEquipmentModelFromHome(navigator, true, true);
    }

    onSettingAction = () => {
        this.close();
        storage.replaceNext(this.props.navigation, 'SettingPage', {top:true});
    }
    componentDidMount() {
    }
    componentWillUnmount() {
    }
    renderA = (currentItem) => {
        const show = AuthorityManager.isQualityBrowser()
        if (show) {
            return (
                <View>
                    <PaneViewItem title="质检管理" color={API.APP_COLOR_ITEM} display={AuthorityManager.isQualityBrowser()}
                        onClick={() => { this.onQualityChange() }} showType="section" image={qualityImage} rightImage={arrowDownImage} />
                    <View style={this.state.qualityOpen ? {} : { display: "none" }}>
                        <PaneViewItem title="质检清单" color={currentItem === API.APP_QUALITY ? API.APP_COLOR_CURRENT : API.APP_COLOR_ITEM}
                            onClick={() => { currentItem === API.APP_QUALITY ? {} : this.onQualityAction() }} showType="default" />
                        <PaneViewItem title="图纸" color={currentItem === API.APP_QUALITY_DRAWER ? API.APP_COLOR_CURRENT : API.APP_COLOR_ITEM}
                            onClick={() => { currentItem === API.APP_QUALITY_DRAWER ? {} : this.onQualityDrawerAction() }} showType="default" />
                        <PaneViewItem title="模型" color={currentItem === API.APP_QUALITY_MODLE ? API.APP_COLOR_CURRENT : API.APP_COLOR_ITEM}
                            onClick={() => { currentItem === API.APP_QUALITY_MODLE ? {} : this.onQualityModleAction() }} showType="default" />
                        <PaneViewItem title="质检项目" color={currentItem === API.APP_QUALITY_CHECK_POINT ? API.APP_COLOR_CURRENT : API.APP_COLOR_ITEM}
                            onClick={() => { currentItem === API.APP_QUALITY_CHECK_POINT ? {} : this.onCheckPointAction() }} showType="default" />
                    </View>
                </View>
            )
        }
        return null;
    }
    renderB = (currentItem) => {
        const show = AuthorityManager.isEquipmentBrowser()
        if (show) {
            return (
                <View>
                    <PaneViewItem showType="line" color={API.APP_COLOR_ITEM} />
                    <PaneViewItem title="材设进场" color={API.APP_COLOR_ITEM}
                        onClick={() => { this.onEquipmentChange() }} showType="section" image={equipmentImage} rightImage={arrowDownImage} />
                    <View style={this.state.equipmentOpen ? {} : { display: "none" }}>
                        <PaneViewItem title="材设清单" color={currentItem === API.APP_EQUIPMENT ? API.APP_COLOR_CURRENT : API.APP_COLOR_ITEM}
                            onClick={() => { currentItem === API.APP_EQUIPMENT ? {} : this.onEquipmentAction() }} showType="default" />
                        <PaneViewItem title="模型预览" color={currentItem === API.APP_EQUIPMENT_MODLE ? API.APP_COLOR_CURRENT : API.APP_COLOR_ITEM}
                            onClick={() => { currentItem === API.APP_EQUIPMENT_MODLE ? {} : this.onEquipmentModleAction() }} showType="default" />
                    </View>
                </View>
            )
        }
        return null;
    }
    render() {
        const { currentItem } = this.props

        return (
            <View style={{ backgroundColor: "#3a3a3a", height: height, width: width * 0.667 }}>
                <ScrollView style={{ backgroundColor: "#3a3a3a", height: '100%', width: '100%' }}>
                    <View style={{ marginTop: 100 }}>
                        <PaneViewItem title={storage.loadCurrentProjectName(() => { })} image={headerImage} color={API.APP_COLOR_ITEM} showType="header" />
                        <View style={{ width: '100%', height: 50 }}></View>
                        {
                            this.renderA(currentItem)
                        }
                        {
                            this.renderB(currentItem)
                        }
                        <PaneViewItem showType="line" color={API.APP_COLOR_ITEM} />
                        <PaneViewItem title="设置" color={API.APP_COLOR_ITEM}
                            onClick={() => { this.onSettingAction() }} showType="sectionSimple" image={settingImage} />
                        <PaneViewItem showType="line" color={API.APP_COLOR_ITEM} />
                    </View>
                </ScrollView>
            </View>
        )
    }
}

GLDDrawerPaneView.propTypes = {
    currentItem: PropTypes.string.isRequired,
    navigation: PropTypes.any.isRequired,
}
