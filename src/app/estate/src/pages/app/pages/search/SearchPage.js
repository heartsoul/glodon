'use strict';
import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    StatusBar,
    SafeAreaView,
    Dimensions,
    Image,
    TouchableOpacity,
} from 'react-native';
import { SearchBar } from 'antd-mobile';
import * as API from "app-api";
import { connect } from 'react-redux';
import * as SearchAction from "./../../actions/searchAction";
import ExtView from "./extView";

var { width, height } = Dimensions.get("window");


import SearchBarStyle from 'antd-mobile/lib/search-bar/style/index.native';

const newStyle = {
    ...SearchBarStyle,
    wrapper: {
        ...SearchBarStyle.wrapper,
        backgroundColor: "#00baf3"
    },
    cancelText: {
        ...SearchBarStyle.cancelText,
        color: "#ffffff",
    }
}
const extViewRef = null;
class SearchPage extends React.Component {
    static navigationOptions = ({ navigation, screenProps }) => ({
        headerStyle: { marginLeft: -100, marginRight: -100, backgroundColor: "#00baf3" },
        headerLeft: <View ></View>,
        headerRight: <View></View>,
        headerTitle: (
            <View style={{ flex: 1, alignItems: "center" }}>
                <View style={{ width: width - 20, alignItems: "center" }}>
                    <SearchBar
                        ref={"searchRef"}
                        styles={StyleSheet.create(newStyle)}
                        placeholder="搜索"
                        showCancelButton={true}
                        defaultValue={navigation.state.params && navigation.state.params.value ? navigation.state.params.value : ""}
                        onSubmit={navigation.state.params && navigation.state.params.onSubmit ? navigation.state.params.onSubmit : () => { }}
                        onBlur={navigation.state.params && navigation.state.params.onBlur ? navigation.state.params.onBlur : () => { }}
                        onFocus={navigation.state.params && navigation.state.params.onFocus ? navigation.state.params.onFocus : () => { }}
                        onCancel={navigation.state.params && navigation.state.params.onCancel ? navigation.state.params.onCancel : () => { }}
                    />
                </View>
            </View>
        ),
    });

    constructor(props) {
        super(props);
        this.state = {
            showHistory: true,
            showContent: false,
        };

        this.props.navigation.setParams({ onSubmit: this.onSubmit, onBlur: this.onBlur, onFocus: this.onFocus, onCancel: this.onCancel });
        this.props.loadHistory();
    }
    componentWillReceiveProps(nextProps) {
        console.log('====================================');
        console.log(nextProps);
        console.log('====================================');
    }

    onSubmit = (keywords) => {
        if (!keywords || keywords.length == 0) {
            return;
        }
        this.setState({
            showHistory: false,
            showContent: true,
        });
        this.props.search(keywords);
    }

    onFocus = () => {
        this.setState({
            showHistory: true,
            showContent: false,
        });
    }

    onCancel = () => {
        storage.goBack(this.props.navigation, null);
    }


    renderSearchHistory = () => {
        if (this.props.searchHistory && this.props.searchHistory.length > 0) {
            return (
                <View style={{ width: width, height: height }}>
                    {
                        this.props.searchHistory.map((item, index) => {
                            return (
                                <TouchableOpacity key={'history' + index} style={{ height: 52, justifyContent: "center", borderBottomColor: "#e6e6e6", borderBottomWidth: 0.5 }} onPress={() => {
                                    this.props.navigation.setParams({ value: item });
                                    extViewRef.focus();
                                    extViewRef.blur();
                                    this.onSubmit(item)
                                }}>
                                    <Text style={{ fontSize: 16, marginLeft: 20, color: "#000000" }}>{item}</Text>
                                </TouchableOpacity>

                            );
                        })
                    }

                </View>
            );

        }
        return null;

    }

    renderSearchContent = () => {
        return (
            <View style={{ width: width, height: height }}>
                {
                    this.renderQualityContent()
                }
                {
                    this.renderEquipmentContent()
                }
            </View>
        );
    }

    renderQualityContent = () => {
        if (this.props.qualityList && this.props.qualityList.length > 0) {
            return (
                <View>
                    <Text style={{ color: "#5e5e5e", fontSize: 14, marginLeft: 20, marginTop: 5 }}>质检清单</Text>
                    <View>
                        <Text>{`我是一个列表
                        我是一个列表
                        我是一个列表
                        `}</Text>
                    </View>

                    {
                        this.props.qualityList.length < this.props.totalQuality ? this.renderMoreView(this.moreQuality) : null
                    }
                </View>
            );
        } else {
            return null;
        }
    }

    renderEquipmentContent = () => {
        if (this.props.equipmentList && this.props.equipmentList.length > 0) {
            return (
                <View>
                    <Text style={{ color: "#5e5e5e", fontSize: 14, marginLeft: 20, marginTop: 5 }}>材设清单</Text>
                    <View>
                        <Text>{`我是一个列表
                        我是一个列表
                        我是一个列表
                        `}</Text>
                    </View>

                    {
                        this.props.equipmentList.length < this.props.totalEquipment ? this.renderMoreView(this.moreEquipment) : null
                    }
                </View>
            );
        } else {
            return null;
        }
    }

    moreQuality = () => {
        alert("moreQuality");
    }

    moreEquipment = () => {
        alert("moreEquipment");
    }

    renderMoreView = (moreCallback) => {
        return (
            <TouchableOpacity onPress={moreCallback}>
                <View style={{ flexDirection: "row", alignItems: "center", paddingLeft: 20, paddingRight: 20, marginTop: 5 }}>
                    <View style={{ height: 1, backgroundColor: "#e6e6e6", flex: 1 }}></View>
                    <Text style={{ color: "#b0b0b0", fontSize: 14, marginLeft: 10 }}>查看更多</Text>
                    <Image style={{ width: 14, height: 8, marginLeft: 5, marginRight: 10 }} source={require("app-images/icon_drawer_arrow_down.png")} />
                    <View style={{ height: 1, backgroundColor: "#e6e6e6", flex: 1 }}></View>
                </View>
            </TouchableOpacity>
        );
    }

    renderEmpty = () => {
        return (
            <View style={{ width: width, height: height }}>
                <Text>empty</Text>
            </View>
        );
    }

    render() {
        return (
            <SafeAreaView style={[styles.container, { backgroundColor: '#ecf0f1' }]}>
                <StatusBar barStyle="light-content" translucent={false} backgroundColor="#00baf3" />
                <ExtView style={{ height: 0,backgroundColor:"#ffffff" }}   underlineColorAndroid={"transparent"} setRef={(ref) => {
                    extViewRef = ref;
                }}></ExtView>
                {
                    this.state.showHistory ? this.renderSearchHistory() : null
                }
                {
                    this.state.showContent ? this.renderSearchContent() : null
                }

            </SafeAreaView>

        );
    }
};

var styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    text: {
        fontSize: 18,
        color: 'gray'
    },
});

export default connect(
    state => ({
        qualityList: state.search.qualityList,
        totalQuality: state.search.totalQuality,
        equipmentList: state.search.equipmentList,
        totalEquipment: state.search.totalEquipment,
        searchHistory: state.search.searchHistory,
    }),
    dispatch => ({
        search: (keywords) => {
            if (dispatch) {
                dispatch(SearchAction.search(keywords));
            }
        },
        loadHistory: () => {
            if (dispatch) {
                dispatch(SearchAction.loadHistory());
            }
        }
    }),
)(SearchPage);