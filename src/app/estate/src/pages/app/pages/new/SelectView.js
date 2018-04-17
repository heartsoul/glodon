'use strict'

import React, { Component } from 'react';
import { Text, View } from 'react-native';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { ListRow, PullPicker } from 'app-3rd/teaset';

import * as API from "app-api";
/**
 * 检查单位、施工单位、责任人选择
 */
class SelectView extends Component {

    constructor(props) {
        super(props);
        this.state = {
            dataList: [],
            selectIndex: -1,
        };
    }
    /**
     * 获取数据之前先检查是否已经选择项目
     */
    fetchData = (fetchData) => {
        if (storage.projectId === 0) {
            storage.loadProject((projectId) => {
                storage.projectId = projectId;
                fetchData();
            });
        } else {
            fetchData();
        }
    }

    componentDidMount() {
        let { title } = this.props

        if (this.props.title === '检查单位') {
            this.fetchData(this.getInspectionCompanies);
        } else if (this.props.title === '施工单位') {
            this.fetchData(this.getCompaniesList);
        }
    }

    /**
     * 获取项目下检查单位列表
     */
    getInspectionCompanies = () => {
        API.getInspectionCompanies(storage.projectId)
            .then(data => {
                this.setState({
                    dataList: data.data,
                    selectIndex: data.data && data.data.length > 0 && 0,
                });

            });
    }

    /**
     * 获取施工单位列表
     */
    getCompaniesList = () => {
        API.getCompaniesList(storage.projectId, 'SGDW')
            .then(data => {
                this.setState({
                    dataList: data.data,
                    selectIndex: data.data && data.data.length > 0 && 0,
                });

                if (this.props.selectCallback && data.data.length > 0) {
                    this.props.selectCallback(data.data[0])
                }
            });
    }

    /**
     * 查询施工单位的责任人
     */
    getPersonList = () => {
        let extraData = this.props.extraData;//施工单位
        if (!extraData) {
            return;
        }
        this.fetchData(() => {
            let coperationId = extraData.coperationId;
            API.getPersonList(storage.projectId, coperationId)
                .then(data => {
                    let selectIndex = this.getSelectPersonIndex(data.data);
                    this.setState({
                        dataList: data.data,
                        selectIndex: selectIndex,
                    }, () => {
                        this.showActionSheet();
                    });

                });
        });
    }
    /**
     * 重新设置选中的责任人，切换施工单位时候，index会改变
     */
    getSelectPersonIndex = (persons) => {
        let selectIndex = -1;
        if (this.state.selectIndex != -1 && persons && persons.length > this.state.selectIndex) {
            let selectedItem = this.state.dataList[this.state.selectIndex];
            let newSelectItem = persons[this.state.selectIndex];
            if (selectedItem.id === newSelectItem.id) {
                selectIndex = this.state.selectIndex;
            }
        }

        return selectIndex;
    }

    /**
     * 如果点击的是责任人先获取数据
     */
    onPress = () => {
        if (this.props.title === '责任人') {
            this.getPersonList();
        } else {
            this.showActionSheet();
        }
    }

    //选中ActionSheet中的item
    onItemSelect = (item, index) => {
        this.setState({
            selectIndex: index
        });
        if (this.props.selectCallback) {
            this.props.selectCallback(item)
        }
    }

    showActionSheet = () => {
        PullPicker.show(
            `选择${this.props.title}`,
            this.state.dataList,
            this.state.selectIndex,
            (item, index) => this.onItemSelect(item, index),
            { getItemText: (item, index) => { return item.name } }
        );
    }
    /**
     * 选中的数据
     */
    getSelectedData = () => {
        return (this.state.selectIndex != -1) ? this.state.dataList[this.state.selectIndex] : null;
    }

    render() {
        return (
            <View>
                <ListRow title={this.props.title} accessory='indicator' bottomSeparator='indent' detail={this.state.selectIndex > -1 ? this.state.dataList[this.state.selectIndex].name : ""} onPress={() => { this.onPress() }} />
            </View>
        );
    }
}

SelectView.propTypes = {

    /**
     * 标题
     */
    title: PropTypes.string.isRequired,

    /**
     * 选中一条后的回调
     */
    selectCallback: PropTypes.func,
    /**
     * 关联的数据，选择责任人时，需要先有施工单位
     */
    extraData: PropTypes.object,

};

export default SelectView;
