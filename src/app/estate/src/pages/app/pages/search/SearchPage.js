'use strict';
import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    StatusBar,
    SafeAreaView,
    ScrollView,
    Image,
    TouchableOpacity,
} from 'react-native';
import { connect } from 'react-redux';
import API from 'app-api';

import BaseSearchPage from "./BaseSearchPage"
import * as SearchAction from "./../../actions/searchAction";
import QualityListCell from "./../quality/qualityListCell";
import EquipmentListCell from "./../equipment/equipmentListCell";
import * as qualityListAction from '../../actions/qualityListAction'
import * as equipmentAction from '../../actions/equipmentListAction'
import { SearchHistory } from './SearchHistory';

export class SearchPage extends BaseSearchPage {

    constructor(props) {
        super(props);
        super.setFunc(this.renderContent, this.search, "请输入构件名称/质检项/材设名称")
        this.states = {
            keywords: "",
        }
    };

    search = (keywords) => {
        this.setState({
            keywords: keywords,
        }, () => {
            this.props.search(keywords);
        })
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.updateIndex != this.props.updateIndex) {
            if (this.state.keywords && this.state.keywords.length > 0) {
                this.props.search(this.state.keywords);
            }
        }
    }

    onQualityCellAction = (item, index, type) => {
        if (type == 'delete') {
            this.props.deleteQualityData("", item.value.id, item.value.inspectionType)
            return;
        }
        if (type == 'submit') {
            this.props.submitQualityData("", item.value.id, item.value.inspectionType)
            return;
        }
    }

    onEquipmentCellAction = (item, index, type) => {
        if (type == 'delete') {
            this.props.deleteEquipmentData(item.value.id)
            return;
        }
        if (type == 'submit') {
            this.props.submitEquipmentData(item.value.id)
            return;
        }
    }

    /**
     * 设置给BaseSearchView的content
     */
    renderContent() {
        let qualityLen = (this.props.qualityList) ? this.props.qualityList.length : 0;
        let equipmentLen = (this.props.equipmentList) ? this.props.equipmentList.length : 0;
        let total = qualityLen + equipmentLen;
        if (total == 0 && this.state.keywords && this.state.keywords.length > 0) {
            return this.renderEmpty();
        }
        return (
            <ScrollView style={{ marginBottom: 20 }}>
                <View style={{ height: "100%" }}>
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
    renderEmpty() {
        return (
            <View style={styles.emptyContainer}>
                <Text>很抱歉，没有找到相关的内容</Text>
            </View>
        )
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
            <QualityListCell key={item.key} onCellAction={this.onQualityCellAction} item={item} index={index} />
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
            <EquipmentListCell key={item.key} onCellAction={this.onEquipmentCellAction} item={item} index={index} keywords={this.state.keywords} />
        );
    }

    renderQualityContent = () => {
        if (this.props.qualityList && this.props.qualityList.length > 0) {
            return (
                <View >
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

    renderMoreView = (moreCallback) => {
        return (
            <TouchableOpacity onPress={(event) => { event.preventDefault(); moreCallback && moreCallback(event) }}>
                <View style={{ flexDirection: "row", alignItems: "center", paddingLeft: 20, paddingRight: 20, marginTop: 5 }}>
                    <View style={{ height: 1, backgroundColor: "#e6e6e6", flex: 1 }}></View>
                    <Text style={{ color: "#b0b0b0", fontSize: 14, marginLeft: 10 }}>查看更多</Text>
                    <Image style={{ width: 14, height: 8, marginLeft: 5, marginRight: 10 }} source={require("app-images/icon_drawer_arrow_down.png")} />
                    <View style={{ height: 1, backgroundColor: "#e6e6e6", flex: 1 }}></View>
                </View>
            </TouchableOpacity>
        );
    }

    moreQuality = () => {
        this.props.navigation.navigate("QualitySearchPage", { keywords: this.state.keywords })
    }

    moreEquipment = () => {
        this.props.navigation.navigate("EquipmentSearchPage", { keywords: this.state.keywords })
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
                dispatch(SearchAction.loadHistory(SearchHistory.SEARCH_TYPE_GLOBAL));
            }
        },
        deleteQualityData: (qcState, inspectId, inspectionType, qualityCheckpointId, qualityCheckpointName) => {
            if (dispatch) {
                dispatch(qualityListAction.deleteData(qcState, inspectId, inspectionType, qualityCheckpointId, qualityCheckpointName))
            }
        },
        submitQualityData: (qcState, inspectId, inspectionType, qualityCheckpointId, qualityCheckpointName) => {
            if (dispatch) {
                dispatch(qualityListAction.submitData(qcState, inspectId, inspectionType, qualityCheckpointId, qualityCheckpointName))
            }
        },
        deleteEquipmentData: (id) => {
            if (dispatch) {
                dispatch(equipmentAction.deleteData(id))
            }
        },
        submitEquipmentData: (id) => {
            if (dispatch) {
                dispatch(equipmentAction.submitData(id))
            }
        },
    }
}

function mergeProps(stateProps, dispatchProps, ownProps) {
    return Object.assign({}, ownProps, dispatchProps, {
        qualityList: stateProps.search.qualityList,
        totalQuality: stateProps.search.totalQuality,
        equipmentList: stateProps.search.equipmentList,
        totalEquipment: stateProps.search.totalEquipment,
        searchHistory: stateProps.search.searchHistory,
        updateIndex: stateProps.updateData.updateIndex

    })

}
const styles = StyleSheet.create({
    emptyContainer: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
    },
})
export default connect(
    mapStateToProps,
    mapDispatchToProps, mergeProps, { withRef: true }
)(SearchPage);