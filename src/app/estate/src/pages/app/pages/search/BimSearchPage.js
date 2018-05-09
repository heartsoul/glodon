'use strict';
import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    StatusBar,
    SafeAreaView,
    FlatList,
    Dimensions,
    TouchableOpacity,
} from 'react-native';
import { connect } from 'react-redux';

import * as SearchAction from "./../../actions/searchAction";
import BaseSearchPage from "./BaseSearchPage";
import ThumbnailImage from "./../navigation/bim/ThumbnailImage"
import * as API from "app-api";
import { BimFileEntry } from "app-entry";

var { width, height } = Dimensions.get("window");

class BimSearchPage extends BaseSearchPage {

    constructor(props) {
        super(props);
        super.setFunc(this.renderContent, this.search)
        this.props.searchBimFileReset();

    };

    componentDidMount() {
        const { params } = this.props.navigation.state;
        this.setState({
            pageType: params.pageType,
            dataType: params.dataType,
        });
    }

    search = (keywords) => {
        let suffix = "";
        let isModel = true;
        if (this.state.dataType === '图纸文件') {
            suffix = "dwg";
            isModel = false;
        } else {
            suffix = "rvt";
            isModel = true;
        }
        this.props.search(keywords, suffix, isModel);

    }

    _itemClick = (item) => {
        API.getModelBimFileToken(storage.loadProject(), storage.projectIdVersionId, item.fileId)
            .then((responseData) => {
                let token = responseData.data.data;
                global.storage.bimToken = token;
                if (this.state.dataType === '图纸文件') {
                    BimFileEntry.showBlueprintFromChoose(this.props.navigation, this.state.pageType, item.fileId, item.name);
                } else {
                    BimFileEntry.showModelFromChoose(this.props.navigation, this.state.pageType, item.fileId, item.buildingId, item.buildingName)
                }
            });
    }


    renderItemView = ({ item, index }) => {
        return (
            <TouchableOpacity activeOpacity={0.5} onPress={() => this._itemClick(item, index)}>
                <View style={styles.containerFileView}>
                    <ThumbnailImage fileId={item.fileId} />
                    <Text style={styles.content}> {item.name}</Text>
                </View>
            </TouchableOpacity>
        );
    }

    renderContent() {
        return (
            <View>
                <FlatList style={{ width: width }}
                    data={this.props.bimFiles}
                    renderItem={this.renderItemView}
                    ItemSeparatorComponent={this._separator}
                    keyExtractor={(item, index) => item.fileId}
                />
            </View>
        );
    }
};

var styles = StyleSheet.create({
    containerFileView: {
        flex: 1,
        height: 72,
        marginLeft: 20,
        flexDirection: 'row',
        alignItems: 'center'
        // backgroundColor: '#FFF',
    },
    content: {
        left: 0,
        top: 15,
        marginLeft: 12,
        textAlign: "left",
        fontSize: 15,
        color: 'black',
        alignSelf: 'flex-start'
    },

});

function mapStateToProps(state) {
    return { ...state }
}

function mapDispatchToProps(dispatch) {
    return {
        search: (keywords, suffix, isModel) => {
            if (dispatch) {
                dispatch(SearchAction.searchBimFile(keywords, suffix, isModel));
            }
        },
        loadHistory: () => {
            if (dispatch) {
                dispatch(SearchAction.loadHistory());
            }
        },
        searchBimFileReset: () => {
            if (dispatch) {
                dispatch(SearchAction.searchBimFileReset());
            }
        },

    }
}

function mergeProps(stateProps, dispatchProps, ownProps) {
    return Object.assign({}, ownProps, dispatchProps, {
        searchHistory: stateProps.search.searchHistory,
        bimFiles: stateProps.search.bimFiles,
        updateIndex: stateProps.updateData.updateIndex
    })

}

export default connect(
    mapStateToProps,
    mapDispatchToProps, mergeProps, { withRef: true }
)(BimSearchPage);
