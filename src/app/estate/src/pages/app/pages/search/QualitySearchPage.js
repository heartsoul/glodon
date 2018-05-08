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
import QualityListCell from "./../quality/qualityListCell";
import EquipmentListCell from "./../equipment/equipmentListCell";
import QualityListView from "./../quality/qualityListView";

class QualitySearchPage extends BaseSearchPage {
    listRef = null;
    constructor(props) {
        super(props);
        super.setFunc(this.renderContent,this.search)

    };

    search = (keywords) => {
        if(this.listRef){
            this.listRef.fetchData("search")
        }
    }

    renderContent() {
        return (
            <QualityListView
                onRef={(ref) => { this.listRef = ref }}
                style={{ flex: 1 }}
                qcState={'search'}
                selected={true}
                loadData={true} />
        );
    }

    //返回itemView
    renderQualityItemView = ({ item, index }) => {
        item.showTime = "" + API.formatUnixtimestamp(item.updateTime);
        item.index = index;
        item.qcStateShow = "" + API.toQcStateShow(item.qcState);
        if (item.files && item.files.size > 0) {
            item.url = item.files[0].url;
        }
        item = {
            key: "" + item.id,
            value: item,
        }
        return (
            <QualityListCell key={item.key} onCellAction={this.onCellAction} item={item} index={index} />
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
)(QualitySearchPage);