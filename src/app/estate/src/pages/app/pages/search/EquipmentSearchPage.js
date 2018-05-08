'use strict';
import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    StatusBar,
    SafeAreaView,
    ScrollView
} from 'react-native';
import { connect } from 'react-redux';
import * as API from "app-api";

import BaseSearchPage from "./BaseSearchPage"
import * as SearchAction from "./../../actions/searchAction";
import EquipmentListCell from "./../equipment/equipmentListCell";
import EquipmentListView from "./../equipment/equipmentListView";

class EquipmentSearchPage extends BaseSearchPage {
    listRef = null;
    constructor(props) {
        super(props);
        super.setFunc(this.renderContent, this.search)
        this.states = {
            keywords: "",
        }
    };

    search = (keywords) => {
        this.setState({
            keywords: keywords,
        }, () => {
            if (this.listRef) {
                this.listRef.fetchData("search")
            }
        });
    }

    renderContent() {
        return (
            <EquipmentListView
                onRef={(ref) => { this.listRef = ref }}
                style={{ flex: 1 }}
                qcState={'search'}
                keywords={this.state.keywords}
                loadData={false}  />
        );
    }

};

function mapStateToProps(state) {
    return { ...state }
}

function mapDispatchToProps(dispatch) {
    return {
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
    }
}

function mergeProps(stateProps, dispatchProps, ownProps) {
    return Object.assign({}, ownProps, dispatchProps, {
        qualityList: stateProps.search.qualityList,
        totalQuality: stateProps.search.totalQuality,
        equipmentList: stateProps.search.equipmentList,
        totalEquipment: stateProps.search.totalEquipment,
        searchHistory: stateProps.search.searchHistory,
    })

}

export default connect(
    mapStateToProps,
    mapDispatchToProps, mergeProps, { withRef: true }
)(EquipmentSearchPage);