import React, { Component } from 'react';
import {
    View,
    Text,
    FlatList,
    StyleSheet,
} from 'react-native';
import DocMarkupItemView from './DocMarkupItemView'
import { connect } from 'react-redux';
import * as DocMarkupAction from '../../../actions/docMarkupAction';

class DocMarkupList extends Component {

    constructor(props) {
        super(props);
        this.state = {
            listType: this.props.listType,
            modelVersionId: '07ca09dc1dc4482b9edf48e2ba8115b8',
            fileId: '5216266',
        };
    }

    componentDidMount() {
        this._fetchData(0)
    }
    _fetchData = (page) => {
        this.props.fetchData(this.props.listType, this.state.modelVersionId, this.state.fileId, this.props.data, null, page);
    }

    _onRefresh = () => {
        if (this.props.isLoading) {
            return;
        }
        this._fetchData(0)
    }

    _onEndReached = () => {
        if (this.props.isLoading || this.props.hasMore == false) {
            return;
        }
        this._fetchData(this.props.page + 1)
    }

    _emptyView = () => {
        return (
            <View>
                <Text>empty</Text>
            </View>
        )
    }

    _renderItem = (item, index) => {
        return (
            <DocMarkupItemView
                key={`markup-item-key-${index}`}
                markup={item}
                onItemPress={() => {
                    //进入批注详情
                    let navigator = this.props.navigation;
                    storage.pushNext(navigator, "DocMarkupDetailPage");
                }}
                onThumbnailPress={() => {
                    //进入模型
                    alert("thumb")
                }}
            />
        )
    }

    render() {
        return (
            <View style={{ height: "100%" }}>
                <FlatList
                    data={this.props.data}
                    renderItem={({ item, index }) => { return this._renderItem(item, index) }}
                    onRefresh={this._onRefresh}
                    refreshing={this.props.isLoading}
                    onEndReached={this._onEndReached}
                    onEndReachedThreshold={1}
                    ListEmptyComponent={this._emptyView}
                />
            </View>
        );
    }
}


function mapStateToProps(state) {
    return { ...state }
}

function mergeProps(stateProps, dispatchProps, ownProps) {
    return Object.assign({}, ownProps, dispatchProps, {
        page: stateProps.docMarkup.datas[ownProps.listType].page,
        isLoading: stateProps.docMarkup.datas[ownProps.listType].isLoading,
        data: stateProps.docMarkup.datas[ownProps.listType].data,
        hasMore: stateProps.docMarkup.datas[ownProps.listType].hasMore,
    })
}

export default connect(
    mapStateToProps,
    dispatch => ({
        fetchData: (listType, modelVersionId, fileId, dataMap, creatorId, pageIndex) => {
            dispatch(DocMarkupAction.fetchData(listType, modelVersionId, fileId, dataMap, creatorId, pageIndex));
        },
    }),
    mergeProps
)(DocMarkupList)
