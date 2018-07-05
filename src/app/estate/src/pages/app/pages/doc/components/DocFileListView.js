/**
 * Created by Soul on 2018/03/16.
 */
'use strict';
import { LoadingView, NoDataView } from "app-components";
import PropTypes from 'prop-types';
import React, { Component } from "react";
import { FlatList, RefreshControl, StyleSheet, View} from "react-native";
import DocView from './DocView';

export default class extends Component {

    static propTypes = {
        dataArray: PropTypes.array.isRequired,
        onItemPresss: PropTypes.func,// 选择状态变更 (item,index)=>{xxxxx}
        onItemSelected: PropTypes.func,// 选择状态变更 (seletedItems, selected，item,index)=>{xxxxx}
        onAllItemSelected: PropTypes.func,// 选择状态变更 (seletedItems,seleted)=>{xxxxx}
        onChangeEditMode: PropTypes.func,// 编辑状态变更 (isEdit)=>{xxxxx}
        isEdit:PropTypes.bool,
        userPrivilege:PropTypes.object,
        onEndReached=PropTypes.func,
        onRefresh=PropTypes.func,
        refreshing=PropTypes.bool,
        isLoading=PropTypes.bool,
        error:PropTypes.object,
    }

    constructor(props) {
        super(props);
        const {selectedItems=[],isEdit=false,dataArray=[],refreshing=false,isLoading=true,error=null} = this.props ;
        this.state = {
            error:error,
            isLoading: isLoading,
            refreshing: refreshing,
            dataArray: dataArray,
            isEdit:isEdit,
            selectedItems:selectedItems,
            userPrivilege:userPrivilege
        }
    }
    
    // 编辑状态导航处理

    /**
     * 切换到编辑模式
     * isEdit true:开始编辑 false：取消编辑
     */
    changeEditMode = (isEdit=true) => {
        if(!isEdit) {
            this.state.selectedItems = [];
        }
        this.setState({dataArray:this.state.dataArray,isEdit:isEdit},()=>{
            this.props.onChangeEditMode && this.props.onChangeEditMode(isEdit);
        });
    }

    /**
     * 编辑状态点击了项目，就执行选择
     *
     */
    _itemSelected = (selected, item, index) => {
        item.value.selected = !selected;
        
        this.state.selectedItems = this.state.dataArray.filter(function (element, index, self) {
            return element.value.selected === true;
        });
        this.setState({dataArray:this.state.dataArray},()=>{
            this.props.onItemSelected && this.props.onItemSelected(this.state.selectedItems,!selected,item,index);
        });
    }

    /**
     * 全选操作
     * isEdit true:全选 false：取消全选
     */
    changeSelectAll = (selected = true) =>{
        this.state.dataArray.map((item)=>{
            item.value.selected = selected;
        });

        this.state.selectedItems = selected ? this.state.dataArray : [];
        this.setState({dataArray:this.state.dataArray},()=>{
            this.props.onItemSelected && this.props.onAllItemSelected(this.state.selectedItems,selected);
        }); 
    }

    _keyExtractor = (item, index) => index;

    componentDidMount() {
    }

    //加载失败view
    renderErrorView(error) {
        return ( <NoDataView text="加载失败" /> );
    }

    /**
     * 数据项点击事件处理
     *
     */
    _itemClick = (item, index) => {
        if(this.state.isEdit) {
            // 这里需要处理编辑状态，
            this._itemSelected(item.value.selected,item,index);
            return;
        }
        this.props.onItemPresss && this.props.onItemPresss(item,index);
    }

    /**
     * 数据分隔线
     *
     */
    _separator = () => {
        return <View style={{ height: 1, backgroundColor: '#ededed',marginRight:20}} />;
    }

    //返回itemView
    renderItemView = ({ item, index }) => {
        if (item.value.folder) {
            return this.renderFolderView({ item, index });
        } else {
            return this.renderFileView({ item, index });
        }
    }
    
    /**
     * 文件数据项
     *
     */
    renderFileView = ({ item, index }) => {
        let onPress = () => {this._itemClick(item, index)};
        let onMore = ()=>{this.onMore(item, index)};
        let onSelect = (event,selected) => {this._itemSelected(selected,item, index)};
        let {selected = false} = item.value;
        if(this.state.isEdit) {
            onMore = null;
        } else {
            onSelect = null;
        }
        return (
            <DocView onMore={onMore} onSelect={onSelect} selected={selected}>
                <DocView.DocFileItemView key={index} onPress={onPress}
             content={item.value.name} time={item.value.createTimeShow} fileId={item.value.fileId} ext={item.value.name}/></DocView>
        );
    }

    /**
     * 文件夹数据项
     *
     */
    renderFolderView = ({ item, index }) => {
        let onPress = () => {this._itemClick(item, index)};
        let onMore = ()=>{this.onMore(item, index)};
        let onSelect = (event,selected) => {this._itemSelected(selected,item, index)};
        let {selected = false} = item.value;
        if(this.state.isEdit) {
            onMore = null;
        } else {
            onSelect = null;
        }
        return (
            <DocView onMore={onMore} onSelect={onSelect} selected={selected}>
            <DocView.DocFolderItemView key={index} onPress={onPress}
            content={item.value.name} time={item.value.createTimeShow}/></DocView>
        );
    }

    /**
     * 列表底部视图，防止由于工具条导致数据显示不全
     *
     */
    renderFooterView = () => {
        return <View style={{height:50,width:'100%'}} />
    }

    renderEmptyView = () => {
        return <NoDataView text='暂无数据' />
    }
    /**
     * 列表
     */
    renderList = () => {
        return (
            <FlatList
                data={this.state.dataArray}
                renderItem={this.renderItemView}
                ListFooterComponent={this.renderFooterView}
                ListEmptyComponent={this.renderEmptyView}
                ItemSeparatorComponent={this._separator}
                onEndReached={this.props.onEndReached}
                onRefresh={this.props.onRefreshing}
                refreshing={this.props.refreshing}
                onEndReachedThreshold={0.1}
                refreshControl={
                    <RefreshControl
                        refreshing={this.props.refreshing}
                    />
                }
            />
        );
    }

    renderData = () => {
        return (
            <View style={styles.container}>
                <StatusBar barStyle="light-content" translucent={false} backgroundColor="#00baf3" />
                {this.renderList()}
                {this.renderToolbar(!this.props.isRoot)}
            </View>
        );
    }

    render = () => {
        //第一次加载等待的view
        if (this.state.isLoading && !this.state.error) {
            return (<LoadingView />);
        } else if (this.state.error) {
            //请求失败view
            return this.renderErrorView(this.state.errorInfo);
        }
        //加载数据
        return this.renderData();
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    containerFolderView: {
        // flex: 1,
        height: 52,
        marginLeft: 20,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFF',
    },
    containerFileView: {
        // flex: 1,
        height: 72,
        marginLeft: 20,
        flexDirection: 'row',
        alignItems: 'center'
        // backgroundColor: '#FFF',
    },
    title: {
        fontSize: 15,
        color: 'blue',
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

    image: {
        width: 30,
        height: 25,
    },
});