"use strict"

import React, { Component } from 'react';
import {
    View,
    Text,
    StatusBar,
    StyleSheet,
    Dimensions,
    TouchableOpacity,
    BackHandler,
    Platform,
} from 'react-native';
import { Tabs, } from 'antd-mobile';
import NewCheckListTabBar from "./NewCheckListTabBar";
import NewPage from "./NewPage";

var { width, height } = Dimensions.get("window");

const tabs = [
    { title: '检查单', type: "inspection" },
    { title: '验收单', type: "acceptance" },
];
const REF_INSPECTION = 'REF_INSPECTION';//
const REF_ACCEPTANCE = 'REF_ACCEPTANCE';//

class NewCheckListPage extends Component {

    static navigationOptions = ({ navigation, screenProps }) => ({
        header: null
    });
    activePage = null;//当前选中tab页面的引用
    inspectionPage = null;//检查单页面引用
    acceptancePage = null;//验收单页面引用

    constructor(props) {
        super(props);
        this.activePage = null;
        this.inspectionPage = null;
        this.acceptancePage = null;
        let params = this.getCheckListParams();
        this.state = {
            inspectParams: params.inspectParams,
            acceptanceParams: params.acceptanceParams,
        };
        console.log('====================================');
        console.log(params);
        console.log('====================================');
    }

    getCheckListParams = () => {
        let params = this.props.navigation.state.params;
        let inspectParams = {};
        let acceptanceParams = {};
        // 从待提交进入时候根据单据类型设置参数
        if (params && params.item && params.item.value) {
            let editType = params.item.value.inspectionType;
            if (editType === tabs[0].type) {
                inspectParams = params;
            } else {
                acceptanceParams = params;
            }
        } else {
            inspectParams = params;
            acceptanceParams = params;
        }
        return ({
            inspectParams: inspectParams,
            acceptanceParams: acceptanceParams,
        });
    }

    componentDidMount() {
        BackHandler.addEventListener('hardwareBackPress', () => {
            this.goBack();
            return true;
        });
    }

    componentWillUnmount() {
        if (Platform.OS === 'android') {
            BackHandler.removeEventListener('hardwareBackPress');
        }
    }

    submit = () => {
        if (this.activePage) {
            this.activePage.submit(this.props.navigation);
        } else {
            alert("call error");
        }
    }

    goBack = () => {
        if (this.activePage) {
            this.activePage.goBack(this.props.navigation);
        } else {
            alert("call error");
        }
    }
    /**
     * tab切换
     */
    onChange = (data, index) => {
        (data, index) => {
            if (index == 0) {
                this.activePage = this.inspectionPage;
            } else if (index == 1) {
                this.activePage = this.acceptancePage;
            }
        }
    }

    render() {
        return (
            <View>
                <StatusBar barStyle="light-content" translucent={false} backgroundColor="#00baf3" />
                <View style={{ height: height }}>
                    <Tabs
                        tabs={tabs}
                        initialPage={0}
                        ananimated={true}
                        onChange={(data, index) => { this.onChange(data, index) }}
                        swipeable={false}
                        renderTabBar={(props) => {
                            return <NewCheckListTabBar defaultProps={props} submit={this.submit} goBack={this.goBack} />
                        }}
                    >
                        <NewPage setRef={(ref) => {
                            this.inspectionPage = ref;
                            this.activePage = ref;
                        }} params={(this.state.inspectParams)} type={tabs[0].type}></NewPage>
                        <NewPage setRef={(ref) => {
                            this.acceptancePage = ref;
                        }} params={(this.state.acceptanceParams)} type={tabs[1].type}></NewPage>
                    </Tabs>
                </View>

            </View>
        );
    }

    setAction1 = (onSave, onSubmit) => {
        this.onSave1 = onSave;
        this.onSave2 = onSubmit;
    }
}

export default NewCheckListPage;