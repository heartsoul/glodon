/**
 * Created by Soul on 2018/03/16.
 */
'use strict';
import { LoadingView, NoDataView } from "app-components";
import PropTypes from 'prop-types';
import React, { Component } from "react";
import { FlatList, RefreshControl, StyleSheet, View} from "react-native";

export default class DataFileListViewBase extends Component {

    static propTypes = {
        dataArray: PropTypes.array.isRequired,
        onItemPresss: PropTypes.func,// 选择状态变更 (item,index)=>{xxxxx}
        onEndReached=PropTypes.func,
        onRefresh=PropTypes.func,
        refreshing=PropTypes.bool,
        isLoading=PropTypes.bool,
        error:PropTypes.object,
        renderItemView: PropTypes.func.isRequired, // 数据展示项目
        renderSeparatorView: PropTypes.func, // 数据展示分隔项
        renderEmptyView: PropTypes.func, // 数据空页面
        renderFooterView: PropTypes.func, // 数据头
        renderHeaderView: PropTypes.func, // 数据尾
        renderListHeader: PropTypes.func, // 数据列表头
        renderListFooter: PropTypes.func, // 数据列表尾
        renderKeyExtractor: PropTypes.func, // 数据列表唯一key生产
        dataListStyle:PropTypes.any, // 数据列表样式
    }

    constructor(props) {
        super(props);
        const {dataArray=[],refreshing=false,isLoading=true,error=null} = props ;
        this.state = {
            error:error,
            isLoading: isLoading,
            refreshing: refreshing,
            dataArray: dataArray,
        }
    }
    
    renderKeyExtractor = (item, index) => index;

    componentDidMount() {
    }

    //加载失败view
    renderErrorView(error) {
        return ( <NoDataView text="加载失败" /> );
    }

    /**
     * 数据分隔线
     *
     */
    renderSeparatorView = () => {
        return <View style={{ height: 1, backgroundColor: '#ededed'}} />;
    }

   
    /**
     * 外的数据列表头
     *
     * @memberof DataFileListViewBase
     */
    renderListHeader = () => {
        if(this.props.renderListHeader) {
            return this.props.renderListHeader(this);
        }
        return null;
    }

    /**
     * 外的数据列表尾部,一般是一个浮动的工具条
     *
     * @memberof DataFileListViewBase
     */
    renderListFooter = () => {
        if(this.props.renderListFooter) {
            return this.props.renderListHeader(this);
        }
        return null;
    }
    
    /**
     * 无数据状态
     *
     * @memberof DataFileListViewBase
     */
    renderEmptyView = () => {
        return <NoDataView text='暂无数据' />
    }
    /**
     * 数据列表
     */
    renderList = () => {
        const {renderEmptyView=this.renderEmptyView,
            renderFooterView=this.renderFooterView,
            renderHeaderView=null,
            renderSeparatorView=this.renderSeparatorView,
            renderKeyExtractor=this.renderKeyExtractor,
            dataListStyle={}
        } = this.props;
        return (
            <FlatList style={[dataListStyle]}
                data={this.state.dataArray}
                keyExtractor={renderKeyExtractor}
                renderItem={this.props.renderItemView}
                ListHeaderComponent={renderHeaderView}
                ListFooterComponent={renderFooterView}
                ListEmptyComponent={renderEmptyView}
                ItemSeparatorComponent={renderSeparatorView}
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
                {this.renderListHeader()}
                {this.renderList()}
                {this.renderListFooter()}
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
    }
});