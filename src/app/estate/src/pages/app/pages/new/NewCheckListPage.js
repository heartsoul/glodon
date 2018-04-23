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
import PageTest from "./PageTest";

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

    constructor(props) {
        super(props);
        this.activePage = null;
        this.inspectionPage = null;
        this.acceptancePage = null;
        let params = this.getCheckListParams();
        this.state = {
            activeTab: tabs[0],
            inspectParams: params.inspectParams,
            acceptanceParams: params.acceptanceParams,
        };
    }

    getCheckListParams = () => {
        let params = this.props.navigation.state.params;
        let inspectParams = {};
        let acceptanceParams = {};
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
        this.activePage.submit();
        // if (this.state.activeTab.type === tabs[0].type) {
        //     this.refs[REF_INSPECTION].submit();
        // } else {
        //     this.refs[REF_ACCEPTANCE].submit();
        // }
    }

    goBack = () => {
        // if (this.state.activeTab.type === tabs[0].type) {
            this.activePage.goBack();
        // } else {
        //     this.acceptancePage.goBack();
        // }
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
                        onChange={(data, index) => {
                            if(index == 0) {
                                this.activePage = this.inspectionPage;
                            } else if(index == 1) {
                                this.activePage = this.acceptancePage;
                            }
                            this.setState({
                                activeTab: data,
                            });
                        }}
                        swipeable={false}
                        renderTabBar={(props) => {
                            return <NewCheckListTabBar defaultProps={props} submit={this.submit} goBack={this.goBack} />
                        }}
                    >
                        <NewPage ref={(ref)=>{this.inspectionPage = ref;this.activePage = ref}} params={(this.state.inspectParams)} type={tabs[0].type}></NewPage>
                        <NewPage ref={(ref)=>{this.acceptancePage = ref;}} params={(this.state.acceptanceParams)} type={tabs[1].type}></NewPage>
                    </Tabs>
                </View>

            </View>
        );
    }

    setAction1 = (onSave,onSubmit)=>{
        this.onSave1 = onSave;
        this.onSave2 = onSubmit;
    }
}

export default NewCheckListPage;