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
        backgroundColor: "#00baf3",
        elevation: 0
    },

    cancelText: {
        ...SearchBarStyle.cancelText,
        color: "#ffffff",
    }
}
var searchRef = null;
var searchKeywords = null;
export default class BaseSearchPage extends React.Component {
    static navigationOptions = ({ navigation, screenProps }) => ({
        headerStyle: { marginLeft: -100, marginRight: -100, backgroundColor: "#00baf3" },
        headerLeft: null,
        headerRight: null,
        headerTitle: navigation.state.params && navigation.state.params.renderHeaderTitle ? navigation.state.params.renderHeaderTitle() : (
            (
                <View style={{ flex: 1, height: "100%", alignItems: "center", justifyContent: "center", }}>
                    <View style={{ width: width - 15, marginTop: 10 }}>
                        <SearchBar
                            styles={StyleSheet.create(newStyle)}
                            style={{ backgroundColor: "#00baf3" }}
                            placeholder="搜索"
                            showCancelButton={true}
                            value={null}
                            defaultValue={searchKeywords}
                            returnKeyType={"search"}
                        />
                    </View>
                </View>
            )
        ),
    });
    renderFunc = null;
    searchFunc = null;
    placeholder = "搜索";
    constructor(props) {
        super(props);
        let showHistory = true;
        let state = this.props.navigation.state
        if (state && state.params && state.params.keywords && state.params.keywords.length > 0) {
            searchKeywords = state.params.keywords;
            showHistory = false;
        }

        this.state = {
            showHistory: showHistory,
            showContent: !showHistory,
            inputValue:searchKeywords,
        };
        this.props.loadHistory();
    }
    componentDidMount() {
        this.onSearch(searchKeywords)
        let eles = document.getElementsByClassName("am-search-cancel");
        for (let ele of eles) {
            ele.style.color = "#ffffff"
        }
    }

    componentWillUnmount() {
        searchRef = null;
        searchKeywords = null;
    }

    renderHeaderTitle = () => {
        //请输入构件名称/质检项/材设名称
        return (
            <View style={{ flex: 1, height: "100%", alignItems: "center", justifyContent: "center", }}>
                <View style={{ width: width - 15, marginTop: 10 }}>
                    <SearchBar
                        ref={(ref) => {
                            searchRef = ref;
                        }}
                        value={this.state.inputValue}
                        styles={StyleSheet.create(newStyle)}
                        style={{ backgroundColor: "#00baf3" }}
                        placeholder={this.placeholder}
                        showCancelButton={true}
                        returnKeyType={"search"}
                        defaultValue={searchKeywords}
                        onSubmit={this.onSearch}
                        onBlur={this.onBlur}
                        onFocus={this.onFocus}
                        onCancel={this.onCancel}
                        onChange={this.onChange}
                    />
                </View>
            </View>
        );
    }


    setFunc(renderFunc, searchFunc, placeholder) {
        this.renderFunc = renderFunc;
        this.searchFunc = searchFunc;
        if (placeholder) {
            this.placeholder = placeholder;
        }
        this.props.navigation.setParams({ renderHeaderTitle: this.renderHeaderTitle });
    }

    onChange = (keywords) => {
        if (!keywords || keywords.length == 0) {
            searchKeywords = null
        } else {
            searchKeywords = keywords;
        }
        this.setState({
            inputValue: keywords
        },()=>{
            this.props.navigation.setParams({ renderHeaderTitle: this.renderHeaderTitle });
        })
    }

    onSearch = () => {
        if (!searchKeywords || searchKeywords.length == 0) {
            return;
        }
        this.setState({
            showHistory: false,
            showContent: true,
        });
        if (this.searchFunc) {
            this.searchFunc(searchKeywords);
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

    searchHistory = (item) => {
        this.onChange(item);
        if (searchRef && searchRef.inputRef) {
            searchRef.inputRef.blur();
        }
        this.onSearch(item)
    }

    renderSearchHistory = () => {
        if (this.props.searchHistory && this.props.searchHistory.length > 0) {
            return (
                <ScrollView>
                    <View>
                        {
                            this.props.searchHistory.map((item, index) => {
                                return (
                                    <TouchableOpacity key={'history' + index} style={{ height: 52, justifyContent: "center", borderBottomColor: "#e6e6e6", borderBottomWidth: 0.5 }} onPress={(event) => {event.preventDefault(); 
                                        this.searchHistory(item);
                                    }}>
                                        <Text style={{ fontSize: 16, marginLeft: 20, color: "#000000" }}>{item}</Text>
                                    </TouchableOpacity>
                                );
                            })
                        }

                    </View>
                </ScrollView>

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

