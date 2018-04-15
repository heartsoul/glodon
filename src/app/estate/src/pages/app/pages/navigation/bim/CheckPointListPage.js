'use strict'

import React, { Component } from 'react';
import {
    View,
    StyleSheet,
    Text,
    Image,
    StatusBar,
    FlatList,
    ScrollView,
    TouchableOpacity,
} from 'react-native';
import { Accordion, List } from 'antd-mobile';

import * as API from 'app-api';

class CheckPointListPage extends Component {

    static navigationOptions = ({ navigation, screenProps }) => ({
        title: '质检项目',
        headerTintColor: "#FFF",
        headerStyle: { backgroundColor: "#00baf3" },
    });

    constructor(props) {
        super(props);
        this.state = {
            listData: [],
            topDirNode: [],
            topModelNode: [],//   
        };
    }

    componentDidMount() {
        this.getCheckPoints();
    }

    /**
     * 获取质检项目列表
     */
    getCheckPoints = () => {
        API.getCheckPoints(storage.projectId)
            .then(data => {

                let topNode = this._getListByParentId(data.data, null);
                let topDirNode = [];
                let topModelNode = [];
                topNode.map((item) => {
                    if (item.viewType == 1) {
                        item.childList = this._getListByParentId(data.data, item.id)
                        topDirNode.push(item);
                    } else {
                        topModelNode.push(item);
                    }
                });
                this.setState({
                    checkPoints: data.data,
                    topDirNode: topDirNode,
                    topModelNode: topModelNode,
                });
            });
    }

    _getListByParentId = (checkPoints, parentId) => {
        let data = [];
        checkPoints.map((item) => {
            if (item.parentId == parentId) {
                if (this._hasChild(checkPoints, item.id)) {
                    item.viewType = 1;
                }
                data.push(item);
            }
        });
        return data;
    }

    _hasChild = (checkPoints, parentId) => {
        for (let item of checkPoints) {
            if (item.parentId == parentId) {
                return true;
            }
        }
        return false;
    }

    panelHeader = (item) => {
        return (
            <View style={styles.header}>
                <Text style={styles.headerText}>{item.name}</Text>
            </View>
        );
    }

    toQualityCheckList = (checkPoint) => {
        //跳转到列表页
        let navigator = this.props.navigation;
        storage.pushNext(navigator, 'QualityMainPage', { selectedCheckPoint: checkPoint, });
    }

    toCheckPointInfoPage = (item) => {
        //构件信息页面
    }

    toAddPage = (checkPoint) => {
        //新建页面
        let navigator = this.props.navigation;
        storage.pushNext(navigator, 'NewPage', { selectedCheckPoint: checkPoint, });
    }

    renderItem = (item) => {
        return (
            <TouchableOpacity onPress={() => { this.toQualityCheckList(item) }} >
                <View style={styles.itemView} >
                    <Text style={styles.listText}>{item.name}</Text>
                    <TouchableOpacity style={{ paddingRight: 20, padding: 10, paddingBottom: 10 }} onPress={() => { this.toCheckPointInfoPage(item) }}>
                        <Image style={styles.markImage} source={require('app-images/icon_module_standard_white.png')} />
                    </TouchableOpacity>
                    <View style={{ flex: 1 }} />
                    <TouchableOpacity style={{ paddingLeft: 20, padding: 10, paddingBottom: 10 }} onPress={() => { this.toAddPage(item) }}>
                        <Image style={styles.addImage} source={require('app-images/icon_module_create_white.png')} />
                    </TouchableOpacity>
                    <Image style={styles.arrow} source={require('app-images/icon_arrow_right_gray.png')} />
                </View>
            </TouchableOpacity>

        );
    }

    renderPanel = (item) => {
        return (
            (item.viewType == 1) ? (
                <Accordion.Panel header={this.panelHeader(item)}>
                    <List style={styles.list}>
                        {
                            item.childList.map((child) => {
                                return (<List.Item style={styles.listItem}>{this.renderItem(child)}</List.Item>);
                            })
                        }
                    </List>
                </Accordion.Panel>
            ) : (
                    <Accordion.Panel header={this.panelHeader(item)}>
                    </Accordion.Panel>
                )
        );
    }


    render() {
        return (
            <View>
                <StatusBar barStyle="light-content" translucent={false} backgroundColor="#00baf3" />
                <ScrollView>
                    <Accordion style={styles.container}>
                        {
                            this.state.topDirNode.map((item) => {
                                return (this.renderPanel(item));
                            })
                        }
                    </Accordion>
                    <List style={styles.list}>
                        {
                            this.state.topModelNode.map((child) => {
                                return (<List.Item style={styles.listItem}>{this.renderItem(child)}</List.Item>);
                            })
                        }
                    </List>
                </ScrollView>
            </View>
        );
    }
}

export default CheckPointListPage;

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#ffffff',
        padding: 0,

    },
    header: {
        height: 60,
        backgroundColor: '#ffffff',
        flex: 1,
        justifyContent: 'center',
        marginLeft: -60,
        marginRight: -60,
    },
    headerText: {
        paddingLeft: 60,
        fontSize: 15,
    },

    listItem: {
        backgroundColor: '#00baf3',
    },
    itemView: {
        height: 40,
        flexDirection: 'row',
        alignItems: 'center',
    },
    listItemText: {
        fontSize: 15,
        color: '#ffffff'
    },
    markImage: {
        width: 15,
        height: 15,
        marginLeft: 20,
    },
    addImage: {
        width: 15,
        height: 15,
        marginRight: 20,
    },
    arrow: {
        width: 15,
        height: 15,
    }

})


