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
        };
    }

    componentDidMount() {
        this.props.getCheckPoints();
    }

    shouldComponentUpdate(nextProps, nextState) {
        if (nextProps.navPage) {
            let navigator = this.props.navigation;
            if(nextProps.navPage === 'QualityStatardsPage'){
                storage.pushNext(navigator, "QualityStatardsPage", { 'qualityCheckpointId': nextProps.selectedCheckPoint.id, 'qualityCheckpointName': nextProps.selectedCheckPoint.name });
            }else{
                storage.pushNext(navigator, nextProps.navPage);
            }
            // this.props.navSuccess();
            return false;
        }
        return true
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
            <TouchableOpacity onPress={() => { this.props.toQualityCheckList(item) }} >
                <View style={styles.itemView} >
                    <Text style={styles.listText}>{item.name}</Text>
                    <TouchableOpacity style={{ paddingRight: 20, padding: 10, paddingBottom: 10 }} onPress={() => { this.props.toCheckPointInfoPage(item) }}>
                        <Image style={styles.markImage} source={require('app-images/icon_module_standard_white.png')} />
                    </TouchableOpacity>
                    <View style={{ flex: 1 }} />
                    <TouchableOpacity style={{ paddingLeft: 20, padding: 10, paddingBottom: 10 }} onPress={() => { this.props.toAddPage(item) }}>
                        <Image style={styles.addImage} source={require('app-images/icon_module_create_white.png')} />
                    </TouchableOpacity>
                    <Image style={styles.arrow} source={require('app-images/icon_arrow_right_gray.png')} />
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

export default connect(
    state => ({
        navPage: state.checkPointList.navPage,
        topDirNode: state.checkPointList.topDirNode,
        topModelNode: state.checkPointList.topModelNode,
        selectedCheckPoint:  state.checkPointList.selectedCheckPoint,
    }),
    dispatch => ({
        getCheckPoints: () => {
            dispatch(checkPointListAction.getCheckPoints())
        },
        toCheckPointInfoPage: (checkPoint) => {
            dispatch(checkPointListAction.toCheckPointInfoPage(checkPoint))
        },
        toAddPage: (checkPoint) => {
            dispatch(checkPointListAction.toAddPage(checkPoint))
        },
        toQualityCheckList: (checkPoint) => {
            dispatch(checkPointListAction.toQualityCheckList(checkPoint))
        },
        navSuccess: () => {
            dispatch(checkPointListAction.navSuccess())
        },
        reset: () => {
            dispatch(checkPointListAction.reset())
        }
    })
)(CheckPointListPage);
