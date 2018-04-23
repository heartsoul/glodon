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
        // title: '新建',
        headerTitle: (navigation.state.params.headerTitle),
        headerTintColor: "#FFF",
        headerStyle: { backgroundColor: "#00baf3" },
        headerRight: (
            <Text onPress={() => navigation.state.params.rightNavigatePress()} style={{ marginRight: 20, color: '#FFFFFF', width: 60, textAlign: "right" }} >
                提交
        </Text>
        ),
        headerLeft: (
            <Text onPress={() => navigation.state.params.leftNavigatePress()} style={{ marginLeft: 20, color: '#FFFFFF', width: 60, textAlign: "left" }} >
                返回
        </Text>
        ),
        gesturesEnabled: false,
        // header: null
    });
    activePage = null;
    inspectionPage = null;
    acceptancePage = null;
    hiddenBar = null;
    activeTab = 0;
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
        let headerTitle = (<View style={{ height: 44, width: 200 }}>
            <Tabs
                tabs={tabs}
                initialPage={this.activeTab}
                ananimated={true}
                onChange={(data, index) => {
                    this.onChangePage(data, index);
                }}
                noRenderContent={true}
                swipeable={false}
                renderTabBar={(props) => {
                    return <NewCheckListTabBar defaultProps={props} />
                }}
            >
            </Tabs></View>);
        this.props.navigation.setParams({ leftNavigatePress: this.goBack, rightNavigatePress: this.submit, onChangePage: this.onChangePage, headerTitle: headerTitle })
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
                this.activeTab = 1;
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
    onChangePage = (data, index) => {
        if (index == 0) {
            this.activePage = this.inspectionPage;
        } else if (index == 1) {
            this.activePage = this.acceptancePage;
        }
        this.hiddenBar.onTabClick(index);
        // this.formPage.goToTab(index, true, true);
    }
    componentWillMount = () => {

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

    render() {
        return (
            <View>
                <StatusBar barStyle="light-content" translucent={false} backgroundColor="#00baf3" />
                <View style={{ height: height + 44, marginTop: -44 }}>
                    <Tabs
                        tabs={tabs}
                        initialPage={this.activeTab}
                        ananimated={true}
                        swipeable={false}
                        renderTabBar={(props) => {
                            return <NewCheckListTabBar ref={(ref) => { this.hiddenBar = ref; }} activeTab={this.activeTab} defaultProps={props} />
                        }}
                    >
                        <NewPage setRef={(ref) => {
                            this.inspectionPage = ref;
                            if (this.activeTab == 0) {
                                this.activePage = ref;
                            }
                        }} params={(this.state.inspectParams)} type={tabs[0].type}></NewPage>
                        <NewPage setRef={(ref) => {
                            this.acceptancePage = ref;
                            if (this.activeTab == 1) {
                                this.activePage = ref;
                            }
                        }} params={(this.state.acceptanceParams)} type={tabs[1].type}></NewPage>
                    </Tabs>
                </View>

            </View>
        );
    }
}

export default NewCheckListPage;