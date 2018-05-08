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
    TextInput,
    TouchableOpacity,
    SectionList,
    ScrollView,
} from 'react-native';
import { SearchBar } from 'antd-mobile';
import * as API from "app-api";
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
const searchRef = null;
const searchKeywords = null;
export default class BaseSearchPage extends React.Component {
    static navigationOptions = ({ navigation, screenProps }) => ({
        headerStyle: { marginLeft: -100, marginRight: -100, backgroundColor: "#00baf3" },
        headerLeft: <View ></View>,
        headerRight: <View></View>,
        headerTitle: (
            <View style={{ flex: 1, alignItems: "center" }}>
                <View style={{ width: width - 20, alignItems: "center" }}>
                    <SearchBar
                        ref={(ref) => {
                            searchRef = ref;
                        }}
                        styles={StyleSheet.create(newStyle)}
                        placeholder="搜索"
                        showCancelButton={true}
                        defaultValue={searchKeywords}
                        onSubmit={navigation.state.params && navigation.state.params.onSubmit ? navigation.state.params.onSubmit : () => { }}
                        onBlur={navigation.state.params && navigation.state.params.onBlur ? navigation.state.params.onBlur : () => { }}
                        onFocus={navigation.state.params && navigation.state.params.onFocus ? navigation.state.params.onFocus : () => { }}
                        onCancel={navigation.state.params && navigation.state.params.onCancel ? navigation.state.params.onCancel : () => { }}
                        onChange={navigation.state.params && navigation.state.params.onChange ? navigation.state.params.onChange : () => { }}
                    />
                </View>
            </View>
        ),
    });
    renderFunc = null;
    searchFunc = null;
    constructor(props) {
        super(props);
        this.state = {
            showHistory: true,
            showContent: false,
        };
        this.props.navigation.setParams({ onSubmit: this.onSearch, onBlur: this.onBlur, onFocus: this.onFocus, onCancel: this.onCancel });
        this.props.loadHistory();

    }

    setFunc(renderFunc, searchFunc) {
        this.renderFunc = renderFunc;
        this.searchFunc = searchFunc;
    }

    onChange = (keywords) => {
        if (!keywords || keywords.length == 0) {
            searchKeywords = null
        } else {
            searchKeywords = keywords;
        }
    }

    onSearch = (keywords) => {
        if (!keywords || keywords.length == 0) {
            return;
        }
        this.setState({
            showHistory: false,
            showContent: true,
        });
        if (this.searchFunc) {
            this.searchFunc(keywords);
        }
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
                                    this.onChange(item);
                                    this.props.navigation.setParams({ value: item });
                                    if (searchRef && searchRef.inputRef) {
                                        searchRef.inputRef.blur();
                                    }
                                    this.onSearch(item)
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
        return this.renderFunc ? this.renderFunc() : null;
    }

    render() {
        return (
            <SafeAreaView style={[styles.container, { backgroundColor: '#ecf0f1' }]}>
                <StatusBar barStyle="light-content" translucent={false} backgroundColor="#00baf3" />
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

