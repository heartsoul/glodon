'use strict'

import React, { Component } from 'react';
import {
    View,
    ScrollView,
    Text,
    Image,
    FlatList,
    StyleSheet,
    TouchableHighlight,
    TouchableOpacity,
    BackHandler,
} from 'react-native';

import { connect } from 'react-redux' // 引入connect函数
import * as API from 'app-api';
import * as AuthorityManager from "../navigation/project/AuthorityManager";
import { Dimensions } from 'react-native';
import App from '../../../containers/App';
import { BarItems, LoadingView } from "app-components";
import UserInfoManager from '../../../offline/manager/UserInfoManager'

let userInfoManager = null;
//切换项目主页
export default class ChangeProjectPage extends Component {

    static navigationOptions = {
        headerTitle: <BarItems.TitleBarItem text='设置' />,
        headerRight: <View />,
    };
    selectProjectId = null;//选中的项目的id
    trueTenantStr = null;//当前有效的租户信息

    constructor() {
        super();
        this.state = {
            pressed: false,
            tenantName: '',
            dataList: [],
        };

        //获取当前选中的项目
        storage.loadProject((retVal) => {
            this.selectProjectId = Number.parseInt(retVal);
        });

        storage.loadTenantInfo((retVal) => {
            this.trueTenantStr = retVal;
        });

        userInfoManager = new UserInfoManager();
    }

   

    //获取当前项目最新版本
    _getlatestVersion = (projectId)=>{
        API.getModelLatestVersion(projectId).then((responseData) => {
            let latestVersion = responseData.data.data.versionId;
            storage.projectIdVersionId = latestVersion;
            storage.setLatestVersionId(projectId,latestVersion);
        }).catch((error) => {
            console.log(error);
        });
    }

      //第一次render后调用
    componentDidMount(){
        
        //渲染当前的租户和项目列表
        this._refreshData();
        //增加监听，切换租户后回来调用
        //React Navigation emits events to screen components that subscribe to them:
        // willBlur - the screen will be unfocused
        // willFocus - the screen will focus
        // didFocus - the screen focused (if there was a transition, the transition completed)
        // didBlur - the screen unfocused (if there was a transition, the transition completed)
        this.props.navigation.addListener(
            'didFocus',
            payload => {
                console.debug('didBlur', payload);
                //获取是否刷新
                storage.loadTenantInfoRefresh((retVal) => {
                    if ('1' === retVal) {
                        storage.saveTenantInfoRefresh('0');//恢复设置
                        //刷新
                        this._refreshData();
                    }
                });

            }
        );

        //硬件返回监听
        BackHandler.addEventListener('hardwareBackPress', () => {
            this._goBack();
            return true;
        });

    }

    componentWillUnmount() {
        userInfoManager.close();
        BackHandler.removeEventListener('hardwareBackPress', () => {
            this._goBack();
            return true;
        });
    }

    //获取当前租户及项目
    _refreshData() {
        storage.loadTenantInfo((retVal) => {
            // JSON.parse(retVal)   retVal={"key":"A09","value":{"id":5200286,"admin":true,"tenantId":5200052,"tenantName":"11301919"}}
            let tenant = JSON.parse(retVal);
            this.setState(preState => {
                return { ...preState, tenantName: tenant.value.tenantName };
            });

        })
        this._getProjects();
    }

    //获取当前租户的所有项目列表
    _getProjects() {
        // API.getProjects(0, 1).then(
        //     (responseData) => {
        //         let last = responseData.last;
        //         if (last) {
        //             this.setState(preState => {
        //                 return { ...preState, dataList: responseData.data.content }
        //             });
        //         } else {
        //             API.getProjects(0, responseData.data.totalElements).then(
        //                 (responseData) => {
        //                     this.setState(preState => {
        //                         return { ...preState, dataList: responseData.data.content }
        //                     });

        //                 }
        //             ).catch(err => {
        //                 console.log(err);
        //             });
        //         }

        //     }
        // ).catch(err => {
        //     console.log(err);
        // });

        userInfoManager.getProjectList().then((list)=>{
            this.setState(preState => {
                return { ...preState, dataList:list }
            });
        })
    }


    //跳转至切换租户页面
    _tenantChoose = () => {
        let navigator = this.props.navigation;
        storage.projectIdVersionId = '';
        storage.pushNext(navigator, "TenantPage", { changeProject: true })
    }

    //返回键
    _goBack = () => {

        let item = JSON.parse(this.trueTenantStr);
        console.log(item);
        storage.loadTenantInfo((retVal) => {
            let curTenant = JSON.parse(retVal);
            if (item.value.id != curTenant.value.id) {
                API.setCurrentTenant(item.value.tenantId).then((responseData) => {
                    storage.saveTenant(item.value.id);
                    storage.saveLastTenant(item.value.tenantId);
                    storage.saveTenantInfo(this.trueTenantStr);//保存当前的租户item信息
                });
            }
        });

        let navigator = this.props.navigation;
        storage.goBack(navigator, null);
    }

    //item点击事件
    _itemClick = (item) => {
        this._getlatestVersion(item.id);//获取项目最新版本
        let navigator = this.props.navigation;
        //切换项目了  需要先获取项目的权限
        AuthorityManager.loadAuthoritys("" + item.id, (success) => {
            if (!success) {
                alert('获取权限失败');
                return;
            }
            storage.saveProject("" + item.id, "" + item.name);
            storage.gotoMainPage(navigator);
        });
        
    }
    //item的view
    renderItemView = ({ item }) => {
        let width = Dimensions.get('window').width - 22;
        if (this.selectProjectId != item.id) {
            return (
                <TouchableOpacity  activeOpacity={0.5} onPress={() => this._itemClick(item)}>
                    <View style={styles.containerView}>
                        <Text style={styles.content}> {item.name}</Text>
                        <View style={{ marginLeft: 22, height: 1, width: width, backgroundColor: '#F7F7F7' }} />
                    </View>
                </TouchableOpacity>
            );
        } else {
            return (
                <TouchableOpacity activeOpacity={0.5} onPress={() => this._itemClick(item)}>
                    <View style={styles.containerView}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                            <Text style={styles.contentSelected}> {item.name}</Text>
                            <Image source={require('app-images/icon_choose_list_selected.png')} style={{ width: 22, height: 16, marginRight: 21 }} />
                        </View>
                        <View style={{ marginLeft: 22, height: 1, width: width, backgroundColor: '#F7F7F7' }} />
                    </View>
                </TouchableOpacity>
            );
        }
    }

    render() {

        let tenantName = this.state.tenantName;
        let dataList = this.state.dataList;
        return (
            <ScrollView style={{ backgroundColor: '#F7F7F7' }} >
                <TouchableOpacity onPress={this._tenantChoose}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFFFF', height: 51 }}>
                        <Image source={require('app-images/icon_choose_project_item.png')} style={{ width: 30, height: 30, marginLeft: 20 }} />
                        <Text style={{ fontSize: 16, color: '#6F899B', marginLeft: 12, flex: 1 }} >{tenantName}</Text>
                        <Image source={require('app-images/icon_arrow_right_gray.png')} style={{ width: 5, height: 12, marginRight: 18 }} />
                    </View>
                </TouchableOpacity>
                <FlatList style={{ marginTop: 10, backgroundColor: '#FFFFFF' }}
                    data={dataList}
                    renderItem={this.renderItemView}
                    keyExtractor={(item, index) => index+''}
                />

                <TouchableHighlight
                    onPress={this._goBack}
                    underlayColor="#0099f3"
                    activeOpacity={1.0}

                    style={
                        this.state.pressed
                            ? styles.logoutTextViewPressed
                            : styles.logoutTextView
                    }
                    onHideUnderlay={() => {
                        this.setState({ pressed: false });
                    }}
                    onShowUnderlay={() => {
                        this.setState({ pressed: true });
                    }}
                >
                    <Text style={styles.logoutText}>返回 </Text>
                </TouchableHighlight>
            </ScrollView>
        );
    }

}



const styles = StyleSheet.create({

    logoutTextView: {
        overflow: "hidden",
        height: 40,
        backgroundColor: "#00baf3",
        borderRadius: 20,
        marginTop: 40,
        marginLeft: 20,
        marginRight: 20,
        marginBottom: 40,
    },

    logoutTextViewPressed: {
        overflow: "hidden",
        height: 40,
        backgroundColor: "#33baf3",
        borderRadius: 20,
        marginTop: 40,
        marginLeft: 20,
        marginRight: 20,
        marginBottom: 40,
    },
    logoutText: {
        overflow: "hidden",
        height: 20,
        marginTop: 10,
        marginLeft: 20,
        marginRight: 20,
        borderRadius: 20,
        alignItems: "center",
        textAlign: "center",
        fontSize: 16,
        color: "#fff"
    },

    containerView: {
        height: 50,
        flexDirection: 'column',
        flex: 1,
    },
    content: {

        alignItems: "center",
        textAlign: "left",
        fontSize: 16,
        color: 'black',
        marginLeft: 20,
        marginRight: 20,
        marginTop: 15,
        flex: 1,
    },
    contentSelected: {
        alignItems: "center",
        textAlign: "left",
        fontSize: 16,
        color: '#00BAF3',
        marginLeft: 20,
        marginRight: 20,
        flex: 1,
    },

});