import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { StyleSheet, Text as Label, View, ScrollView, Image, TouchableOpacity, Dimensions } from 'react-native'

import { Drawer } from 'app-3rd/teaset';

import * as API from 'app-api'

const { width, height } = Dimensions.get("window");
const headerImage = require("app-images/icon_main_project_name.png");
const equipmentImage = require("app-images/icon_drawer_equipment.png");
const qualityImage = require("app-images/icon_drawer_quality.png");
const settingImage = require("app-images/icon_drawer_setting.png");

const arrowUpImage = require("app-images/icon_draw_arrow_up.png");
const arrowDownImage = require("app-images/icon_drawer_arrow_down.png");

class PaneViewItem extends Component {
    onClick = (event) => {
        if (!this.props.onClick) {
            return;
        }
        this.props.onClick();
    }
    renderHeader = () => {
        return (
            <View style={[styles.containerView]}>
                <View style={styles.contentView}>
                    <Image source={headerImage} style={styles.headerImage} />
                    <Label style={[styles.content, this.props.color ? { color: this.props.color } : {}]}>{this.props.title}</Label>
                </View>
            </View>
        );
    }

    renderSection = () => {
        return (
            <TouchableOpacity activeOpacity={0.5} onPress={(event) => { this.onClick(event) }}>
                <View style={[styles.containerView]}>
                    <Image source={this.props.image} style={styles.infoMark} />
                    <View style={styles.titleView}>
                        <Label style={[styles.leftTitle, this.props.color ? { color: this.props.color } : {}]}>{this.props.title}</Label>
                    </View>
                    <Image source={this.props.rightImage} style={styles.rightMark} />
                </View>
            </TouchableOpacity>
        );
    }

    renderSectionSimple = () => {
        return (
            <TouchableOpacity activeOpacity={0.5} onPress={(event) => { this.onClick(event) }}>
                <View style={[styles.containerView]}>
                    <Image source={this.props.image} style={styles.infoMark} />
                    <View style={styles.titleView}>
                        <Label style={[styles.leftTitle, this.props.color ? { color: this.props.color } : {}]}>{this.props.title}</Label>
                    </View>
                    <View style={styles.imageEmpty} />
                </View>
            </TouchableOpacity>
        );
    }

    renderLine = () => {
        return (
            <View style={[styles.containerView, styles.lineView]}>
            </View>
        );
    }
    renderItem = () => {
        return (
            <TouchableOpacity activeOpacity={0.5} onPress={(event) => { this.onClick(event) }}>
                <View style={[styles.containerView]}>
                    <View style={styles.imageEmpty} />
                    <View style={styles.titleView}>
                        <Label style={[styles.leftTitle, this.props.color ? { color: this.props.color } : {}]}>{this.props.title}</Label>
                    </View>
                    <View style={styles.imageEmpty} />
                </View>
            </TouchableOpacity>
        );
    }
    render = () => {
        if (this.props.showType === 'header') {
            return this.renderHeader();
        }
        if (this.props.showType === 'section') {
            return this.renderSection();
        }
        if (this.props.showType === 'sectionSimple') {
            return this.renderSectionSimple();
        }
        if (this.props.showType === 'line') {
            return this.renderLine();
        }
        return this.renderItem();
    }
}
PaneViewItem.propTypes = {

    /**
     * 控件展现类型 default|header|section|sectionSimple|line
     */
    showType: PropTypes.string,
    /**
     * 点击响应
     */
    onClick: PropTypes.func,
    /**
     * 标题
     */
    title: PropTypes.string,

    /**
     * 文字颜色
     */
    color: PropTypes.string,
    /**
     * icon image
     */
    image: PropTypes.any,
    /**
     * icon right image
     */
    rightImage: PropTypes.any,
};


const styles = StyleSheet.create({

    containerView: {
        marginTop: 10,
        marginBottom: 5,
        marginLeft: 20,
        marginRight: 20,
        flexDirection: 'row',
    },
    content: {
        fontSize: 16,
        fontWeight: '100',
    },

    leftTitle: {
        fontSize: 16,
        width: 75,
        color: '#FDFDFD',
        fontWeight: '100',
        // fontFamily:"PingFangSC-Light",
    },
    titleView: {
        flexDirection: 'row',

    },
    contentView: {
        flexDirection: 'column',
        alignItems: 'center',
        alignContent: "center",
        justifyContent: 'center',
        width: "100%",
    },
    infoMark: {
        width: 18,
        height: 18,
        marginRight: 10,
        resizeMode: 'contain',
    },
    imageEmpty: {
        width: 18,
        height: 18,
        marginRight: 10,
    },
    rightMark: {
        width: 14,
        height: 14,
        right: 0,
        position: 'absolute',
        resizeMode: 'contain',
    },
    headerImage: {
        width: 50,
        height: 50,
        resizeMode: 'contain',
        marginBottom: 5,
    },
    lineView: {
        marginTop: 10,
        marginBottom: 5,
        marginLeft: 10,
        marginRight: 10,

        height: 0.5,
        // width: '100%',
        backgroundColor: '#cccccc55'
    },
});

export default class GLDDrawerPaneView extends Component {
    static drawer = null
    static open(currentItem,navigation) {
        const view = (
            <GLDDrawerPaneView currentItem={currentItem} navigation={navigation} />
          );
          GLDDrawerPaneView.drawer = Drawer.open(view, 'left');
    }
    static close() {
        if(GLDDrawerPaneView.drawer) {
            GLDDrawerPaneView.drawer.close();
        }
    }
    constructor(props) {
        super(props);
        this.state = {
            qualityOpen:true,
            equipmentOpen:true,
        };
    }
    close = () => {
        GLDDrawerPaneView.close();
    }
    onQualityChange = () => {
        let open = this.state.qualityOpen ? false : true;
        this.setState({
            qualityOpen:open
        });
    }

    onQualityAction = () => {
        // alert(1);
    }

    onQualityDrawerAction = () => {
        // alert(2);
    }

    onQualityModleAction = () => {

    }

    onCheckPointAction = () => {

    }

    onEquipmentChange = () => {
        let open = this.state.equipmentOpen ? false : true;
        this.setState({
            equipmentOpen:open
        });
    }

    onEquipmentAction = () => {

    }

    onEquipmentModleAction = () => {

    }

    onSettingAction = () => {
        this.close();
        storage.pushNext(this.props.navigation,'SettingPage');
    }
    componentDidMount () {
    }
    componentWillUnmount () {
    }
    render() {
        const { currentItem } = this.props
        return (
            <View style={{ backgroundColor: "#3a3a3a", height: height, width: width * 0.667 }}>
                <ScrollView style={{ backgroundColor: "#3a3a3a", height: '100%', width: '100%' }}>
                    <View style={{ marginTop: 100 }}>
                        <PaneViewItem title={storage.loadCurrentProjectName(() => { })} color={API.APP_COLOR_ITEM} showType="header" />
                        <View style={{ width: '100%', height: 50 }}></View>
                        
                        <PaneViewItem title="质检管理" color={API.APP_COLOR_ITEM}
                            onClick={() => { this.onQualityChange() }} showType="section" image={qualityImage} rightImage={arrowDownImage} />
                        <View style={this.state.qualityOpen ? {} : {display:"none"}}>
                        <PaneViewItem title="质检清单" color={currentItem === API.APP_QUALITY ? API.APP_COLOR_CURRENT : API.APP_COLOR_ITEM}
                            onClick={() => {currentItem === API.APP_QUALITY ? {} : this.onQualityAction() }} showType="default" />
                        <PaneViewItem title="图纸" color={currentItem === API.APP_QUALITY_DRAWER ? API.APP_COLOR_CURRENT : API.APP_COLOR_ITEM}
                            onClick={() => { currentItem === API.APP_QUALITY_DRAWER ? {} : this.onQualityDrawerAction() }} showType="default" />
                        <PaneViewItem title="模型" color={currentItem === API.APP_QUALITY_MODLE ? API.APP_COLOR_CURRENT : API.APP_COLOR_ITEM}
                            onClick={() => { currentItem === API.APP_QUALITY_MODLE ? {} :this.onQualityModleAction() }} showType="default" />
                        <PaneViewItem title="质检项目" color={currentItem === API.APP_QUALITY_CHECK_POINT ? API.APP_COLOR_CURRENT : API.APP_COLOR_ITEM}
                            onClick={() => { currentItem === API.APP_QUALITY_CHECK_POINT ? {} : this.onCheckPointAction() }} showType="default" />
                        </View>
                        <PaneViewItem showType="line" color={API.APP_COLOR_ITEM} />
                        <PaneViewItem title="材设进场" color={API.APP_COLOR_ITEM}
                            onClick={() => {this.onEquipmentChange()}} showType="section" image={equipmentImage} rightImage={arrowDownImage} />
                        <View style={this.state.equipmentOpen ? {} : {display:"none"}}>
                        <PaneViewItem title="材设清单" color={currentItem === API.APP_EQUIPMENT ? API.APP_COLOR_CURRENT : API.APP_COLOR_ITEM}
                            onClick={() => {currentItem === API.APP_EQUIPMENT ? {} : this.onEquipmentAction() }} showType="default" />
                        <PaneViewItem title="模型预览" color={currentItem === API.APP_EQUIPMENT_MODLE ? API.APP_COLOR_CURRENT : API.APP_COLOR_ITEM}
                            onClick={() => {currentItem === API.APP_EQUIPMENT_MODLE ? {} : this.onEquipmentModleAction() }} showType="default" />
                        </View>
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
    navigation:PropTypes.any.isRequired,
}
