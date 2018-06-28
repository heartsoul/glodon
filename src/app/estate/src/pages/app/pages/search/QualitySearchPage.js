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
import API from 'app-api';

import BaseSearchPage from "./BaseSearchPage"
import * as SearchAction from "./../../actions/searchAction";
import QualityListCell from "./../quality/qualityListCell";
import EquipmentListCell from "./../equipment/equipmentListCell";
import QualityListView from "./../quality/qualityListView";
import { SearchHistory } from './SearchHistory';

export class QualitySearchPage extends BaseSearchPage {
    listRef = null;
    constructor(props) {
        super(props);
        let keywords = "";
        let state = this.props.navigation.state
        if (state && state.params && state.params.keywords) {
            keywords = state.params.keywords;
        }
        super.setFunc(this.renderContent, this.search, "请输入构件名称/质检项")
        this.states = {
            keywords: keywords,
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
        let qualityCheckpointId = this.props.navigation.getParam('qualityCheckpointId');
        let qualityCheckpointName = this.props.navigation.getParam('qualityCheckpointI');
        if (!qualityCheckpointId) {
            qualityCheckpointId = 0
        }
        if (!qualityCheckpointName) {
            qualityCheckpointName = ''
        }
        return (
            <QualityListView
                onRef={(ref) => { this.listRef = ref }}
                style={{ flex: 1 }}
                qcState={'search'}
                keywords={this.state.keywords}
                selected={true}
                loadData={false}
                qualityCheckpointId={qualityCheckpointId}
                qualityCheckpointName={qualityCheckpointName} />
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
                dispatch(SearchAction.loadHistory(SearchHistory.SEARCH_TYPE_QUALITY));
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
)(QualitySearchPage);