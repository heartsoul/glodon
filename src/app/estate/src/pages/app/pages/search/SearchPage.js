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

class SearchPage extends BaseSearchPage {

    constructor(props) {
        super(props);
        super.setFunc(this.renderContent,this.props.search)
    };
    
    onCellAction = () => {

    }

    /**
     * 设置给BaseSearchView的content
     */
    renderContent() {
        return (
            <ScrollView style={{ marginBottom: 20 }}>
                <View>
                    {
                        this.renderQualityContent()
                    }
                    {
                        this.renderEquipmentContent()
                    }
                </View>
            </ScrollView>
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
    //返回itemView
    renderEquipmentItemView = ({ item, index }) => {
        item.showTime = "" + API.formatUnixtimestamp(item.updateTime);
        item.index = index;
        item.qcStateShow = item.committed == true ? "" : "" + API.toQcStateShow(API.QC_STATE_STAGED);
        item.qcStateColor = item.committed == true ? "#FFFFFF" : "" + API.toQcStateShowColor(API.QC_STATE_STAGED);
        item = {
            key: "" + item.id,
            value: item,
        }
        return (
            <EquipmentListCell key={item.key} onCellAction={this.onCellAction} item={item} index={index} />
        );
    }

    renderQualityContent = () => {
        if (this.props.qualityList && this.props.qualityList.length > 0) {
            return (
                <View style={{ flex: 1 }}>
                    <Text style={{ color: "#5e5e5e", fontSize: 14, marginLeft: 20, marginTop: 5 }}>质检清单</Text>
                    {
                        this.props.qualityList.map((item, index) => {
                            return this.renderQualityItemView({ item, index })
                        })
                    }
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
                    {
                        this.props.equipmentList.map((item, index) => {
                            return this.renderEquipmentItemView({ item, index })
                        })
                    }

                    {
                        this.props.equipmentList.length < this.props.totalEquipment ? this.renderMoreView(this.moreEquipment) : null
                    }
                </View>
            );
        } else {
            return null;
        }
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
)(SearchPage);