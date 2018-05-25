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
import { connect } from 'react-redux';
import * as checkPointListAction from './../../../actions/checkPointListAction'; // 导入action方法 
import * as types from '../../../constants/checkPointListTypes';

import * as API from 'app-api'
import { BarItems } from "app-components"
import { BimFileEntry, AuthorityManager } from 'app-entry';

class CheckPointListPage extends Component {

    static navigationOptions = ({ navigation, screenProps }) => ({
        title: '质检项目',
        headerLeft: (<BarItems top={navigation.getParam('top')} navigation={navigation} currentItem={API.APP_QUALITY_CHECK_POINT} />),
    });

    constructor(props) {
        super(props);
        this.state = {
        };
    }

    componentDidMount() {
        this.props.getCheckPoints();
    }


    toAddPage = (item) => {
        let p = this.props.navigation.state.params;
        if (!p) {
            p = {};
        }
        this.props.navigation.state.params = { ...p, qualityCheckpointId: item.id, qualityCheckpointName: item.name };
        BimFileEntry.newSelect(this.props.navigation)
    }
    toCheckPointInfoPage = (item) => {
        storage.pushNext(this.props.navigation, 'QualityStatardsPage', { 'qualityCheckpointId': item.id, 'qualityCheckpointName': item.name });
    }
    toQualityCheckList = (item) => {
        storage.pushNext(this.props.navigation, 'QualityMainPage', { 'qualityCheckpointId': item.id, 'qualityCheckpointName': item.name });
    }

    componentWillUnmount() {
        //页面销毁时，清空选中的项目
        this.props.reset();
    }

    renderPanelHeader = (item) => {
        return (
            <View style={styles.header}>
                <Text style={styles.headerText}>{item.name}</Text>
            </View>
        );
    }

    renderList = (list) => {
        return (
            <List style={styles.list}>
                {
                    list.map((child) => {
                        return (<List.Item key={child.id} style={styles.listItem}>{this.renderItem(child)}</List.Item>);
                    })
                }
            </List>
        );
    }

    renderItem = (item) => {
        return (
            <TouchableOpacity onPress={() => { this.toQualityCheckList(item) }} >
                <View style={styles.itemView} >
                    <Text style={styles.listItemText}>{item.name}</Text>
                    <TouchableOpacity style={{ paddingRight: 20, padding: 10, paddingBottom: 10 }} onPress={() => { this.toCheckPointInfoPage(item) }}>
                        <Image style={styles.markImage} source={require('app-images/icon_module_standard_white.png')} />
                    </TouchableOpacity>
                    <View style={{ flex: 1 }} />
                    {
                        AuthorityManager.isQualityCreate() ? (
                            <TouchableOpacity style={{ paddingLeft: 20, padding: 10, paddingBottom: 10 }} onPress={() => { this.toAddPage(item) }}>
                                <Image style={styles.addImage} source={require('app-images/icon_module_create_white.png')} />
                            </TouchableOpacity>) : (null)
                    }

                    <Image style={styles.arrow} source={require('app-images/icon_arrow_right_white.png')} />
                </View>
            </TouchableOpacity>

        );
    }

    renderPanel = (item) => {
        return (
            <Accordion.Panel key={item.id} header={this.renderPanelHeader(item)}>
                {this.renderList(item.childList)}
            </Accordion.Panel>
        );
    }


    render() {

        return (
            <View>
                <StatusBar barStyle="light-content" translucent={false} backgroundColor="#00baf3" />
                <ScrollView>
                    <Accordion style={styles.container}>
                        {
                            this.props.topDirNode.map((item) => {
                                return (this.renderPanel(item));
                            })
                        }
                    </Accordion>
                    {this.renderList(this.props.topModelNode)}
                </ScrollView>
            </View>
        );
    }
}

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
        fontWeight: '100',
    },

    listItem: {
        backgroundColor: '#00baf3',
        borderBottomWidth:1,
        borderBottomColor:'#f7f7f7',
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
        marginLeft: 5,
    },
    addImage: {
        width: 15,
        height: 15,
        marginRight: 5,
    },
    arrow: {
        width: 15,
        height: 15,
    }

})

export default connect(
    state => ({
        topDirNode: state.checkPointList.topDirNode,
        topModelNode: state.checkPointList.topModelNode,
        selectedCheckPoint: state.checkPointList.selectedCheckPoint,
    }),
    dispatch => ({
        getCheckPoints: () => {
            dispatch(checkPointListAction.getCheckPoints())
        },
        navSuccess: () => {
            dispatch(checkPointListAction.navSuccess())
        },
        reset: () => {
            dispatch(checkPointListAction.reset())
        }
    })
)(CheckPointListPage);
