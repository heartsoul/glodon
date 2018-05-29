"use strict"

import React, { Component } from 'react';
import ReactNative, {
    View,
    Text,
    StatusBar,
    StyleSheet,
    Dimensions,
    TouchableOpacity,
    BackHandler,
    ActivityIndicator,
    Platform,
} from 'react-native';
import { Tabs, } from 'antd-mobile';
import { BarItems } from "app-components"
import NewCheckListTabBar from "./NewCheckListTabBar";
import NewQualityView from "./NewQualityView";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { connect } from 'react-redux';
import * as actions from "./../../actions/newQualityAction2";

var { width, height } = Dimensions.get("window");

const tabs = [
    { title: '检查单', type: "inspection" },
    { title: '验收单', type: "acceptance" },
];
const REF_INSPECTION = 'REF_INSPECTION';//
const REF_ACCEPTANCE = 'REF_ACCEPTANCE';//

class NewQualityPage extends Component {
   
    static navigationOptions = ({ navigation, screenProps }) => ({
        // title: '新建',
        headerTitle: (navigation.state.params.headerTitle),
        headerTintColor: "#FFF",
        headerStyle: { backgroundColor: "#00baf3" },
        headerRight: (
            <BarItems navigation={navigation}>
            <BarItems.RightBarItem text="提交" navigation={navigation}  onPress={(navigation) => navigation.state.params.rightNavigatePress()} />
           </BarItems>
        ),
        headerLeft: navigation.state.params && navigation.state.params.loadLeftTitle ? navigation.state.params.loadLeftTitle() : null,
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
        this.setActiveTab();
        this.setTitle();
    }

    setTitle = () => {
        let headerTitle = (<View style={{ height: 44, alignSelf: "center", flex: 1, }}>
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
        this.props.navigation.setParams({ loadLeftTitle: this.loadLeftTitle, rightNavigatePress: this.submit, onChangePage: this.onChangePage, headerTitle: headerTitle })
    }

    needBack = (backFun) => {
        if (backFun) {
            backFun(false);
        }
        this.goBack();
        return;
    }
    loadLeftTitle = () => {
        return <BarItems top={false} needBack={this.needBack} navigation={this.props.navigation} currentItem={''} />
    }

    setActiveTab = () => {
        let params = this.props.navigation.state.params;
        if (params && params.item && params.item.value) {
            let editType = params.item.value.inspectionType;
            if (editType === tabs[1].type) {
                this.activeTab = 1;
            }
        }
    }
    onChangePage = (data, index) => {
        if (index == 0) {
            this.activePage = this.inspectionPage;
        } else if (index == 1) {
            this.activePage = this.acceptancePage;
        }
        this.activeTab = index;
        if (this.hiddenBar) {
            this.hiddenBar.onTabClick(index);
        }
    }

    componentDidMount() {
        this.props.fetchData(this.props.navigation.state.params);
        if (Platform.OS === 'android') {
            const BackHandler = ReactNative.BackHandler
                ? ReactNative.BackHandler
                : ReactNative.BackAndroid
            this.backListener = BackHandler.addEventListener(
                'hardwareBackPress',
                () => {
                    if(storage.currentRouteName === this.props.navigation.state.routeName){
                        this.goBack();
                        return true;
                    }
                    return false;
                }
            )
        }
    }

    componentWillUnmount() {
        this.props.reset();
        this.removeBackListener()
    }
    removeBackListener() {
        if (this.backListener) {
            this.backListener.remove()
            this.backListener = null
        }
    }
    submit = () => {
        if (this.activePage) {
            this.activePage.submit(this.props.navigation);
        } else {
        }
    }

    goBack = () => {
        if (this.activePage) {
            this.activePage.goBack(this.props.navigation);
        } else {
            this.props.navigation.goBack();
        }
    }
    setRef = (ref, index) => {
        if (index == 0) {
            this.inspectionPage = ref;
        } else {
            this.acceptancePage = ref;
        }
        if (this.activeTab == index) {
            this.activePage = ref;
        }
    }

    getPageParams = (type) => {
        let { editInfo, inspectionCompanies, isEdit, noimage, supporters } = this.props.editParams
        let params = {
            editInfo: editInfo,
            inspectionCompanies: inspectionCompanies,
            supporters: supporters,
            noimage: noimage,
        }
        if (isEdit && editInfo && editInfo.editInfo && editInfo.editInfo.inspectionType != type) {
            params.editInfo = {};
        }

        return params;
    }

    //加载等待的view
    renderLoadingView() {
        return (
            <View style={styles.container}>
                <StatusBar barStyle="light-content" translucent={false} backgroundColor="#00baf3" />
                <ActivityIndicator
                    animating={true}
                    style={{ height: 80 }}
                    color='#00baf3'
                    size="large"
                />
            </View>
        );
    }

    //加载失败view
    renderErrorView(error) {
        return (
            <View>
                <StatusBar barStyle="light-content" translucent={false} backgroundColor="#00baf3" />
                <View>
                    <Text style={{ alignSelf: "center", marginTop: 120 }}> 加载失败</Text>
                </View>
            </View>
        );
    }

    render() {
        if (this.props.loadingError) {
            return this.renderErrorView();
        }
        return (
            <KeyboardAwareScrollView>
                <StatusBar barStyle="light-content" translucent={false} backgroundColor="#00baf3" />
                <View style={{ marginTop: -44 }}>
                    <Tabs
                        tabs={tabs}
                        ananimated={true}
                        swipeable={false}
                        initialPage={this.activeTab}
                        renderTabBar={(props) => {
                            return <NewCheckListTabBar backgroundColor='#FFFFFF' ref={(ref) => { this.hiddenBar = ref; }} activeTab={this.activeTab} defaultProps={props} />
                        }}
                    >
                        <NewQualityView
                            setRef={(ref) => { this.setRef(ref, 0) }}
                            editParams={this.getPageParams(tabs[0].type)}
                            type={tabs[0].type}
                            navigator={this.props.navigation}
                            setTitle={this.setTitle}
                        />
                        <NewQualityView
                            setRef={(ref) => { this.setRef(ref, 1) }}
                            editParams={this.getPageParams(tabs[1].type)}
                            type={tabs[1].type}
                            setTitle={this.setTitle}
                            navigator={this.props.navigation} />
                    </Tabs>
                </View>

            </KeyboardAwareScrollView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
        height: 180
    },
})


export default connect(
    state => ({
        isLoading: state.newQuality.isLoading,
        editParams: state.newQuality.editQualityParams,
        loadingError: state.newQuality.loadingError,
    }),
    dispatch => ({
        fetchData: (params) => {
            dispatch(actions.fetchData(params))
        },
        reset: () => {
            dispatch(actions.reset())
        }
    })
)(NewQualityPage);
