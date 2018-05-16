'use strict'

import React, { Component } from 'react';
import { Text, View, Image } from 'react-native';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { ListRow, PullPicker } from 'app-3rd/teaset';
import StarView from './StarView';

import * as API from "app-api";
/**
 * 检查单位、施工单位、责任人选择
 */
class SelectView extends Component {

    constructor(props) {
        super(props);
        let dataList = this.props.dataList ? this.props.dataList : [];
        let selectIndex = this.getSelectedIndex(dataList);
        let showEmpty = false;
        if (dataList.length == 0 && this.props.title != '责任人') {
            showEmpty = true;
        }
        this.state = {
            dataList: dataList,
            selectIndex: selectIndex,
            showStar: false,
            showEmpty: showEmpty,
        };
    }


    componentDidMount() {
        let { title } = this.props
        if (this.props.title === '施工单位') {
            if (this.props.selectCallback && this.props.dataList && this.props.dataList.length > 0) {
                let index = this.getSelectedSupporterIndex(this.props.dataList);
                this.props.selectCallback(this.props.dataList[index])
            }
        }
    }
    componentWillReceiveProps(nextProps) {
        this.setState({
            showStar: nextProps.showStar,
        });
        if (this.props.title === '责任人') {
            if (nextProps.extraData && this.props.extraData && nextProps.extraData.coperationId != this.props.extraData.coperationId) {
                this.setState({
                    selectIndex: -2,
                    dataList: []
                })
            }
        }
    }


    getSelectedIndex = (dataList) => {
        let index = 0;
        if (this.props.title === '检查单位' || this.props.title === '验收单位') {
            index = this.getSelectedInspectCompanyIndex(dataList);
        } else if (this.props.title === '施工单位') {
            index = this.getSelectedSupporterIndex(dataList);
        } else if (this.props.title === '责任人') {
            index = this.getSelectedPersonIndex(dataList);
        }
        return index;

    }

    getSelectedInspectCompanyIndex = (data) => {
        let index = 0;
        let value = this.props.value;
        if (data && data.length > 0) {
            if (value && value.id) {
                for (let key in data) {
                    if (data[key].id === value.id) {
                        index = key;
                        break;
                    }
                }
            }
        }
        index = parseInt(index);
        return index;
    }

    getSelectedSupporterIndex = (data) => {
        let index = 0;
        let value = this.props.value;
        if (data && data.length > 0) {
            if (value && value.id) {
                for (let key in data) {
                    if (data[key].coperationId === value.id) {
                        index = key;
                        break;
                    }
                }
            }
        }
        index = parseInt(index);
        return index;
    }

    getSelectedPersonIndex = (data, id) => {
        let index = -1;
        let value = this.props.value;
        if (data && data.length > 0) {
            if (value && value.id) {
                for (let key in data) {
                    if (data[key].userId === value.id) {
                        index = key;
                        break;
                    }
                }
            }
        }
        index = parseInt(index);
        return index;
    }

    /**
     * 查询施工单位的责任人
     */
    getPersonList = () => {
        let extraData = this.props.extraData;//施工单位
        if (!extraData) {
            //显示
            this.setState({
                showEmpty: true,
            })
            return;
        }
        let coperationId = extraData.coperationId;
        API.getPersonList(storage.loadProject(), coperationId)
            .then(data => {
                if (data && data.data && data.data.length > 0) {
                    let selectIndex = this.getSelectPersonIndex(data.data);
                    this.setState({
                        dataList: data.data,
                        selectIndex: selectIndex,
                        showEmpty: false,
                    }, () => {
                        this.showActionSheet();
                    });
                } else {
                    this.setState({
                        showEmpty: true,
                    })
                }
            }).catch((e) => {
                console.log(e);
            });
    }
    /**
     * 重新设置选中的责任人，切换施工单位时候，index会改变
     */
    getSelectPersonIndex = (persons) => {
        let selectIndex = -1;
        if (this.state.selectIndex > -1 && persons && persons.length > this.state.selectIndex) {
            let selectedItem = this.state.dataList[this.state.selectIndex];
            let newSelectItem = persons[this.state.selectIndex];
            if (selectedItem.userId === newSelectItem.userId) {
                selectIndex = this.state.selectIndex;
            }
        } else {
            selectIndex = this.getSelectedPersonIndex(persons);
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
            if (!this.state.showEmpty) {
                this.showActionSheet();
            }
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
        if (this.state.selectIndex == -1) {
            if (this.props.title === '责任人') {
                this.props.value.userId = this.props.value.id;
            }
            return this.props.value;
        } else if(this.state.selectIndex == -2){
            let ret = {}
            return {};
        }else{
            let ret = this.state.dataList[this.state.selectIndex];
            return ret;
        }
    }

    /**
     * 选中的name
     */
    getDetail = () => {
        if (this.state.showEmpty) {
            return (this.props.title === '责任人') ? "您需要去PC端添加责任人数据" : "您需要去PC端添加施工单位数据";
        }
        let detail = '';
        if (this.props.value) {
            detail = this.props.value.name;
        }
        if (this.state.selectIndex > -1) {
            detail = this.state.dataList[this.state.selectIndex].name;
        }
        if (this.props.title === '责任人' && this.state.selectIndex == -2) {
            detail = "";
        }
        return detail;
    }
    // icon_create_check_list_star

    starItemView = () => {
        return (
            <View style={{ flex: 1 }}>
                <ListRow title={this.props.title} accessory='indicator' bottomSeparator='indent' detail={this.getDetail()} onPress={() => { this.onPress() }} />
            </View>
        );
    }

    render() {
        return (
            <StarView
                showStar={this.state.showStar}
                childView={this.starItemView()}
            >
            </StarView>
        );
    }
}



SelectView.propTypes = {

    /**
     * 标题
     */
    title: PropTypes.string.isRequired,
    /**
     * 默认值
     */
    value: PropTypes.object,

    /**
     * 选中一条后的回调
     */
    selectCallback: PropTypes.func,
    /**
     * 关联的数据，选择责任人时，需要先有施工单位
     */
    extraData: PropTypes.object,
    /**
     * 校验信息时显示星号
     */
    showStar: PropTypes.bool,

};

export default SelectView;
