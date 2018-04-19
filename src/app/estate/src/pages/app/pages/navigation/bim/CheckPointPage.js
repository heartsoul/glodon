/**
 * 选择质检项目
 */
'use strict';

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
    StyleSheet,
    Text,
    View,
    Image,
    TouchableOpacity,
    FlatList,
    StatusBar,
    Modal,
    Button,
} from 'react-native';
import {
    ListRow,
    Overlay,
    Theme,
    Label,
} from 'app-3rd/teaset';
import * as QUALITYAPI from "app-api";

export default class CheckPointList extends React.Component {

    constructor() {
        super();
        this.state = {
            checkPoints: [],
            listData: [],
            navData: [],
            selectedCheckPoint: {},
            callback: PropTypes.func,
        }

    }

    componentDidMount() {
        let params = this.props.navigation.state.params;
        this.setState({
            selectedCheckPoint: params.selectedCheckPoint,
            callback: params.callback,
        });

        this._getCheckPoints();
    }


    /**
     * 获取质检项目列表
     */
    _getCheckPoints = () => {
        QUALITYAPI.getCheckPoints(storage.projectId)
            .then(data => {
                this.setState({
                    checkPoints: data.data,
                });
                this.setState({
                    listData: this._getListByParentId(null),
                });
            });
    }

    static navigationOptions = {
        title: '质检项目',
        tabBarVisible: false,
        headerTintColor: "#FFF",
        headerStyle: { backgroundColor: "#00baf3" },
    }

    _getListByParentId = (parentId) => {
        let data = [];
        this.state.checkPoints.map((item) => {
            if (item.parentId == parentId) {
                if (this._hasChild(item.id)) {
                    item.viewType = 1;
                }
                data.push(item);
            }
        });
        return data;
    }

    _hasChild = (parentId) => {
        for (let item of this.state.checkPoints) {
            if (item.parentId == parentId) {
                return true;
            }
        }
        return false;
    }
    //点击列表item
    _moduleItemClick = (item, index) => {
        if (item.viewType == 1) {
            //点击目录
            this.setState({
                listData: this._getListByParentId(item.id),
            });
            this.state.navData.push(item);
        } else {
            //点击质检项目
            if (typeof this.state.callback === 'function') {
                this.state.callback(item)
                this.props.navigation.goBack();
            }
        }
    }
    //点击导航
    _navItemClick = (item, index) => {
        this.setState({
            listData: this._getListByParentId(item.parentId),
        });
        let len = this.state.navData.length;
        this.state.navData.splice(index, len - index);
    }

    renderNavItemView = ({ item, index }) => {
        return (
            <TouchableOpacity activeOpacity={0.5} onPress={() => this._navItemClick(item, index)} >
                <View style={styles.navContainer}>
                    <Text style={(index == this.state.navData.length - 1) ? styles.lastNavName : styles.navName}> {item.name}</Text>
                    {
                        (index == this.state.navData.length - 1) ? (
                            <Image style={styles.navDownArrow} source={require('app-images/icon_blue_arrow_down.png')} />
                        ) :
                            (<Text style={styles.navArrow}> {'->'}</Text>)
                    }


                </View>
            </TouchableOpacity>
        );
    }

    //返回itemView
    renderDirItemView = ({ item, index }) => {
        return (

            <TouchableOpacity activeOpacity={0.5} onPress={() => { this._moduleItemClick(item, index) }}>
                <View style={styles.moduleItemContainer}>
                    <Image source={require('app-images/icon_blueprint_file.png')} style={styles.moduleDirIcon} />
                    <Text style={styles.moduleDirItemName}> {item.name}</Text>
                    <Image source={require('app-images/icon_arrow_right_gray.png')} style={styles.moduleItemArrow} />
                </View>
            </TouchableOpacity>
        );
    }

    toCheckPointInfo = (item) => {
        let navigator = this.props.navigation;
        storage.pushNext(navigator, "QualityStatardsPage", { 'qualityCheckpointId': item.id, 'qualityCheckpointName': item.name });
    }

    renderModuleItemView = ({ item, index }) => {
        return (
            <TouchableOpacity activeOpacity={0.5} onPress={() => { this._moduleItemClick(item, index) }} >
                <View style={styles.moduleItemContainer}>
                    <Text style={styles.moduleChildItemName}> {item.name}</Text>
                    <TouchableOpacity onPress={() => { this.toCheckPointInfo(item)}}>
                        <Image source={require('app-images/icon_benchmark.png')} style={styles.moduleChildMark} />
                    </TouchableOpacity>
                    <View style={{ flex: 1 }} />
                    {
                        (this.state.selectedCheckPoint && this.state.selectedCheckPoint.id == item.id) ? (
                            <Image source={require('app-images/icon_choose_list_selected.png')} style={styles.moduleItemSelectedIcon} />
                        ) : (null)
                    }
                </View>
            </TouchableOpacity>
        );
    }

    renderContentItem = ({ item, index }) => {
        if (item.viewType == 1) {
            return this.renderDirItemView({ item, index });
        } else {
            return this.renderModuleItemView({ item, index });
        }
    }
    itemSeparatorComponent = () => {
        return (<View style={styles.moduleItemDividerLine}></View>)
    }

    showDefault(transparent, modal, text) {
        let overlayView = (
            <Overlay.View
                style={{ alignItems: 'center', justifyContent: 'center', marginTop: 100 }}
                modal={modal}
                overlayOpacity={transparent ? 0 : null}
                ref={v => this.overlayView = v}
            >
                <View style={{ backgroundColor: transparent ? '#333' : Theme.defaultColor, padding: 40, borderRadius: 15, alignItems: 'center', }}>
                    <Text>fsd</Text>
                    {/* <Label type='danger' size='xl' text={text} />
              {modal ? <View style={{height: 20}} /> : null}
              {modal ? <Button title='Close' onPress={() => this.overlayView && this.overlayView.close()} /> : null} */}
                </View>
            </Overlay.View>
        );
        Overlay.show(overlayView);
    }

    render() {

        return (
            <View style={{ flex: 1 }}>

                {
                    (this.state.navData && this.state.navData.length > 0) ? (
                        <View style={{ height: 48 }}>
                            <FlatList
                                horizontal={true}
                                showsHorizontalScrollIndicator={false}
                                data={this.state.navData}
                                renderItem={this.renderNavItemView}
                                keyExtractor={(item, index) => index + "aa"}
                            />
                        </View>
                    ) : (null)
                }

                <View style={{ flex: 1 }}>

                    <FlatList
                        ItemSeparatorComponent={this.itemSeparatorComponent}
                        showsVerticalIndicator={false}
                        data={this.state.listData}
                        renderItem={this.renderContentItem}
                        keyExtractor={(item, index) => index + "bb"}
                    />
                </View>

            </View>
        );
    }
}


var styles = StyleSheet.create({

    navContainer: {
        flexDirection: 'row',
        height: 48,
        alignItems: 'center'
    },
    navName: {
        fontSize: 14,
        color: '#b5b5b5',
        marginLeft: 20
    },
    lastNavName: {
        fontSize: 14,
        color: '#00baf3',
        marginLeft: 20
    },
    navArrow: {
        fontSize: 14,
        color: '#b5b5b5',
        marginRight: 8,
        flex: 1
    },
    navDownArrow: {
        width: 11,
        height: 5
    },
    moduleItemContainer: {
        flexDirection: 'row',
        height: 52,
        alignItems: 'center'
    },
    moduleChildItemName: {
        fontSize: 16,
        color: '#333333',
        marginLeft: 20,
        marginRight: 12
    },
    moduleChildMark: {
        width: 15,
        height: 15,
    },
    moduleItemSelectedIcon: {
        marginRight: 21,
        width: 21,
        height: 14
    },
    moduleItemArrow: {
        marginRight: 21,
        width: 5,
        height: 12
    },
    moduleDirItemName: {
        fontSize: 16,
        color: '#333333',
        flex: 1
    },
    moduleDirIcon: {
        width: 30,
        height: 25,
        marginLeft: 20,
        marginRight: 14,
    },
    moduleItemDividerLine: {
        height: 0.5,
        marginLeft: 19,
        flex: 1,
        backgroundColor: '#CCCCCC'
    }

});